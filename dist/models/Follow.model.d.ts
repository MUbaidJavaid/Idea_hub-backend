import { type Document, type Model, type Types } from 'mongoose';
export interface IFollow {
    _id: Types.ObjectId;
    followerId: Types.ObjectId;
    followingId: Types.ObjectId;
    createdAt: Date;
}
export type IFollowDocument = Document<Types.ObjectId, object, IFollow> & IFollow;
export type IFollowModel = Model<IFollow>;
export declare const Follow: IFollowModel;
//# sourceMappingURL=Follow.model.d.ts.map