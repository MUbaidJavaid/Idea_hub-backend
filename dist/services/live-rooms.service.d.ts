import mongoose from 'mongoose';
import { type ILiveRoomDocument } from '../models/index.js';
export declare function attachLiveRecordingToIdea(params: {
    ideaId: mongoose.Types.ObjectId;
    hostId: mongoose.Types.ObjectId;
    recordingUrl: string;
    roomTitle: string;
}): Promise<void>;
export declare function notifyLiveRoomStarted(room: ILiveRoomDocument): Promise<void>;
export declare function notifyLiveRoomRsvpReminder(room: ILiveRoomDocument): Promise<void>;
export declare function roomsNeedingRsvpReminder(): Promise<ILiveRoomDocument[]>;
//# sourceMappingURL=live-rooms.service.d.ts.map