/**
 * Gamification: XP rewards, level curve, titles, badges, weekly challenge templates.
 */
export declare const XP_REWARDS: {
    readonly post_idea: 50;
    readonly idea_gets_like: 5;
    readonly idea_reaches_50_likes: 100;
    readonly idea_reaches_100_likes: 250;
    readonly collab_request_sent: 10;
    readonly collab_accepted: 75;
    readonly comment_posted: 5;
    readonly daily_login: 10;
    readonly streak_7_days: 100;
    readonly streak_30_days: 500;
    readonly validation_vote_given: 3;
    /** Published a duet / response building on someone else's idea */
    readonly duet_published: 40;
    /** Original idea author credited when their idea receives a published duet */
    readonly duet_original_credited: 25;
    readonly idea_goes_trending: 200;
    readonly first_idea: 150;
    readonly weekly_challenge_complete: 500;
};
export type XpRewardKey = keyof typeof XP_REWARDS;
/** Cumulative total XP required to *reach* each level (1-indexed: index 0 = level 1 at 0 XP). */
export declare const LEVEL_MIN_TOTAL_XP: number[];
export declare function levelFromTotalXp(totalXp: number): {
    level: number;
    title: string;
    emoji: string;
    xpIntoLevel: number;
    xpToNext: number;
};
export declare function levelEmojiFor(level: number): string;
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type BadgeDefinition = {
    id: string;
    name: string;
    description: string;
    rarity: BadgeRarity;
};
/** 30 badges — earn conditions evaluated in gamification.service */
export declare const BADGE_DEFINITIONS: BadgeDefinition[];
export type ChallengeMetric = 'ideas_posted' | 'comments_posted' | 'likes_given' | 'collabs_accepted' | 'validation_votes' | 'likes_received_on_ideas';
export type WeeklyChallengeTemplate = {
    id: string;
    title: string;
    description: string;
    metric: ChallengeMetric;
    target: number;
    /** Optional filter for idea category */
    category?: string;
};
export declare const WEEKLY_CHALLENGE_POOL: WeeklyChallengeTemplate[];
export declare function pickWeeklyChallenge(seed: number): WeeklyChallengeTemplate;
//# sourceMappingURL=xp.config.d.ts.map