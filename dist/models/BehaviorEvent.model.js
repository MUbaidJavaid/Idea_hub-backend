import mongoose, { Schema, } from 'mongoose';
const SIXTY_DAYS_SEC = 60 * 24 * 60 * 60;
const behaviorEventSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    eventType: {
        type: String,
        enum: [
            'view',
            'like',
            'share',
            'comment',
            'save',
            'collab_request',
            'search',
            'click',
            'scroll_depth',
        ],
        required: true,
    },
    ideaId: {
        type: Schema.Types.ObjectId,
        ref: 'Idea',
        default: null,
        index: true,
    },
    sessionId: {
        type: String,
        required: true,
        trim: true,
        maxlength: [128, 'Session id is too long'],
    },
    durationMs: { type: Number, default: 0, min: 0 },
    scrollPercent: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    source: {
        type: String,
        enum: ['feed', 'search', 'profile', 'notification', 'trending'],
        required: true,
    },
    deviceType: {
        type: String,
        enum: ['mobile', 'tablet', 'desktop'],
        required: true,
    },
}, {
    timestamps: { createdAt: true, updatedAt: false },
});
behaviorEventSchema.index({ userId: 1, eventType: 1, createdAt: -1 });
behaviorEventSchema.index({ ideaId: 1, eventType: 1, createdAt: -1 });
behaviorEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: SIXTY_DAYS_SEC });
export const BehaviorEvent = mongoose.models.BehaviorEvent ??
    mongoose.model('BehaviorEvent', behaviorEventSchema);
//# sourceMappingURL=BehaviorEvent.model.js.map