import mongoose, { Schema, } from 'mongoose';
import { Idea } from './Idea.model.js';
import { modelEvents } from './modelEvents.js';
const commentSchema = new Schema({
    ideaId: {
        type: Schema.Types.ObjectId,
        ref: 'Idea',
        required: true,
        index: true,
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    parentCommentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
        index: true,
    },
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        trim: true,
        maxlength: [2000, 'Comment cannot exceed 2000 characters'],
    },
    likeCount: { type: Number, default: 0, min: 0 },
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },
    status: {
        type: String,
        enum: ['visible', 'hidden', 'flagged'],
        default: 'visible',
    },
}, { timestamps: true });
commentSchema.index({ ideaId: 1, parentCommentId: 1, createdAt: 1 });
commentSchema.index({ authorId: 1, createdAt: -1 });
commentSchema.index({ status: 1 });
commentSchema.pre('save', function commentInsertFlag(next) {
    this.$locals.justInserted = this.isNew;
    next();
});
commentSchema.post('save', async function commentPostSave(doc) {
    if (!doc.$locals.justInserted)
        return;
    await Idea.findByIdAndUpdate(doc.ideaId, { $inc: { commentCount: 1 } });
    const payload = {
        ideaId: doc.ideaId.toString(),
        authorId: doc.authorId.toString(),
    };
    setImmediate(() => {
        modelEvents.emit('comment:created', payload);
    });
});
commentSchema.pre('save', async function validateThreadDepth(next) {
    if (!this.parentCommentId)
        return next();
    const CommentModel = this.model('Comment');
    const parent = await CommentModel.findById(this.parentCommentId)
        .select('parentCommentId')
        .lean();
    if (!parent) {
        return next(new Error('Parent comment not found'));
    }
    if (parent.parentCommentId) {
        return next(new Error('Threading limited to 2 levels: cannot reply to a reply'));
    }
    next();
});
export const Comment = mongoose.models.Comment ??
    mongoose.model('Comment', commentSchema);
//# sourceMappingURL=Comment.model.js.map