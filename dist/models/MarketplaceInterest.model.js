import mongoose, { Schema, } from 'mongoose';
const marketplaceInterestSchema = new Schema({
    listingId: {
        type: Schema.Types.ObjectId,
        ref: 'MarketplaceListing',
        required: true,
        index: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
}, { timestamps: { createdAt: true, updatedAt: false } });
marketplaceInterestSchema.index({ listingId: 1, userId: 1 }, { unique: true });
export const MarketplaceInterest = mongoose.models.MarketplaceInterest ??
    mongoose.model('MarketplaceInterest', marketplaceInterestSchema);
//# sourceMappingURL=MarketplaceInterest.model.js.map