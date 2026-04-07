import { type Document, type Model, type Types } from 'mongoose';
export interface IIdeaCollectionItem {
    _id: Types.ObjectId;
    collectionId: Types.ObjectId;
    ideaId: Types.ObjectId;
    sortOrder: number;
    createdAt: Date;
}
export type IIdeaCollectionItemDocument = Document<Types.ObjectId, object, IIdeaCollectionItem> & IIdeaCollectionItem;
export type IIdeaCollectionItemModel = Model<IIdeaCollectionItem>;
export declare const IdeaCollectionItem: IIdeaCollectionItemModel;
//# sourceMappingURL=IdeaCollectionItem.model.d.ts.map