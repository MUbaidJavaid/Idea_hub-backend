import type { MediaScanResult } from './types.js';
export declare class VideoScanner {
    private readonly imageScanner;
    private readonly textScanner;
    scan(firebaseUrl: string, ideaId: string): Promise<MediaScanResult>;
}
//# sourceMappingURL=VideoScanner.d.ts.map