import { type Document, type Model, type Types } from 'mongoose';
export type UpdateRequestStatus = 'pending' | 'accepted' | 'rejected';
export interface IUpdateRequest {
    _id: Types.ObjectId;
    ideaId: Types.ObjectId;
    requesterId: Types.ObjectId;
    suggestedTitle: string;
    suggestedDescription: string;
    reason: string;
    mediaAdditions: string[];
    status: UpdateRequestStatus;
    adminNotes: string;
    createdAt: Date;
    updatedAt: Date;
}
export type IUpdateRequestDocument = Document<Types.ObjectId, object, IUpdateRequest> & IUpdateRequest;
export type IUpdateRequestModel = Model<IUpdateRequest>;
export declare const UpdateRequest: IUpdateRequestModel;
//# sourceMappingURL=UpdateRequest.model.d.ts.map