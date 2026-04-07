import mongoose, { Schema, } from 'mongoose';
const liveRoomMessageSchema = new Schema({
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
}, { timestamps: { createdAt: true, updatedAt: false } });
liveRoomMessageSchema.index({ roomId: 1, createdAt: -1 });
export const LiveRoomMessage = mongoose.models.LiveRoomMessage ??
    mongoose.model('LiveRoomMessage', liveRoomMessageSchema);
//# sourceMappingURL=LiveRoomMessage.model.js.map