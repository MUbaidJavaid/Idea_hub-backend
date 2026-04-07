import mongoose, { Schema, } from 'mongoose';
const updateRequestSchema = new Schema({
    ideaId: {
        type: Schema.Types.ObjectId,
        ref: 'Idea',
        required: true,
        index: true,
    },
    requesterId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    suggestedTitle: {
        type: String,
        default: '',
        trim: true,
        maxlength: [200, 'Suggested title cannot exceed 200 characters'],
    },
    suggestedDescription: {
        type: String,
        default: '',
        maxlength: [10000, 'Suggested description is too long'],
    },
    reason: {
        type: String,
        required: [true, 'Reason is required'],
        trim: true,
        maxlength: [1000, 'Reason cannot exceed 1000 characters'],
    },
    mediaAdditions: {
        type: [String],
        default: [],
        validate: {
            validator: (urls) => urls.length <= 20 && urls.every((u) => u.length <= 2048),
            message: 'Invalid media additions',
        },
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    adminNotes: {
        type: String,
        default: '',
        trim: true,
        maxlength: [2000, 'Admin notes are too long'],
    },
}, { timestamps: true });
updateRequestSchema.index({ ideaId: 1, status: 1 });
updateRequestSchema.index({ requesterId: 1, createdAt: -1 });
export const UpdateRequest = mongoose.models.UpdateRequest ??
    mongoose.model('UpdateRequest', updateRequestSchema);
//# sourceMappingURL=UpdateRequest.model.js.map