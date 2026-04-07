import mongoose, { Schema, } from 'mongoose';
const bidSchema = new Schema({
    bidderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    message: { type: String, default: '', trim: true, maxlength: 2000 },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    createdAt: { type: Date, default: Date.now },
}, { _id: true });
const marketplaceListingSchema = new Schema({
    ideaId: {
        type: Schema.Types.ObjectId,
        ref: 'Idea',
        required: true,
        index: true,
    },
    sellerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    listingType: {
        type: String,
        enum: ['full_rights', 'license', 'co_founder', 'investor_pitch'],
        required: true,
    },
    askingPrice: { type: Number, required: true, min: 0, default: 0 },
    equity: { type: Number, min: 0, max: 100, default: 0 },
    status: {
        type: String,
        enum: ['draft', 'active', 'under_negotiation', 'sold', 'withdrawn'],
        default: 'draft',
        index: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 8000,
    },
    proofPoints: {
        type: [String],
        default: [],
        validate: {
            validator: (v) => v.length <= 40,
            message: 'Too many proof points',
        },
    },
    targetBuyer: {
        type: String,
        default: '',
        trim: true,
        maxlength: 500,
    },
    views: { type: Number, default: 0, min: 0 },
    interestedCount: { type: Number, default: 0, min: 0 },
    bids: { type: [bidSchema], default: [] },
    soldTo: { type: Schema.Types.ObjectId, ref: 'User' },
    soldPrice: { type: Number, min: 0 },
    soldAt: { type: Date },
    platformFeeUsd: { type: Number, min: 0 },
    netToSellerUsd: { type: Number, min: 0 },
    expiresAt: { type: Date, required: true, index: true },
    featuredUntil: { type: Date, index: true },
}, { timestamps: true });
marketplaceListingSchema.index({ sellerId: 1, status: 1, createdAt: -1 });
marketplaceListingSchema.index({ status: 1, expiresAt: 1, listingType: 1 });
export const MarketplaceListing = mongoose.models.MarketplaceListing ??
    mongoose.model('MarketplaceListing', marketplaceListingSchema);
//# sourceMappingURL=MarketplaceListing.model.js.map