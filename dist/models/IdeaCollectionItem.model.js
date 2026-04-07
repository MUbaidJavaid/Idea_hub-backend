import mongoose, { Schema, } from 'mongoose';
const ideaCollectionItemSchema = new Schema({
    collectionId: {
        type: Schema.Types.ObjectId,
        ref: 'IdeaCollection',
        required: true,
        index: true,
    },
    ideaId: {
        type: Schema.Types.ObjectId,
        ref: 'Idea',
        required: true,
        index: true,
    },
    sortOrder: { type: Number, default: 0 },
}, { timestamps: { createdAt: true, updatedAt: false } });
ideaCollectionItemSchema.index({ collectionId: 1, ideaId: 1 }, { unique: true });
ideaCollectionItemSchema.index({ collectionId: 1, sortOrder: 1 });
export const IdeaCollectionItem = mongoose.models.IdeaCollectionItem ??
    mongoose.model('IdeaCollectionItem', ideaCollectionItemSchema);
//# sourceMappingURL=IdeaCollectionItem.model.js.map