import mongoose, { Schema, } from 'mongoose';
const badgeSchema = new Schema({
    badgeId: { type: String, required: true },
    earnedAt: { type: Date, required: true, default: () => new Date() },
    rarity: {
        type: String,
        enum: ['common', 'rare', 'epic', 'legendary'],
        required: true,
    },
}, { _id: false });
const weeklyChallengeSchema = new Schema({
    challengeId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    metric: {
        type: String,
        enum: [
            'ideas_posted',
            'comments_posted',
            'likes_given',
            'collabs_accepted',
            'validation_votes',
            'likes_received_on_ideas',
        ],
        required: true,
    },
    target: { type: Number, required: true, min: 1 },
    progress: { type: Number, default: 0, min: 0 },
    completed: { type: Boolean, default: false },
    weekOf: { type: Date, required: true },
    category: { type: String, trim: true },
}, { _id: false });
const userProgressSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true,
    },
    totalXP: { type: Number, default: 0, min: 0 },
    level: { type: Number, default: 1, min: 1, max: 50 },
    levelTitle: { type: String, default: 'Idea Spark' },
    currentStreak: { type: Number, default: 0, min: 0 },
    longestStreak: { type: Number, default: 0, min: 0 },
    lastActiveDate: { type: Date, default: null },
    badges: { type: [badgeSchema], default: [] },
    ideasPosted: { type: Number, default: 0, min: 0 },
    collaborationsJoined: { type: Number, default: 0, min: 0 },
    collabRequestsSent: { type: Number, default: 0, min: 0 },
    ideasLiked: { type: Number, default: 0, min: 0 },
    commentsPosted: { type: Number, default: 0, min: 0 },
    validationVotesGiven: { type: Number, default: 0, min: 0 },
    ideasTrendingCount: { type: Number, default: 0, min: 0 },
    savedIdeasCount: { type: Number, default: 0, min: 0 },
    challengesCompleted: { type: Number, default: 0, min: 0 },
    weekBucket: { type: String, default: '', index: true },
    weeklyXpEarned: { type: Number, default: 0, min: 0 },
    weeklyChallenge: { type: weeklyChallengeSchema, required: false },
}, { timestamps: true });
userProgressSchema.index({ weekBucket: 1, weeklyXpEarned: -1 });
export const UserProgress = mongoose.models.UserProgress ??
    mongoose.model('UserProgress', userProgressSchema);
//# sourceMappingURL=UserProgress.model.js.map