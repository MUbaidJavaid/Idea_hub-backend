import type { IUserSubscription } from '../models/User.model.js';
export type DailyBriefPayload = {
    greeting: string;
    summaryLines: string[];
    todayChallenge: {
        title: string;
        description: string;
        xpReward: number;
    };
    trendingInsight: string;
    motivationalMessage: string;
    briefDay: string;
    generatedAt: string;
};
export declare function generateIdeaFeedback(ideaId: string): Promise<void>;
export declare function scheduleIdeaCoachFeedback(ideaId: string): void;
export declare function buildDailyBrief(userId: string): Promise<DailyBriefPayload | null>;
export declare function deliverDailyBriefNotification(userId: string, brief: DailyBriefPayload): Promise<void>;
export declare function getDailyBriefForUser(userId: string): Promise<{
    brief: DailyBriefPayload | null;
    dismissed: boolean;
}>;
export declare function dismissDailyBriefCard(userId: string): Promise<void>;
export declare function coachChat(params: {
    userId: string;
    message: string;
    ideaId?: string | null;
}): Promise<string>;
export declare function coachChatWithLimit(params: {
    userId: string;
    userRole: string;
    subscription?: IUserSubscription | null;
    message: string;
    ideaId?: string | null;
}): Promise<{
    reply: string;
    messagesUsedToday: number;
    limit: number;
}>;
//# sourceMappingURL=AICoachService.d.ts.map