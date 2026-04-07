import { type Document, type Model, type Types } from 'mongoose';
export interface ICollectionFollow {
    _id: Types.ObjectId;
    followerId: Types.ObjectId;
    collectionId: Types.ObjectId;
    createdAt: Date;
}
export type ICollectionFollowDocument = Document<Types.ObjectId, object, ICollectionFollow> & ICollectionFollow;
export type ICollectionFollowModel = Model<ICollectionFollow>;
export declare const CollectionFollow: ICollectionFollowModel;
//# sourceMappingURL=CollectionFollow.model.d.ts.map