import { type Document, type Model, type Types } from 'mongoose';
export type BehaviorEventType = 'view' | 'like' | 'share' | 'comment' | 'save' | 'collab_request' | 'search' | 'click' | 'scroll_depth';
export type BehaviorEventSource = 'feed' | 'search' | 'profile' | 'notification' | 'trending';
export type BehaviorDeviceType = 'mobile' | 'tablet' | 'desktop';
export interface IBehaviorEvent {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    eventType: BehaviorEventType;
    ideaId: Types.ObjectId | null;
    sessionId: string;
    durationMs: number;
    scrollPercent: number;
    source: BehaviorEventSource;
    deviceType: BehaviorDeviceType;
    createdAt: Date;
}
export type IBehaviorEventDocument = Document<Types.ObjectId, object, IBehaviorEvent> & IBehaviorEvent;
export type IBehaviorEventModel = Model<IBehaviorEvent>;
export declare const BehaviorEvent: IBehaviorEventModel;
//# sourceMappingURL=BehaviorEvent.model.d.ts.map