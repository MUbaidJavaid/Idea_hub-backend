import mongoose, { Schema, } from 'mongoose';
const liveRoomRsvpSchema = new Schema({
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
}, { timestamps: { createdAt: true, updatedAt: false } });
liveRoomRsvpSchema.index({ roomId: 1, userId: 1 }, { unique: true });
export const LiveRoomRsvp = mongoose.models.LiveRoomRsvp ??
    mongoose.model('LiveRoomRsvp', liveRoomRsvpSchema);
//# sourceMappingURL=LiveRoomRsvp.model.js.map