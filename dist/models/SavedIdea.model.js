import mongoose, { Schema, } from 'mongoose';
const savedIdeaSchema = new Schema({
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
}, { timestamps: { createdAt: true, updatedAt: false } });
savedIdeaSchema.index({ userId: 1, ideaId: 1 }, { unique: true });
savedIdeaSchema.index({ userId: 1, _id: -1 });
export const SavedIdea = mongoose.models.SavedIdea ??
    mongoose.model('SavedIdea', savedIdeaSchema);
//# sourceMappingURL=SavedIdea.model.js.map