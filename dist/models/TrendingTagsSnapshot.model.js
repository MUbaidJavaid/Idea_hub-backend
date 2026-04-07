import mongoose, { Schema, } from 'mongoose';
const DOC_ID = new mongoose.Types.ObjectId('000000000000000000000001');
const trendingTagsSnapshotSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    tags: {
        type: [
            {
                tag: { type: String, required: true },
                score: { type: Number, required: true, min: 0 },
            },
        ],
        default: [],
    },
}, { timestamps: { createdAt: false, updatedAt: true } });
export const TrendingTagsSnapshot = mongoose.models.TrendingTagsSnapshot ??
    mongoose.model('TrendingTagsSnapshot', trendingTagsSnapshotSchema);
export const TRENDING_TAGS_DOC_ID = DOC_ID;
//# sourceMappingURL=TrendingTagsSnapshot.model.js.map