import mongoose, { Schema, } from 'mongoose';
const coachMessageSchema = new Schema({
    role: { type: String, enum: ['user', 'coach'], required: true },
    content: { type: String, required: true, maxlength: 16_000 },
    timestamp: { type: Date, default: Date.now },
}, { _id: false });
const coachSessionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    ideaId: {
        type: Schema.Types.ObjectId,
        ref: 'Idea',
        default: null,
        index: true,
    },
    messages: { type: [coachMessageSchema], default: [] },
    sessionType: {
        type: String,
        enum: ['idea_feedback', 'daily_brief', 'market_research', 'pivot_advice'],
        default: 'market_research',
        index: true,
    },
}, { timestamps: true });
coachSessionSchema.index({ userId: 1, updatedAt: -1 });
export const CoachSession = mongoose.models.CoachSession ??
    mongoose.model('CoachSession', coachSessionSchema);
//# sourceMappingURL=CoachSession.model.js.map