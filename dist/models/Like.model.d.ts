import { type Document, type Model, type Types } from 'mongoose';
export interface ILike {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    ideaId: Types.ObjectId;
    createdAt: Date;
}
export type ILikeDocument = Document<Types.ObjectId, object, ILike> & ILike;
export type ILikeModel = Model<ILike>;
export declare const Like: ILikeModel;
//# sourceMappingURL=Like.model.d.ts.map