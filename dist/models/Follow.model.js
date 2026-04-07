import mongoose, { Schema, } from 'mongoose';
import { User } from './User.model.js';
import { modelEvents } from './modelEvents.js';
const followSchema = new Schema({
    followerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    followingId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
}, {
    timestamps: { createdAt: true, updatedAt: false },
});
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });
followSchema.index({ followingId: 1, createdAt: -1 });
followSchema.index({ followerId: 1, createdAt: -1 });
followSchema.pre('save', function followInsertFlag(next) {
    if (this.followerId.equals(this.followingId)) {
        return next(new Error('Users cannot follow themselves'));
    }
    this.$locals.justInserted = this.isNew;
    next();
});
followSchema.post('save', async function followPostSave(doc) {
    if (!doc.$locals.justInserted)
        return;
    await User.findByIdAndUpdate(doc.followerId, { $inc: { followingCount: 1 } });
    await User.findByIdAndUpdate(doc.followingId, { $inc: { followerCount: 1 } });
    const payload = {
        followingId: doc.followingId.toString(),
    };
    setImmediate(() => {
        modelEvents.emit('follow:created', payload);
    });
});
async function decrementFollowCounts(followerId, followingId) {
    await User.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });
    await User.findByIdAndUpdate(followingId, { $inc: { followerCount: -1 } });
}
followSchema.post('deleteOne', { document: true, query: false }, async function followDocDeleteOne() {
    await decrementFollowCounts(this.followerId, this.followingId);
});
followSchema.post('findOneAndDelete', async function followFindOneAndDelete(doc) {
    if (doc?.followerId && doc?.followingId) {
        await decrementFollowCounts(doc.followerId, doc.followingId);
    }
});
export const Follow = mongoose.models.Follow ??
    mongoose.model('Follow', followSchema);
//# sourceMappingURL=Follow.model.js.map