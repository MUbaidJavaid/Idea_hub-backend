import mongoose from 'mongoose';
import Stripe from 'stripe';

import {
  frontendBaseUrl,
  planFromStripePriceId,
  stripePriceInvestorMonthly,
  stripePriceInvestorYearly,
  stripePriceProMonthly,
  stripePriceProYearly,
  stripeSecretKey,
  stripeWebhookSecret,
} from '../config/stripe.config.js';
import type { SubscriptionPlan, SubscriptionStatus } from '../models/User.model.js';
import { User } from '../models/index.js';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = stripeSecretKey();
  if (!key) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export function resolveCheckoutPriceId(
  plan: 'pro' | 'investor',
  interval: 'month' | 'year'
): string | null {
  if (plan === 'pro') {
    return interval === 'year'
      ? stripePriceProYearly() || null
      : stripePriceProMonthly() || null;
  }
  return interval === 'year'
    ? stripePriceInvestorYearly() || null
    : stripePriceInvestorMonthly() || null;
}

export async function createCheckoutSession(input: {
  userId: string;
  email: string;
  plan: 'pro' | 'investor';
  interval: 'month' | 'year';
}): Promise<{ url: string } | { error: string }> {
  const stripe = getStripe();
  const priceId = resolveCheckoutPriceId(input.plan, input.interval);
  if (!stripe) {
    return { error: 'Billing is not configured' };
  }
  if (!priceId) {
    return { error: 'Missing Stripe price ID for this plan' };
  }

  const user = await User.findById(input.userId).select('subscription');
  if (!user) {
    return { error: 'User not found' };
  }

  const customerId = user.subscription?.stripeCustomerId?.trim();
  const base = frontendBaseUrl();

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    ...(customerId
      ? { customer: customerId }
      : { customer_email: input.email }),
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${base}/pricing?checkout=success`,
    cancel_url: `${base}/pricing?checkout=cancel`,
    metadata: {
      userId: input.userId,
      plan: input.plan,
      interval: input.interval,
    },
    subscription_data: {
      metadata: {
        userId: input.userId,
        plan: input.plan,
      },
    },
    allow_promotion_codes: true,
  });

  if (!session.url) {
    return { error: 'Checkout session missing URL' };
  }
  return { url: session.url };
}

export async function createBillingPortalSession(
  userId: string
): Promise<{ url: string } | { error: string }> {
  const stripe = getStripe();
  if (!stripe) {
    return { error: 'Billing is not configured' };
  }
  const user = await User.findById(userId).select('subscription');
  const customerId = user?.subscription?.stripeCustomerId?.trim();
  if (!customerId) {
    return { error: 'No billing account yet. Subscribe from Pricing first.' };
  }
  const base = frontendBaseUrl();
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${base}/pricing`,
  });
  return { url: session.url };
}

function mapStripeStatus(
  status: Stripe.Subscription.Status
): SubscriptionStatus {
  if (status === 'canceled' || status === 'unpaid' || status === 'incomplete_expired') {
    return 'expired';
  }
  if (status === 'active' || status === 'trialing') {
    return 'active';
  }
  if (status === 'past_due') {
    return 'active';
  }
  return 'cancelled';
}

function planFromSubscription(
  sub: Stripe.Subscription,
  fallbackPlan: SubscriptionPlan
): SubscriptionPlan {
  const meta = sub.metadata?.plan as SubscriptionPlan | undefined;
  if (meta === 'pro' || meta === 'investor') return meta;
  const item = sub.items.data[0];
  const priceId = item?.price?.id;
  if (priceId) {
    const p = planFromStripePriceId(priceId);
    if (p) return p;
  }
  return fallbackPlan;
}

export async function applyStripeSubscriptionToUser(input: {
  userId: string;
  customerId: string;
  subscription: Stripe.Subscription;
}): Promise<void> {
  const plan = planFromSubscription(input.subscription, 'pro');
  const status = mapStripeStatus(input.subscription.status);
  const endSec = input.subscription.current_period_end;
  const currentPeriodEnd =
    typeof endSec === 'number' ? new Date(endSec * 1000) : null;

  await User.findByIdAndUpdate(input.userId, {
    $set: {
      'subscription.stripeCustomerId': input.customerId,
      'subscription.stripeSubscriptionId': input.subscription.id,
      'subscription.plan': plan,
      'subscription.status': status,
      'subscription.currentPeriodEnd': currentPeriodEnd,
    },
  });
}

export async function clearStripeSubscription(userId: string): Promise<void> {
  await User.findByIdAndUpdate(userId, {
    $set: {
      'subscription.plan': 'free',
      'subscription.status': 'expired',
      'subscription.stripeSubscriptionId': '',
      'subscription.currentPeriodEnd': null,
    },
  });
}

export async function handleStripeWebhookRaw(
  rawBody: Buffer,
  signature: string | undefined
): Promise<{ received: true } | { error: string }> {
  const stripe = getStripe();
  const whSecret = stripeWebhookSecret();
  if (!stripe || !whSecret) {
    return { error: 'Stripe webhook not configured' };
  }
  if (!signature) {
    return { error: 'Missing stripe-signature header' };
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, whSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Invalid payload';
    return { error: msg };
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== 'subscription') break;
        const userId = session.metadata?.userId;
        const subId = session.subscription;
        const customerId = session.customer;
        if (
          !userId ||
          !mongoose.Types.ObjectId.isValid(userId) ||
          typeof subId !== 'string' ||
          typeof customerId !== 'string'
        ) {
          console.warn('[stripe] checkout.session.completed missing fields');
          break;
        }
        const sub = await stripe.subscriptions.retrieve(subId);
        await applyStripeSubscriptionToUser({
          userId,
          customerId,
          subscription: sub,
        });
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const sub = event.data.object as Stripe.Subscription;
        let userId = sub.metadata?.userId;
        const customerId =
          typeof sub.customer === 'string'
            ? sub.customer
            : (sub.customer as Stripe.Customer | null)?.id ?? '';
        if (!customerId) break;
        if (!userId || !mongoose.Types.ObjectId.isValid(String(userId))) {
          const bySub = await User.findOne({
            'subscription.stripeSubscriptionId': sub.id,
          }).select('_id');
          if (!bySub) break;
          userId = String(bySub._id);
        }
        await applyStripeSubscriptionToUser({
          userId: String(userId),
          customerId,
          subscription: sub,
        });
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
          await clearStripeSubscription(userId);
          break;
        }
        const u = await User.findOne({
          'subscription.stripeSubscriptionId': sub.id,
        }).select('_id');
        if (u) await clearStripeSubscription(String(u._id));
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error('[stripe] webhook handler error', e);
    return { error: 'Webhook processing failed' };
  }

  return { received: true };
}
