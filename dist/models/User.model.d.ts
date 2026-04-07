import { type Document, type Model, type Types } from 'mongoose';
export type UserRole = 'user' | 'collaborator' | 'moderator' | 'super_admin';
export type UserStatus = 'active' | 'inactive' | 'banned' | 'pending_verification';
export type EmailDigestFrequency = 'none' | 'daily' | 'weekly';
export type SubscriptionPlan = 'free' | 'pro' | 'investor';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';
export interface IUserSubscription {
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    currentPeriodEnd: Date | null;
}
export interface IUserInterestProfile {
    categoryWeights: Record<string, number>;
    tagWeights: Record<string, number>;
    lastUpdated: Date;
}
export interface IUserNotificationPreferences {
    likes: boolean;
    comments: boolean;
    collabRequests: boolean;
    newFollower: boolean;
    trendingIdeas: boolean;
    /** Notify when someone you follow publishes a new version of an idea */
    ideaVersionUpdates: boolean;
    emailDigest: EmailDigestFrequency;
    pushEnabled: boolean;
}
/** Plain object shape for `.lean<IUser>()` and API typing */
export interface IUser {
    _id: Types.ObjectId;
    username: string;
    email: string;
    passwordHash: string;
    fullName: string;
    bio: string;
    avatarUrl: string;
    role: UserRole;
    status: UserStatus;
    isEmailVerified: boolean;
    skills: string[];
    interestProfile: IUserInterestProfile;
    notificationPreferences: IUserNotificationPreferences;
    /** Manual admin verification (notable innovators) */
    verifiedInnovator: boolean;
    verificationRequestAt: Date | null;
    verificationRequestMessage: string;
    subscription: IUserSubscription;
    fcmToken: string;
    followerCount: number;
    followingCount: number;
    totalIdeasPosted: number;
    lastSeenAt: Date;
    emailVerificationToken: string;
    passwordResetToken: string;
    passwordResetExpires: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface IUserMethods {
    comparePassword(candidate: string): Promise<boolean>;
}
export type IUserDocument = Document<Types.ObjectId, object, IUser> & IUser & IUserMethods;
export interface IUserModel extends Model<IUser, object, IUserMethods> {
    findByEmail(email: string): Promise<IUserDocument | null>;
}
export declare const User: IUserModel;
//# sourceMappingURL=User.model.d.ts.map