import mongoose, { Schema, } from 'mongoose';
import { modelEvents, } from './modelEvents.js';
const collabRequestSchema = new Schema({
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
    message: {
        type: String,
        required: [true, 'Collaboration message is required'],
        trim: true,
        maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    skillsOffered: {
        type: [String],
        default: [],
        validate: {
            validator: (v) => v.length <= 30,
            message: 'Too many skills offered',
        },
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
        default: 'pending',
    },
    responseMessage: {
        type: String,
        default: '',
        trim: true,
        maxlength: [2000, 'Response message is too long'],
    },
    respondedAt: { type: Date },
}, { timestamps: true });
collabRequestSchema.index({ ideaId: 1, status: 1 });
collabRequestSchema.index({ requesterId: 1, status: 1 });
collabRequestSchema.index({ ideaId: 1, requesterId: 1 }, { unique: true });
collabRequestSchema.pre('save', function collabPreSave(next) {
    const d = this;
    d.$locals.justInsertedCollab = this.isNew;
    d.$locals.collabJustAccepted = false;
    if (!d.isNew && d.isModified('status') && d.status === 'accepted') {
        const prev = d.previous?.('status');
        if (prev !== 'accepted') {
            d.$locals.collabJustAccepted = true;
        }
    }
    next();
});
collabRequestSchema.post('save', function collabPostSave(doc) {
    if (doc.$locals.justInsertedCollab) {
        const payload = {
            ideaId: doc.ideaId.toString(),
            requestId: doc._id.toString(),
            requesterId: doc.requesterId.toString(),
        };
        setImmediate(() => {
            modelEvents.emit('collab:request-created', payload);
        });
    }
    if (doc.$locals.collabJustAccepted) {
        const payload = {
            ideaId: doc.ideaId.toString(),
            requesterId: doc.requesterId.toString(),
        };
        setImmediate(() => {
            modelEvents.emit('collab:accepted', payload);
        });
    }
});
export const CollabRequest = mongoose.models.CollabRequest ??
    mongoose.model('CollabRequest', collabRequestSchema);
//# sourceMappingURL=CollabRequest.model.js.map