import { type Document, type Model, type Types } from 'mongoose';
export type LiveRoomQuestionStatus = 'queued' | 'answered' | 'dismissed';
export interface ILiveRoomQuestion {
    _id: Types.ObjectId;
    roomId: Types.ObjectId;
    userId: Types.ObjectId;
    body: string;
    status: LiveRoomQuestionStatus;
    answeredAt?: Date;
    createdAt: Date;
}
export type ILiveRoomQuestionDocument = Document<Types.ObjectId, object, ILiveRoomQuestion> & ILiveRoomQuestion;
export type ILiveRoomQuestionModel = Model<ILiveRoomQuestion>;
export declare const LiveRoomQuestion: ILiveRoomQuestionModel;
//# sourceMappingURL=LiveRoomQuestion.model.d.ts.map