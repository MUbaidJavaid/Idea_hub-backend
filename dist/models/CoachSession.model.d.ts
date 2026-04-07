import { type Document, type Model, type Types } from 'mongoose';
export type CoachSessionType = 'idea_feedback' | 'daily_brief' | 'market_research' | 'pivot_advice';
export interface ICoachMessage {
    role: 'user' | 'coach';
    content: string;
    timestamp: Date;
}
export interface ICoachSession {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    ideaId: Types.ObjectId | null;
    messages: ICoachMessage[];
    sessionType: CoachSessionType;
    createdAt: Date;
    updatedAt: Date;
}
export type ICoachSessionDocument = Document<Types.ObjectId, object, ICoachSession> & ICoachSession;
export type ICoachSessionModel = Model<ICoachSession>;
export declare const CoachSession: ICoachSessionModel;
//# sourceMappingURL=CoachSession.model.d.ts.map