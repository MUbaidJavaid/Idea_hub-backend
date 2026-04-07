import { Queue } from 'bullmq';
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
export declare const scanQueue: Queue<ScanJobPayload, any, string, ScanJobPayload, any, string>;
export declare function addScanJob(ideaId: string, mediaItems: ScanJobPayload['mediaItems'], options?: {
    priority?: number;
}): Promise<void>;
//# sourceMappingURL=scanner.queue.d.ts.map