import { type Document, type Model, type Types } from 'mongoose';
export type LiveRoomStatus = 'scheduled' | 'live' | 'ended';
export type LiveRoomParticipantRole = 'host' | 'speaker' | 'listener' | 'pending_speaker';
export interface ILiveRoomParticipant {
    userId: Types.ObjectId;
    role: LiveRoomParticipantRole;
    joinedAt: Date;
    leftAt?: Date;
}
export interface ILiveRoomPollVote {
    userId: Types.ObjectId;
    optionIndex: number;
}
export interface ILiveRoomPoll {
    question: string;
    options: string[];
    votes: ILiveRoomPollVote[];
    isActive: boolean;
}
export interface ILiveRoomValidationVote {
    userId: Types.ObjectId;
    score: number;
}
export interface ILiveRoomReaction {
    userId: Types.ObjectId;
    emoji: string;
    createdAt: Date;
}
export interface ILiveRoom {
    _id: Types.ObjectId;
    ideaId: Types.ObjectId | null;
    hostId: Types.ObjectId;
    title: string;
    description: string;
    status: LiveRoomStatus;
    scheduledFor: Date;
    startedAt?: Date;
    endedAt?: Date;
    /** Daily room name or mock id */
    providerRoomName: string;
    provider: 'daily' | 'mock';
    maxParticipants: number;
    participants: ILiveRoomParticipant[];
    peakListeners: number;
    totalJoined: number;
    recordingUrl: string;
    isRecorded: boolean;
    livePoll?: ILiveRoomPoll;
    validationVotes: ILiveRoomValidationVote[];
    recentReactions: ILiveRoomReaction[];
    tags: string[];
    category: string;
    rsvpReminderSentAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export type ILiveRoomDocument = Document<Types.ObjectId, object, ILiveRoom> & ILiveRoom;
export type ILiveRoomModel = Model<ILiveRoom>;
export declare const LiveRoom: ILiveRoomModel;
//# sourceMappingURL=LiveRoom.model.d.ts.map