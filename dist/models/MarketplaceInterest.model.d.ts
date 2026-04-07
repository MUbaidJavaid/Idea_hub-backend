import { type Document, type Model, type Types } from 'mongoose';
export interface IMarketplaceInterest {
    _id: Types.ObjectId;
    listingId: Types.ObjectId;
    userId: Types.ObjectId;
    createdAt: Date;
}
export type IMarketplaceInterestDocument = Document<Types.ObjectId, object, IMarketplaceInterest> & IMarketplaceInterest;
export type IMarketplaceInterestModel = Model<IMarketplaceInterest>;
export declare const MarketplaceInterest: IMarketplaceInterestModel;
//# sourceMappingURL=MarketplaceInterest.model.d.ts.map