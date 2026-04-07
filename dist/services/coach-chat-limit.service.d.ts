import type { IUserSubscription } from '../models/User.model.js';
export declare function utcDayString(d?: Date): string;
export declare function coachChatMemoryKey(userId: string, day?: string): string;
export declare function getCoachMessagesUsedToday(userId: string): Promise<number>;
export declare function incrementCoachMessagesToday(userId: string): Promise<number>;
export declare function assertCoachChatUnderLimit(params: {
    userId: string;
    role: string;
    subscription?: IUserSubscription | null;
}): Promise<{
    ok: true;
    used: number;
    limit: number;
} | {
    ok: false;
    used: number;
    limit: number;
}>;
export declare function recordCoachMessageSent(userId: string, role: string, subscription?: IUserSubscription | null): Promise<void>;
/** Redis: brief dismissed for UTC day */
export declare function isCoachBriefDismissed(userId: string, day?: string): Promise<boolean>;
export declare function dismissCoachBrief(userId: string, day?: string): Promise<void>;
//# sourceMappingURL=coach-chat-limit.service.d.ts.map