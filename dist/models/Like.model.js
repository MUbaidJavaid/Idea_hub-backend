import mongoose, { Schema, } from 'mongoose';
import { Idea } from './Idea.model.js';
import { modelEvents, } from './modelEvents.js';
const likeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    ideaId: {
        type: Schema.Types.ObjectId,
        ref: 'Idea',
        required: true,
        index: true,
    },
}, {
    timestamps: { createdAt: true, updatedAt: false },
});
likeSchema.index({ userId: 1, ideaId: 1 }, { unique: true });
likeSchema.index({ ideaId: 1, createdAt: -1 });
likeSchema.index({ userId: 1, createdAt: -1 });
likeSchema.pre('save', function markInsertFlag(next) {
    this.$locals.justInserted = this.isNew;
    next();
});
likeSchema.post('save', async function likePostSave(doc) {
    if (!doc.$locals.justInserted)
        return;
    await Idea.findByIdAndUpdate(doc.ideaId, { $inc: { likeCount: 1 } });
    const payload = {
        likeId: doc._id.toString(),
        userId: doc.userId.toString(),
        ideaId: doc.ideaId.toString(),
    };
    setImmediate(() => {
        modelEvents.emit('like:created', payload);
    });
});
async function decrementIdeaLikeCount(ideaId) {
    await Idea.findByIdAndUpdate(ideaId, { $inc: { likeCount: -1 } });
}
likeSchema.post('deleteOne', { document: true, query: false }, async function likeDocDeleteOne() {
    await decrementIdeaLikeCount(this.ideaId);
});
likeSchema.post('findOneAndDelete', async function likeFindOneAndDelete(doc) {
    if (doc?.ideaId) {
        await decrementIdeaLikeCount(doc.ideaId);
        const payload = { ideaId: doc.ideaId.toString() };
        setImmediate(() => {
            modelEvents.emit('like:removed', payload);
        });
    }
});
export const Like = mongoose.models.Like ??
    mongoose.model('Like', likeSchema);
//# sourceMappingURL=Like.model.js.map