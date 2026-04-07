import type { IUserSubscription } from '../models/User.model.js';
export type EffectivePlan = 'free' | 'pro' | 'investor';
export declare const FREE_TIER_IDEAS_PER_MONTH = 3;
/** UTC month start for counting idea posts */
export declare function startOfUtcMonth(d?: Date): Date;
export declare function getSubscriptionFromUser(user: {
    subscription?: IUserSubscription | null;
    role?: string;
} | null | undefined): IUserSubscription;
/**
 * Paid access while period not ended; cancelled subscriptions stay valid until
 * `currentPeriodEnd` (Stripe behavior).
 */
export declare function getEffectivePlan(user: {
    subscription?: IUserSubscription | null;
    role?: string;
}): EffectivePlan;
export declare function hasPaidProOrInvestor(user: {
    subscription?: IUserSubscription | null;
    role?: string;
}): boolean;
export declare function hasInvestorAccess(user: {
    subscription?: IUserSubscription | null;
    role?: string;
}): boolean;
/** BullMQ job priority: higher = processed sooner */
export declare function scanJobPriorityForUser(user: {
    subscription?: IUserSubscription | null;
    role?: string;
}): number;
//# sourceMappingURL=subscription.d.ts.map