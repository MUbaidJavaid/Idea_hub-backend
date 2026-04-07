import { Worker, type Job } from 'bullmq';
import type { ScanJobPayload } from '../queues/scanner.queue.js';
export declare function processScanJob(job: Job<ScanJobPayload>): Promise<{
    ideaId: string;
    decision: 'flagged' | 'ok';
    score: number;
}>;
export declare function createScannerWorker(): Worker<ScanJobPayload>;
//# sourceMappingURL=scanner.worker.d.ts.map