import { Queue } from 'bullmq';
import redis from '../config/redis.js';
export const scanQueue = new Queue('content-scan', {
    connection: redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 200 },
    },
});
export async function addScanJob(ideaId, mediaItems, options) {
    await scanQueue.add('scan-idea', { ideaId, mediaItems }, {
        jobId: `scan-${ideaId}-${Date.now()}`,
        ...(typeof options?.priority === 'number'
            ? { priority: options.priority }
            : {}),
    });
}
//# sourceMappingURL=scanner.queue.js.map