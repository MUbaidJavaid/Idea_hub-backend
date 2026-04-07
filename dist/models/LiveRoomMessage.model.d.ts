import { type Document, type Model, type Types } from 'mongoose';
export interface ILiveRoomMessage {
    _id: Types.ObjectId;
    roomId: Types.ObjectId;
    userId: Types.ObjectId;
    body: string;
    createdAt: Date;
}
export type ILiveRoomMessageDocument = Document<Types.ObjectId, object, ILiveRoomMessage> & ILiveRoomMessage;
export type ILiveRoomMessageModel = Model<ILiveRoomMessage>;
export declare const LiveRoomMessage: ILiveRoomMessageModel;
//# sourceMappingURL=LiveRoomMessage.model.d.ts.map