import Stripe from 'stripe';
export declare function getStripe(): Stripe | null;
export declare function resolveCheckoutPriceId(plan: 'pro' | 'investor', interval: 'month' | 'year'): string | null;
export declare function createCheckoutSession(input: {
    userId: string;
    email: string;
    plan: 'pro' | 'investor';
    interval: 'month' | 'year';
}): Promise<{
    url: string;
} | {
    error: string;
}>;
export declare function createBillingPortalSession(userId: string): Promise<{
    url: string;
} | {
    error: string;
}>;
export declare function applyStripeSubscriptionToUser(input: {
    userId: string;
    customerId: string;
    subscription: Stripe.Subscription;
}): Promise<void>;
export declare function clearStripeSubscription(userId: string): Promise<void>;
export declare function handleStripeWebhookRaw(rawBody: Buffer, signature: string | undefined): Promise<{
    received: true;
} | {
    error: string;
}>;
//# sourceMappingURL=stripe-billing.service.d.ts.map