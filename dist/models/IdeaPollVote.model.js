import mongoose, { Schema, } from 'mongoose';
export const IDEA_POLL_OPTION_KEYS = [
    'yes_definitely',
    'maybe',
    'not_for_me',
    'already_exists',
];
export function isPollOptionKey(s) {
    return IDEA_POLL_OPTION_KEYS.includes(s);
}
const ideaPollVoteSchema = new Schema({
    ideaId: {
        type: Schema.Types.ObjectId,
        ref: 'Idea',
        required: true,
        index: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    optionKey: {
        type: String,
        enum: IDEA_POLL_OPTION_KEYS,
        required: true,
    },
}, { timestamps: { createdAt: true, updatedAt: false } });
ideaPollVoteSchema.index({ ideaId: 1, userId: 1 }, { unique: true });
export const IdeaPollVote = mongoose.models.IdeaPollVote ??
    mongoose.model('IdeaPollVote', ideaPollVoteSchema);
//# sourceMappingURL=IdeaPollVote.model.js.map