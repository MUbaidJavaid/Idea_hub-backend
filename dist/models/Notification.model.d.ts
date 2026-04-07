import { type Document, type Model, type Types } from 'mongoose';
export type NotificationType = 'like' | 'comment' | 'collab_request' | 'collab_accepted' | 'new_idea_from_followed' | 'idea_trending' | 'mention' | 'idea_updated' | 'idea_version_updated' | 'system_message' | 'admin_action' | 'marketplace_bid' | 'marketplace_interest' | 'marketplace_bid_accepted' | 'marketplace_bid_rejected' | 'live_room_started' | 'live_room_reminder' | 'ai_coach_daily_brief';
export type NotificationReferenceType = 'idea' | 'comment' | 'user' | 'collab_request' | 'marketplace_listing' | 'live_room';
export interface INotification {
    _id: Types.ObjectId;
    recipientId: Types.ObjectId;
    senderId: Types.ObjectId | null;
    type: NotificationType;
    referenceId: Types.ObjectId;
    referenceType: NotificationReferenceType;
    title: string;
    body: string;
    isRead: boolean;
    isPushSent: boolean;
    metadata: Record<string, unknown>;
    createdAt: Date;
}
export type INotificationDocument = Document<Types.ObjectId, object, INotification> & INotification;
export type INotificationModel = Model<INotification>;
export declare const Notification: INotificationModel;
//# sourceMappingURL=Notification.model.d.ts.map