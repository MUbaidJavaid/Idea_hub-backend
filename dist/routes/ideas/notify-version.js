import { Follow, Notification, User } from '../../models/index.js';
export async function notifyFollowersOfIdeaVersion(input) {
    const follows = await Follow.find({ followingId: input.authorId })
        .select('followerId')
        .lean();
    if (follows.length === 0)
        return;
    const followerIds = follows.map((f) => f.followerId);
    const users = await User.find({ _id: { $in: followerIds } }).select('notificationPreferences');
    const body = `${input.authorDisplay} updated "${input.ideaTitle.slice(0, 80)}" (v${input.version})`.slice(0, 480);
    const rows = users
        .filter((u) => u.notificationPreferences?.ideaVersionUpdates !== false)
        .map((u) => ({
        recipientId: u._id,
        senderId: input.authorId,
        type: 'idea_version_updated',
        referenceId: input.ideaId,
        referenceType: 'idea',
        title: 'Idea updated',
        body,
        isRead: false,
        isPushSent: false,
        metadata: { version: input.version },
    }));
    if (rows.length > 0) {
        await Notification.insertMany(rows);
    }
}
//# sourceMappingURL=notify-version.js.map