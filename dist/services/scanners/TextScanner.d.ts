import type { ScanResult } from './types.js';
export declare class TextScanner {
    scan(input: {
        title?: string;
        description?: string;
        tags?: string[];
    }): Promise<ScanResult>;
    private checkHateSpeech;
    private checkSpam;
    private checkNSFW;
    private checkPII;
    private checkPromptInjection;
}
//# sourceMappingURL=TextScanner.d.ts.map