import { type Document, type Model, type Types } from 'mongoose';
export type CollabRequestStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';
export interface ICollabRequest {
    _id: Types.ObjectId;
    ideaId: Types.ObjectId;
    requesterId: Types.ObjectId;
    message: string;
    skillsOffered: string[];
    status: CollabRequestStatus;
    responseMessage: string;
    respondedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export type ICollabRequestDocument = Document<Types.ObjectId, object, ICollabRequest> & ICollabRequest;
export type ICollabRequestModel = Model<ICollabRequest>;
export declare const CollabRequest: ICollabRequestModel;
//# sourceMappingURL=CollabRequest.model.d.ts.map