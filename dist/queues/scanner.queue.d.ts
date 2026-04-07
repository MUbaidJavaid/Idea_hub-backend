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
export declare function addScanJob(ideaId: string, mediaItems: ScanJobPayload['mediaItems'], options?: {
    priority?: number;
}): Promise<void>;
export declare function closeScanQueue(): Promise<void>;
//# sourceMappingURL=scanner.queue.d.ts.map