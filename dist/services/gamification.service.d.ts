import { type Types } from 'mongoose';
import { type XpRewardKey } from '../config/xp.config.js';
import type { IUserProgressDocument } from '../models/UserProgress.model.js';
export declare function isGamificationEnabled(): boolean;
export declare function currentWeekBucket(d?: Date): string;
export declare function ensureUserProgress(userId: string | Types.ObjectId): Promise<IUserProgressDocument | null>;
export declare function grantBadge(progress: IUserProgressDocument, badgeId: string): Promise<boolean>;
export declare function addXpByKey(userId: string, key: XpRewardKey): Promise<void>;
export declare function addXpAmount(userId: string, amount: number): Promise<void>;
export declare function evaluateBadges(progress: IUserProgressDocument): Promise<void>;
export declare function recordDailyActivity(userId: string): Promise<void>;
export declare function onIdeaPublished(authorId: string, category: string): Promise<void>;
export declare function onIdeaDuetPublished(duetAuthorId: string, originalAuthorId: string): Promise<void>;
export declare function onIdeaReceivedLike(authorId: string, newLikeCount: number): Promise<void>;
export declare function onLikeGiven(likerId: string): Promise<void>;
export declare function onCommentPosted(userId: string): Promise<void>;
export declare function onCollabRequestSent(requesterId: string): Promise<void>;
export declare function onCollabAccepted(requesterId: string): Promise<void>;
export declare function onValidationVote(userId: string): Promise<void>;
export declare function onIdeaTrending(authorId: string): Promise<void>;
export declare function onSavedIdea(userId: string): Promise<void>;
export declare function onIdeaQualityScore(authorId: string, total: number): Promise<void>;
export declare function onNewFollower(followingId: string): Promise<void>;
export declare function grantTopWeeklyBadge(userIds: string[]): Promise<void>;
export declare function previousWeekBucket(): string;
/** Monday 00:00 UTC weekly job: badge last week’s top 10, reset XP + challenges. */
export declare function runWeeklyGamificationReset(): Promise<void>;
export declare function progressToApi(p: IUserProgressDocument): Record<string, unknown>;
export declare function getLeaderboard(opts: {
    weekBucket: string;
    limit: number;
    followingIds?: Types.ObjectId[];
    category?: string;
}): Promise<Array<{
    rank: number;
    userId: string;
    username: string;
    fullName: string;
    avatarUrl: string;
    weeklyXpEarned: number;
    level: number;
    levelTitle: string;
}>>;
export declare function getUserRank(userId: string, weekBucket: string): Promise<number | null>;
//# sourceMappingURL=gamification.service.d.ts.map