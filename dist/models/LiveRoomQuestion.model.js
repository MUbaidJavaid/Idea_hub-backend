import mongoose, { Schema, } from 'mongoose';
const liveRoomQuestionSchema = new Schema({
    roomId: {
        type: Schema.Types.ObjectId,
        ref: 'LiveRoom',
        required: true,
        index: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    status: {
        type: String,
        enum: ['queued', 'answered', 'dismissed'],
        default: 'queued',
        index: true,
    },
    answeredAt: { type: Date },
}, { timestamps: { createdAt: true, updatedAt: false } });
liveRoomQuestionSchema.index({ roomId: 1, status: 1, createdAt: 1 });
export const LiveRoomQuestion = mongoose.models.LiveRoomQuestion ??
    mongoose.model('LiveRoomQuestion', liveRoomQuestionSchema);
//# sourceMappingURL=LiveRoomQuestion.model.js.map