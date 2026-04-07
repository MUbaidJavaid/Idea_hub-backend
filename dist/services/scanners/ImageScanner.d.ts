import type { MediaScanResult } from './types.js';
export declare class ImageScanner {
    private readonly textScanner;
    /**
     * Download image from URL (e.g. Firebase download URL) and scan.
     */
    scan(firebaseUrl: string): Promise<MediaScanResult>;
    /**
     * Scan an in-memory image (e.g. extracted video frames).
     */
    scanFromBuffer(buffer: Buffer, meta?: Record<string, unknown>): Promise<MediaScanResult>;
    /**
     * When Vision is disabled, avoid false positives: light OCR-free heuristic only.
     */
    private runOcrHeuristic;
}
//# sourceMappingURL=ImageScanner.d.ts.map