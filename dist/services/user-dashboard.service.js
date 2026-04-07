import mongoose from 'mongoose';
import { ideaToApi } from '../lib/serialize-idea.js';
import { userToApi, userToApiPublic } from '../lib/serialize-user.js';
import { BehaviorEvent, CollabRequest, Follow, Idea, Notification, User, } from '../models/index.js';
function startOfUtcDay(d) {
    const x = new Date(d);
    x.setUTCHours(0, 0, 0, 0);
    return x;
}
async function weeklyViewsForAuthor(authorId) {
    const ideaIds = await Idea.find({ authorId }).distinct('_id');
    const now = new Date();
    const dayStarts = [6, 5, 4, 3, 2, 1, 0].map((i) => {
        const d = new Date(now);
        d.setUTCDate(d.getUTCDate() - i);
        return startOfUtcDay(d);
    });
    const rangeStart = dayStarts[0];
    const rangeEnd = new Date(dayStarts[6]);
    rangeEnd.setUTCDate(rangeEnd.getUTCDate() + 1);
    if (ideaIds.length === 0) {
        return dayStarts.map((s) => ({
            date: s.toISOString().slice(0, 10),
            views: 0,
        }));
    }
    const agg = await BehaviorEvent.aggregate([
        {
            $match: {
                eventType: 'view',
                ideaId: { $in: ideaIds },
                createdAt: { $gte: rangeStart, $lt: rangeEnd },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                },
                c: { $sum: 1 },
            },
        },
    ]);
    const byDay = new Map(agg.map((r) => [r._id, r.c]));
    return dayStarts.map((s) => ({
        date: s.toISOString().slice(0, 10),
        views: byDay.get(s.toISOString().slice(0, 10)) ?? 0,
    }));
}
export async function getUserDashboardData(userId) {
    const oid = new mongoose.Types.ObjectId(userId);
    const user = await User.findById(oid);
    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }
    const myIdeaIds = await Idea.find({ authorId: oid }).distinct('_id');
    const [totalIdeas, published, draft, pending, rejected, agg, topIdeaDoc, notifs, follows, weeklyViews, acceptedCollabs, pendingOutgoing, collabOnMyIdeas,] = await Promise.all([
        Idea.countDocuments({ authorId: oid }),
        Idea.countDocuments({ authorId: oid, status: 'published' }),
        Idea.countDocuments({ authorId: oid, status: 'draft' }),
        Idea.countDocuments({
            authorId: oid,
            status: { $in: ['ai_scanning', 'pending_review'] },
        }),
        Idea.countDocuments({ authorId: oid, status: 'rejected' }),
        Idea.aggregate([
            { $match: { authorId: oid } },
            {
                $group: {
                    _id: null,
                    likes: { $sum: '$likeCount' },
                    views: { $sum: '$viewCount' },
                    comments: { $sum: '$commentCount' },
                },
            },
        ]),
        Idea.findOne({ authorId: oid, status: 'published' })
            .sort({ likeCount: -1 })
            .populate('authorId', 'username fullName avatarUrl role'),
        Notification.find({ recipientId: oid })
            .sort({ createdAt: -1 })
            .limit(30)
            .populate('senderId', 'username fullName avatarUrl role status')
            .lean(),
        Follow.find({ followingId: oid })
            .sort({ createdAt: -1 })
            .limit(15)
            .populate('followerId', 'username fullName avatarUrl role status')
            .lean(),
        weeklyViewsForAuthor(oid),
        CollabRequest.find({
            requesterId: oid,
            status: 'accepted',
        })
            .sort({ updatedAt: -1 })
            .limit(10)
            .populate({
            path: 'ideaId',
            populate: {
                path: 'authorId',
                select: 'username fullName avatarUrl role',
            },
        }),
        CollabRequest.find({ requesterId: oid, status: 'pending' })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate({
            path: 'ideaId',
            populate: {
                path: 'authorId',
                select: 'username fullName avatarUrl role',
            },
        }),
        myIdeaIds.length > 0
            ? CollabRequest.countDocuments({
                ideaId: { $in: myIdeaIds },
                status: 'accepted',
            })
            : Promise.resolve(0),
    ]);
    const row = agg[0];
    const totalLikes = row?.likes ?? 0;
    const totalViews = row?.views ?? 0;
    const totalComments = row?.comments ?? 0;
    const refIdeaIds = notifs
        .filter((n) => n.referenceType === 'idea')
        .map((n) => n.referenceId)
        .filter(Boolean);
    const uniqueIdeaIds = [
        ...new Set(refIdeaIds.map((id) => String(id))),
    ].filter((id) => mongoose.Types.ObjectId.isValid(id));
    const ideaDocs = uniqueIdeaIds.length > 0
        ? await Idea.find({
            _id: {
                $in: uniqueIdeaIds.map((id) => new mongoose.Types.ObjectId(id)),
            },
        }).populate('authorId', 'username fullName avatarUrl role')
        : [];
    const ideaById = new Map(ideaDocs.map((i) => [String(i._id), i]));
    const recentActivity = [];
    const typeSet = new Set(['like', 'comment', 'collab_request']);
    for (const n of notifs) {
        if (!typeSet.has(n.type))
            continue;
        const sender = n.senderId;
        if (!sender)
            continue;
        let ideaPayload;
        if (n.referenceType === 'idea') {
            const doc = ideaById.get(String(n.referenceId));
            if (doc)
                ideaPayload = ideaToApi(doc);
        }
        const typeMap = {
            like: 'like',
            comment: 'comment',
            collab_request: 'collab',
        };
        const t = typeMap[n.type];
        if (!t)
            continue;
        recentActivity.push({
            type: t,
            from: userToApiPublic(sender),
            ...(ideaPayload ? { idea: ideaPayload } : {}),
            createdAt: n.createdAt.toISOString(),
        });
        if (recentActivity.length >= 12)
            break;
    }
    for (const f of follows) {
        if (recentActivity.length >= 15)
            break;
        const follower = f.followerId;
        if (!follower)
            continue;
        recentActivity.push({
            type: 'follow',
            from: userToApiPublic(follower),
            createdAt: f.createdAt.toISOString(),
        });
    }
    recentActivity.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const collaborations = acceptedCollabs
        .map((c) => {
        const idea = c.ideaId;
        if (!idea || !idea._id)
            return null;
        return {
            idea: ideaToApi(idea),
            role: 'Collaborator',
            status: String(c.status),
        };
    })
        .filter(Boolean);
    const pendingCollabRequests = pendingOutgoing
        .map((c) => {
        const idea = c.ideaId;
        if (!idea)
            return null;
        return {
            idea: ideaToApi(idea),
            status: String(c.status),
            createdAt: c.createdAt.toISOString(),
        };
    })
        .filter(Boolean);
    let topIdea = null;
    if (topIdeaDoc) {
        topIdea = ideaToApi(topIdeaDoc);
    }
    return {
        profile: userToApi(user),
        stats: {
            totalIdeas,
            totalLikes,
            totalViews,
            totalComments,
            totalCollaborators: collabOnMyIdeas,
            totalFollowers: user.followerCount ?? 0,
        },
        ideas: {
            published,
            draft,
            pending,
            rejected,
            topIdea,
        },
        recentActivity: recentActivity.slice(0, 15),
        weeklyViews,
        collaborations,
        pendingCollabRequests,
    };
}
/** Full list for /users/me/collaborations (dashboard only includes a short preview). */
export async function getUserCollaborationsList(userId) {
    const oid = new mongoose.Types.ObjectId(userId);
    const [acceptedRows, pendingRows] = await Promise.all([
        CollabRequest.find({ requesterId: oid, status: 'accepted' })
            .sort({ updatedAt: -1 })
            .limit(100)
            .populate({
            path: 'ideaId',
            populate: {
                path: 'authorId',
                select: 'username fullName avatarUrl role',
            },
        }),
        CollabRequest.find({ requesterId: oid, status: 'pending' })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate({
            path: 'ideaId',
            populate: {
                path: 'authorId',
                select: 'username fullName avatarUrl role',
            },
        }),
    ]);
    const accepted = acceptedRows
        .map((c) => {
        const idea = c.ideaId;
        if (!idea?._id)
            return null;
        return {
            idea: ideaToApi(idea),
            role: 'Collaborator',
            status: String(c.status),
            acceptedAt: c.updatedAt instanceof Date
                ? c.updatedAt.toISOString()
                : String(c.updatedAt ?? ''),
        };
    })
        .filter(Boolean);
    const pending = pendingRows
        .map((c) => {
        const idea = c.ideaId;
        if (!idea)
            return null;
        return {
            idea: ideaToApi(idea),
            status: String(c.status),
            createdAt: c.createdAt instanceof Date
                ? c.createdAt.toISOString()
                : String(c.createdAt ?? ''),
        };
    })
        .filter(Boolean);
    return { accepted, pending };
}
//# sourceMappingURL=user-dashboard.service.js.map