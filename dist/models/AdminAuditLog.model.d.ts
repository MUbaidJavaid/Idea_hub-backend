import { type Document, type Model, type Types } from 'mongoose';
export type AdminAuditTargetType = 'user' | 'idea' | 'comment' | 'collab_request';
export interface IAdminAuditLog {
    _id: Types.ObjectId;
    adminId: Types.ObjectId;
    action: string;
    targetType: AdminAuditTargetType;
    targetId: Types.ObjectId;
    beforeState: Record<string, unknown>;
    afterState: Record<string, unknown>;
    reason: string;
    ipAddress: string;
    createdAt: Date;
}
export type IAdminAuditLogDocument = Document<Types.ObjectId, object, IAdminAuditLog> & IAdminAuditLog;
export type IAdminAuditLogModel = Model<IAdminAuditLog>;
export declare const AdminAuditLog: IAdminAuditLogModel;
//# sourceMappingURL=AdminAuditLog.model.d.ts.map