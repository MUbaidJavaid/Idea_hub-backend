export const FREE_TIER_IDEAS_PER_MONTH = 3;
/** UTC month start for counting idea posts */
export function startOfUtcMonth(d = new Date()) {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0, 0));
}
export function getSubscriptionFromUser(user) {
    const s = user?.subscription;
    if (s && typeof s === 'object') {
        return {
            plan: s.plan ?? 'free',
            status: s.status ?? 'active',
            stripeCustomerId: s.stripeCustomerId ?? '',
            stripeSubscriptionId: s.stripeSubscriptionId ?? '',
            currentPeriodEnd: s.currentPeriodEnd ?? null,
        };
    }
    return {
        plan: 'free',
        status: 'active',
        stripeCustomerId: '',
        stripeSubscriptionId: '',
        currentPeriodEnd: null,
    };
}
/**
 * Paid access while period not ended; cancelled subscriptions stay valid until
 * `currentPeriodEnd` (Stripe behavior).
 */
export function getEffectivePlan(user) {
    if (user.role === 'moderator' || user.role === 'super_admin') {
        return 'investor';
    }
    const s = getSubscriptionFromUser(user);
    if (s.plan === 'free')
        return 'free';
    const end = s.currentPeriodEnd
        ? new Date(s.currentPeriodEnd).getTime()
        : 0;
    if (!end || end <= Date.now()) {
        return 'free';
    }
    if (s.status === 'expired') {
        return 'free';
    }
    if (s.plan === 'pro' || s.plan === 'investor') {
        return s.plan;
    }
    return 'free';
}
export function hasPaidProOrInvestor(user) {
    const p = getEffectivePlan(user);
    return p === 'pro' || p === 'investor';
}
export function hasInvestorAccess(user) {
    return getEffectivePlan(user) === 'investor';
}
/** BullMQ job priority: higher = processed sooner */
export function scanJobPriorityForUser(user) {
    if (user.role === 'moderator' || user.role === 'super_admin')
        return 25;
    const p = getEffectivePlan(user);
    if (p === 'investor')
        return 20;
    if (p === 'pro')
        return 10;
    return 1;
}
//# sourceMappingURL=subscription.js.map