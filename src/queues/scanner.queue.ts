import { Queue } from 'bullmq';

import redis from '../config/redis.js';

export interface ScanJobPayload {
  ideaId: string;
  mediaItems: Array<{
    mediaId: string;
    /** HTTPS URL (Cloudinary, Firebase, etc.) */
    mediaUrl: string;
    /** @deprecated Prefer mediaUrl */
    firebaseUrl?: string;
    mediaType: string;
    mimeType: string;
  }>;
}

export const scanQueue = new Queue<ScanJobPayload>('content-scan', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 200 },
  },
});

export async function addScanJob(
  ideaId: string,
  mediaItems: ScanJobPayload['mediaItems'],
  options?: { priority?: number }
): Promise<void> {
  await scanQueue.add(
    'scan-idea',
    { ideaId, mediaItems },
    {
      jobId: `scan-${ideaId}-${Date.now()}`,
      ...(typeof options?.priority === 'number'
        ? { priority: options.priority }
        : {}),
    }
  );
}
