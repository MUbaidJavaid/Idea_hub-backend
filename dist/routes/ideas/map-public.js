import mongoose from 'mongoose';
import { levelFromTotalXp } from '../../config/xp.config.js';
import { attachAiCoachForAuthor, ideaToApi, } from '../../lib/serialize-idea.js';
import { IdeaPollVote, UserProgress } from '../../models/index.js';
import { isGamificationEnabled } from '../../services/gamification.service.js';
import { authorMapForIds } from './author-utils.js';
export async function mapIdeasForPublicApi(docs, viewerUserId) {
    if (docs.length === 0)
        return [];
    const pollVotesByIdea = new Map();
    if (viewerUserId && mongoose.Types.ObjectId.isValid(viewerUserId)) {
        const votes = await IdeaPollVote.find({
            userId: new mongoose.Types.ObjectId(viewerUserId),
            ideaId: { $in: docs.map((d) => d._id) },
        })
            .select('ideaId optionKey')
            .lean();
        for (const v of votes) {
            pollVotesByIdea.set(String(v.ideaId), v.optionKey);
        }
    }
    const authorIds = [...new Set(docs.map((d) => String(d.authorId)))];
    const authors = await authorMapForIds(authorIds);
    const gamify = new Map();
    if (isGamificationEnabled()) {
        const oids = authorIds
            .filter((id) => mongoose.Types.ObjectId.isValid(id))
            .map((id) => new mongoose.Types.ObjectId(id));
        if (oids.length > 0) {
            const rows = await UserProgress.find({ userId: { $in: oids } })
                .select('userId totalXP level levelTitle')
                .lean();
            for (const r of rows) {
                const totalXP = r.totalXP ?? 0;
                gamify.set(String(r.userId), {
                    level: r.level ?? 1,
                    levelTitle: r.levelTitle ?? 'Idea Spark',
                    levelEmoji: levelFromTotalXp(totalXP).emoji,
                    totalXP,
                });
            }
        }
    }
    return docs.map((idea) => {
        const j = ideaToApi(idea);
        attachAiCoachForAuthor(idea, j, viewerUserId);
        const mv = pollVotesByIdea.get(String(idea._id));
        const poll = j.poll;
        if (poll && typeof poll === 'object') {
            j.poll = { ...poll, myVote: mv ?? null };
        }
        const aid = String(j.authorId);
        const userObj = authors.get(aid);
        if (!userObj)
            return j;
        const g = gamify.get(aid);
        return {
            ...j,
            authorId: {
                ...userObj,
                ...(g ? { gamification: g } : {}),
            },
        };
    });
}
//# sourceMappingURL=map-public.js.map