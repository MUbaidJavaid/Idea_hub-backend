import mongoose from 'mongoose';
import type { IMarketplaceListingDocument, MarketplaceListingStatus } from '../models/MarketplaceListing.model.js';
export declare function defaultListingExpiresAt(): Date;
export declare function assertNoConflictingActiveListing(ideaId: mongoose.Types.ObjectId, excludeListingId?: mongoose.Types.ObjectId): Promise<boolean>;
export declare function notifyMarketplaceBid(params: {
    sellerId: mongoose.Types.ObjectId;
    bidderName: string;
    listingId: mongoose.Types.ObjectId;
    amount: number;
    ideaTitle: string;
}): Promise<void>;
export declare function notifyMarketplaceInterest(params: {
    sellerId: mongoose.Types.ObjectId;
    userName: string;
    listingId: mongoose.Types.ObjectId;
    ideaTitle: string;
}): Promise<void>;
export declare function notifyBidderOutcome(params: {
    bidderId: mongoose.Types.ObjectId;
    accepted: boolean;
    listingId: mongoose.Types.ObjectId;
    ideaTitle: string;
}): Promise<void>;
export declare function loadListingForSeller(listingId: string, sellerId: string): Promise<IMarketplaceListingDocument | null>;
export declare function validStatusTransition(from: MarketplaceListingStatus, to: MarketplaceListingStatus): boolean;
//# sourceMappingURL=marketplace.service.d.ts.map