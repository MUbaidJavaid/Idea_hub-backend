import { type Document, type Model, type Types } from 'mongoose';
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';
export interface IUserProgressBadge {
    badgeId: string;
    earnedAt: Date;
    rarity: BadgeRarity;
}
export type ChallengeMetric = 'ideas_posted' | 'comments_posted' | 'likes_given' | 'collabs_accepted' | 'validation_votes' | 'likes_received_on_ideas';
export interface IUserWeeklyChallenge {
    challengeId: string;
    title: string;
    description: string;
    metric: ChallengeMetric;
    target: number;
    progress: number;
    completed: boolean;
    weekOf: Date;
    category?: string;
}
export interface IUserProgress {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    totalXP: number;
    level: number;
    levelTitle: string;
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: Date | null;
    badges: IUserProgressBadge[];
    ideasPosted: number;
    collaborationsJoined: number;
    collabRequestsSent: number;
    ideasLiked: number;
    commentsPosted: number;
    validationVotesGiven: number;
    ideasTrendingCount: number;
    savedIdeasCount: number;
    challengesCompleted: number;
    /** ISO week bucket (UTC Monday date string YYYY-MM-DD) for weekly XP */
    weekBucket: string;
    weeklyXpEarned: number;
    weeklyChallenge: IUserWeeklyChallenge;
    createdAt: Date;
    updatedAt: Date;
}
export type IUserProgressDocument = Document<Types.ObjectId, object, IUserProgress> & IUserProgress;
export type IUserProgressModel = Model<IUserProgress>;
export declare const UserProgress: IUserProgressModel;
//# sourceMappingURL=UserProgress.model.d.ts.map