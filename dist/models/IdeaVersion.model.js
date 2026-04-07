import mongoose, { Schema, } from 'mongoose';
const ideaVersionSchema = new Schema({
    ideaId: {
        type: Schema.Types.ObjectId,
        ref: 'Idea',
        required: true,
        index: true,
    },
    versionNumber: { type: Number, required: true, min: 1 },
    title: { type: String, required: true, maxlength: 500 },
    description: { type: String, required: true, maxlength: 50_000 },
    category: { type: String, required: true, default: 'other' },
    tags: { type: [String], default: [] },
    editedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: { createdAt: true, updatedAt: false } });
ideaVersionSchema.index({ ideaId: 1, versionNumber: 1 }, { unique: true });
export const IdeaVersion = mongoose.models.IdeaVersion ??
    mongoose.model('IdeaVersion', ideaVersionSchema);
//# sourceMappingURL=IdeaVersion.model.js.map