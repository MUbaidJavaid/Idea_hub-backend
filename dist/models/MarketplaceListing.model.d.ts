import { type Document, type Model, type Types } from 'mongoose';
export type MarketplaceListingType = 'full_rights' | 'license' | 'co_founder' | 'investor_pitch';
export type MarketplaceListingStatus = 'draft' | 'active' | 'under_negotiation' | 'sold' | 'withdrawn';
export type MarketplaceBidStatus = 'pending' | 'accepted' | 'rejected';
export interface IMarketplaceBid {
    _id: Types.ObjectId;
    bidderId: Types.ObjectId;
    amount: number;
    message: string;
    status: MarketplaceBidStatus;
    createdAt: Date;
}
export interface IMarketplaceListing {
    _id: Types.ObjectId;
    ideaId: Types.ObjectId;
    sellerId: Types.ObjectId;
    listingType: MarketplaceListingType;
    askingPrice: number;
    equity: number;
    status: MarketplaceListingStatus;
    description: string;
    proofPoints: string[];
    targetBuyer: string;
    views: number;
    interestedCount: number;
    bids: IMarketplaceBid[];
    soldTo?: Types.ObjectId;
    soldPrice?: number;
    soldAt?: Date;
    platformFeeUsd?: number;
    netToSellerUsd?: number;
    expiresAt: Date;
    /** Premium placement — set when subscription / admin marks featured */
    featuredUntil?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export type IMarketplaceListingDocument = Document<Types.ObjectId, object, IMarketplaceListing> & IMarketplaceListing;
export type IMarketplaceListingModel = Model<IMarketplaceListing>;
export declare const MarketplaceListing: IMarketplaceListingModel;
//# sourceMappingURL=MarketplaceListing.model.d.ts.map