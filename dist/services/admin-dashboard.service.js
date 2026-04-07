import { ideaToApi } from '../lib/serialize-idea.js';
import { userToApi } from '../lib/serialize-user.js';
import { CollabRequest, Comment, Idea, Like, User } from '../models/index.js';
function startOfUtcDay(d) {
    const x = new Date(d);
    x.setUTCHours(0, 0, 0, 0);
    return x;
}
function pctChange(today, yesterday) {
    if (yesterday <= 0)
        return today > 0 ? 100 : 0;
    return Math.round(((today - yesterday) / yesterday) * 1000) / 10;
}
async function generateWeeklyActivity() {
    const now = new Date();
    const dayStarts = [6, 5, 4, 3, 2, 1, 0].map((i) => {
        const d = new Date(now);
        d.setUTCDate(d.getUTCDate() - i);
        return startOfUtcDay(d);
    });
    const rows = await Promise.all(dayStarts.map(async (start) => {
        const end = new Date(start);
        end.setUTCDate(end.getUTCDate() + 1);
        const [users, ideas] = await Promise.all([
            User.countDocuments({ createdAt: { $gte: start, $lt: end } }),
            Idea.countDocuments({ createdAt: { $gte: start, $lt: end } }),
        ]);
        return {
            date: start.toISOString().slice(0, 10),
            users,
            ideas,
        };
    }));
    return rows;
}
async function ideasTrendLast12Months(now) {
    const labels = [];
    const counts = [];
    for (let i = 11; i >= 0; i -= 1) {
        const dt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
        const next = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth() + 1, 1));
        const c = await Idea.countDocuments({
            createdAt: { $gte: dt, $lt: next },
        });
        labels.push(dt.toLocaleString('en', { month: 'short', timeZone: 'UTC' }));
        counts.push(c);
    }
    return { labels, counts };
}
/** Last N calendar months of new ideas (UTC), for dashboard line chart. */
async function ideasTrendLastNMonths(now, n) {
    const labels = [];
    const counts = [];
    for (let i = n - 1; i >= 0; i -= 1) {
        const dt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
        const next = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth() + 1, 1));
        const c = await Idea.countDocuments({
            createdAt: { $gte: dt, $lt: next },
        });
        labels.push(dt.toLocaleString('en', { month: 'short', timeZone: 'UTC' }));
        counts.push(c);
    }
    return { labels, counts };
}
const QUEUE_STATUSES = ['flagged', 'ai_scanning', 'pending_review'];
export async function getAdminDashboardStats() {
    const now = new Date();
    const dayStart = startOfUtcDay(now);
    const yesterdayStart = new Date(dayStart);
    yesterdayStart.setUTCDate(yesterdayStart.getUTCDate() - 1);
    const thirtyAgo = new Date(now);
    thirtyAgo.setUTCDate(thirtyAgo.getUTCDate() - 30);
    const startThisMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const startLastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
    const [totalUsers, activeUsers, totalIdeas, publishedIdeas, likeSumAgg, newUsersToday, newIdeasToday, newUsersYesterday, newIdeasYesterday, newLikesToday, pendingReview, approvedToday, rejectedToday, scanJobsRan, topIdeaDocs, recentUserDocs, categoryAgg, weeklyActivity, dau, mau, rejectedAll, totalDecided, activeCollabs, ideasLast12, queueToday, queueYesterday, avgScoreResult,] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ status: 'active' }),
        Idea.countDocuments(),
        Idea.countDocuments({ status: 'published' }),
        Idea.aggregate([
            { $match: { status: 'published' } },
            { $group: { _id: null, s: { $sum: '$likeCount' } } },
        ]),
        User.countDocuments({ createdAt: { $gte: dayStart } }),
        Idea.countDocuments({ createdAt: { $gte: dayStart } }),
        User.countDocuments({
            createdAt: { $gte: yesterdayStart, $lt: dayStart },
        }),
        Idea.countDocuments({
            createdAt: { $gte: yesterdayStart, $lt: dayStart },
        }),
        Like.countDocuments({ createdAt: { $gte: dayStart } }),
        Idea.countDocuments({ status: { $in: [...QUEUE_STATUSES] } }),
        Idea.countDocuments({
            status: 'published',
            updatedAt: { $gte: dayStart },
        }),
        Idea.countDocuments({
            status: 'rejected',
            updatedAt: { $gte: dayStart },
        }),
        Idea.countDocuments({
            $or: [
                { 'contentScanReport.scannedAt': { $gte: dayStart } },
                {
                    updatedAt: { $gte: dayStart },
                    status: { $in: [...QUEUE_STATUSES] },
                },
            ],
        }),
        Idea.find({ status: 'published' })
            .sort({ likeCount: -1 })
            .limit(5)
            .populate('authorId', 'username fullName avatarUrl role'),
        User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('username fullName avatarUrl createdAt status role'),
        Idea.aggregate([
            { $match: { status: 'published' } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]),
        generateWeeklyActivity(),
        User.countDocuments({ lastSeenAt: { $gte: dayStart } }),
        User.countDocuments({
            $or: [
                { lastSeenAt: { $gte: thirtyAgo } },
                { createdAt: { $gte: thirtyAgo } },
            ],
        }),
        Idea.countDocuments({ status: 'rejected' }),
        Idea.countDocuments({
            status: { $in: ['published', 'rejected'] },
        }),
        CollabRequest.countDocuments({
            status: { $in: ['pending', 'accepted'] },
        }),
        ideasTrendLast12Months(now),
        Idea.countDocuments({
            status: { $in: [...QUEUE_STATUSES] },
            createdAt: { $gte: dayStart },
        }),
        Idea.countDocuments({
            status: { $in: [...QUEUE_STATUSES] },
            createdAt: { $gte: yesterdayStart, $lt: dayStart },
        }),
        Idea.aggregate([
            { $match: { status: { $in: [...QUEUE_STATUSES] } } },
            { $group: { _id: null, avg: { $avg: '$contentScanScore' } } },
        ]),
    ]);
    const [acceptedCollabsOnly, ideasLast6, statusAggRows, ideasThisMonth, ideasLastMonthPeriod, usersThisMonth, usersLastMonthPeriod, topContributorRows, recentIdeasDocs, pendingApprovalDocs, totalComments, flaggedComments,] = await Promise.all([
        CollabRequest.countDocuments({ status: 'accepted' }),
        ideasTrendLastNMonths(now, 6),
        Idea.aggregate([
            { $group: { _id: '$status', c: { $sum: 1 } } },
        ]),
        Idea.countDocuments({ createdAt: { $gte: startThisMonth } }),
        Idea.countDocuments({
            createdAt: { $gte: startLastMonth, $lt: startThisMonth },
        }),
        User.countDocuments({ createdAt: { $gte: startThisMonth } }),
        User.countDocuments({
            createdAt: { $gte: startLastMonth, $lt: startThisMonth },
        }),
        Idea.aggregate([
            { $match: { status: 'published' } },
            {
                $group: {
                    _id: '$authorId',
                    ideasCount: { $sum: 1 },
                    votesReceived: { $sum: '$likeCount' },
                },
            },
            { $sort: { votesReceived: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: User.collection.collectionName,
                    localField: '_id',
                    foreignField: '_id',
                    as: 'u',
                },
            },
            { $unwind: '$u' },
            {
                $project: {
                    userId: '$_id',
                    username: '$u.username',
                    fullName: '$u.fullName',
                    ideasCount: 1,
                    votesReceived: 1,
                },
            },
        ]),
        Idea.find()
            .sort({ createdAt: -1 })
            .limit(8)
            .populate('authorId', 'username fullName avatarUrl role'),
        Idea.find({ status: { $in: [...QUEUE_STATUSES] } })
            .sort({ updatedAt: -1 })
            .limit(8)
            .populate('authorId', 'username fullName avatarUrl role'),
        Comment.countDocuments(),
        Comment.countDocuments({ status: 'flagged' }),
    ]);
    const totalLikeSum = likeSumAgg[0]?.s ?? 0;
    const avgScore = Math.round((avgScoreResult[0]?.avg ?? 0) * 10) / 10;
    const categoryBreakdown = {};
    for (const row of categoryAgg) {
        categoryBreakdown[String(row._id ?? 'other')] = row.count;
    }
    const rejectionRate = totalDecided > 0 ? rejectedAll / totalDecided : 0;
    const topCategories = categoryAgg
        .map((r) => ({ category: String(r._id ?? 'other'), count: r.count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);
    const categoryDistribution = topCategories.map((t) => ({
        name: t.category,
        value: t.count,
    }));
    const ideasTrend = ideasLast12.labels.map((label, i) => ({
        label,
        value: ideasLast12.counts[i] ?? 0,
    }));
    const engagementBuckets = [
        { name: 'Published', value: publishedIdeas },
        { name: 'In review', value: pendingReview },
        { name: 'Rejected', value: rejectedAll },
    ];
    const ideasByStatus = {};
    for (const row of statusAggRows) {
        ideasByStatus[String(row._id ?? 'unknown')] = row.c;
    }
    const ideasTrend6Months = ideasLast6.labels.map((label, i) => ({
        label,
        value: ideasLast6.counts[i] ?? 0,
    }));
    const topContributors = topContributorRows.map((r) => ({
        userId: String(r.userId),
        username: r.username,
        fullName: r.fullName,
        ideasCount: r.ideasCount,
        votesReceived: r.votesReceived,
    }));
    return {
        overview: {
            totalUsers,
            activeUsers,
            totalIdeas,
            publishedIdeas,
            totalLikes: totalLikeSum,
            totalCollabs: activeCollabs,
        },
        trends: {
            usersPct: pctChange(newUsersToday, newUsersYesterday),
            ideasPct: pctChange(newIdeasToday, newIdeasYesterday),
            signupsTodayPct: pctChange(newUsersToday, newUsersYesterday),
            queuePct: pctChange(queueToday, queueYesterday),
        },
        today: {
            newUsers: newUsersToday,
            newIdeas: newIdeasToday,
            newLikes: newLikesToday,
            scanJobsRan,
        },
        scanQueue: {
            pending: pendingReview,
            approvedToday,
            rejectedToday,
            avgScore,
        },
        topIdeas: topIdeaDocs.map((i) => ideaToApi(i)),
        recentUsers: recentUserDocs.map((u) => userToApi(u)),
        categoryBreakdown,
        weeklyActivity,
        legacy: {
            dau,
            mau,
            ideasTrend,
            categoryDistribution,
            engagementBuckets,
            rejectionRate,
        },
        kpis: {
            totalIdeas,
            activeProjects: acceptedCollabsOnly,
            totalUsers,
            publishedIdeas,
        },
        ideasTrend6Months,
        ideasByStatus,
        monthlyGrowth: {
            ideasPct: pctChange(ideasThisMonth, ideasLastMonthPeriod),
            usersPct: pctChange(usersThisMonth, usersLastMonthPeriod),
        },
        recentIdeasFeed: recentIdeasDocs.map((i) => ideaToApi(i)),
        topContributors,
        pendingApprovals: pendingApprovalDocs.map((i) => ideaToApi(i)),
        comments: {
            total: totalComments,
            flagged: flaggedComments,
        },
    };
}
//# sourceMappingURL=admin-dashboard.service.js.map