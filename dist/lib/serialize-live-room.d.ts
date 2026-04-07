import type { ILiveRoomDocument } from '../models/LiveRoom.model.js';
import type { IUserDocument } from '../models/User.model.js';
export declare function liveRoomToApi(room: ILiveRoomDocument, userById: Map<string, IUserDocument>): Record<string, unknown>;
export declare function mapLiveRoomsToApi(rooms: ILiveRoomDocument[]): Promise<Record<string, unknown>[]>;
//# sourceMappingURL=serialize-live-room.d.ts.map