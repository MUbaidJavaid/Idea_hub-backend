import { logger } from '../lib/logger.js';
import { Idea } from '../models/index.js';
const log = logger.child({ module: 'gamification' });
import { modelEvents, } from '../models/modelEvents.js';
import { isGamificationEnabled, onCollabAccepted, onCollabRequestSent, onCommentPosted, onIdeaReceivedLike, onLikeGiven, onNewFollower, } from '../services/gamification.service.js';
export function registerGamificationListeners() {
    if (!isGamificationEnabled())
        return;
    modelEvents.on('like:created', (p) => {
        void (async () => {
            try {
                const idea = await Idea.findById(p.ideaId)
                    .select('authorId likeCount')
                    .lean();
                if (!idea)
                    return;
                const authorId = String(idea.authorId);
                if (authorId === p.userId)
                    return;
                await onLikeGiven(p.userId);
                await onIdeaReceivedLike(authorId, idea.likeCount ?? 0);
            }
            catch (err) {
                log.error({ err, event: 'like:created' }, 'handler failed');
            }
        })();
    });
    modelEvents.on('comment:created', (p) => {
        if (!p.authorId)
            return;
        void onCommentPosted(p.authorId).catch((err) => {
            console.error('[gamification] comment:created', err);
        });
    });
    modelEvents.on('collab:request-created', (p) => {
        void onCollabRequestSent(p.requesterId).catch((err) => {
            log.error({ err, event: 'collab:request-created' }, 'handler failed');
        });
    });
    modelEvents.on('collab:accepted', (p) => {
        void onCollabAccepted(p.requesterId).catch((err) => {
            console.error('[gamification] collab:accepted', err);
        });
    });
    modelEvents.on('follow:created', (p) => {
        void onNewFollower(p.followingId).catch((err) => {
            log.error({ err, event: 'follow:created' }, 'handler failed');
        });
    });
    log.info('event listeners registered');
}
//# sourceMappingURL=gamification.listener.js.map