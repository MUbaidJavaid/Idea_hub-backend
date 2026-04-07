import { type Document, type Model, type Types } from 'mongoose';
export interface IIdeaCollection {
    _id: Types.ObjectId;
    ownerId: Types.ObjectId;
    name: string;
    description: string;
    slug: string;
    isPublic: boolean;
    followerCount: number;
    ideaCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export type IIdeaCollectionDocument = Document<Types.ObjectId, object, IIdeaCollection> & IIdeaCollection;
export type IIdeaCollectionModel = Model<IIdeaCollection>;
export declare const IdeaCollection: IIdeaCollectionModel;
//# sourceMappingURL=IdeaCollection.model.d.ts.map