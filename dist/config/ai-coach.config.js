export function aiCoachEnabled() {
    return String(process.env.ENABLE_AI_COACH ?? '').toLowerCase() === 'true';
}
/** Free tier: max coach chat messages per user per UTC day. */
export function coachFreeDailyMessageLimit() {
    const n = Number(process.env.COACH_FREE_DAILY_MESSAGES ?? '10');
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 10;
}
/** node-cron timezone for morning brief (default UTC). */
export function coachDailyBriefTimezone() {
    return process.env.COACH_DAILY_BRIEF_TZ?.trim() || 'UTC';
}
//# sourceMappingURL=ai-coach.config.js.map