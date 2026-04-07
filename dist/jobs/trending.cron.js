import cron from 'node-cron';
import { BehaviorEvent, Idea } from '../models/index.js';
const TRENDING_XP_THRESHOLD = 50;
cron.schedule('*/15 * * * *', async () => {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const events = await BehaviorEvent.aggregate([
        {
            $match: {
                createdAt: { $gte: since },
                ideaId: { $ne: null },
            },
        },
        {
            $group: {
                _id: { ideaId: '$ideaId', eventType: '$eventType' },
                count: { $sum: 1 },
            },
        },
        {
            $group: {
                _id: '$_id.ideaId',
                counts: { $push: { k: '$_id.eventType', v: '$count' } },
            },
        },
        {
            $addFields: { countsMap: { $arrayToObject: '$counts' } },
        },
    ]);
    const EVENT_WEIGHTS = {
        like: 3,
        view: 1,
        comment: 2,
        share: 4,
        collab_request: 5,
    };
    const bulkOps = events.map((e) => {
        const counts = e.countsMap;
        const trendingScore = Object.entries(EVENT_WEIGHTS).reduce((sum, [event, weight]) => sum + (counts[event] ?? 0) * weight, 0);
        return {
            updateOne: {
                filter: { _id: e._id },
                update: { $set: { trendingScore } },
            },
        };
    });
    if (bulkOps.length > 0) {
        await Idea.bulkWrite(bulkOps);
        console.log(`[trending] updated scores for ${bulkOps.length} ideas`);
    }
    if (String(process.env.ENABLE_GAMIFICATION ?? '').toLowerCase() === 'true') {
        const { onIdeaTrending } = await import('../services/gamification.service.js');
        const hot = await Idea.find({
            status: 'published',
            trendingScore: { $gte: TRENDING_XP_THRESHOLD },
            $or: [{ trendingXpAwarded: false }, { trendingXpAwarded: { $exists: false } }],
        })
            .select('_id authorId')
            .lean();
        for (const row of hot) {
            await onIdeaTrending(String(row.authorId));
            await Idea.updateOne({ _id: row._id }, { $set: { trendingXpAwarded: true } });
        }
    }
}, { timezone: 'UTC' });
//# sourceMappingURL=trending.cron.js.map