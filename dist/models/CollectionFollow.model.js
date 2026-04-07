import mongoose, { Schema, } from 'mongoose';
const collectionFollowSchema = new Schema({
    followerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    collectionId: {
        type: Schema.Types.ObjectId,
        ref: 'IdeaCollection',
        required: true,
        index: true,
    },
}, { timestamps: { createdAt: true, updatedAt: false } });
collectionFollowSchema.index({ followerId: 1, collectionId: 1 }, { unique: true });
export const CollectionFollow = mongoose.models.CollectionFollow ??
    mongoose.model('CollectionFollow', collectionFollowSchema);
//# sourceMappingURL=CollectionFollow.model.js.map