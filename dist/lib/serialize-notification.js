import { userToApi } from './serialize-user.js';
export function notificationToApi(n, sender) {
    const out = {
        _id: String(n._id),
        recipientId: String(n.recipientId),
        type: n.type,
        referenceId: String(n.referenceId),
        referenceType: n.referenceType,
        title: n.title,
        body: n.body,
        isRead: n.isRead,
        createdAt: n.createdAt instanceof Date
            ? n.createdAt.toISOString()
            : String(n.createdAt),
    };
    if (sender) {
        out.senderId = userToApi(sender);
    }
    return out;
}
//# sourceMappingURL=serialize-notification.js.map