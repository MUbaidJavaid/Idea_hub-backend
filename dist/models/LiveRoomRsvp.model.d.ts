import { type Document, type Model, type Types } from 'mongoose';
export interface ILiveRoomRsvp {
    _id: Types.ObjectId;
    roomId: Types.ObjectId;
    userId: Types.ObjectId;
    createdAt: Date;
}
export type ILiveRoomRsvpDocument = Document<Types.ObjectId, object, ILiveRoomRsvp> & ILiveRoomRsvp;
export type ILiveRoomRsvpModel = Model<ILiveRoomRsvp>;
export declare const LiveRoomRsvp: ILiveRoomRsvpModel;
//# sourceMappingURL=LiveRoomRsvp.model.d.ts.map