import type { IIdeaValidationScore } from '../models/Idea.model.js';
export declare function scheduleValidationRecalculate(ideaId: string, options?: {
    forceAi?: boolean;
}): void;
export declare function calculateScore(ideaId: string, options?: {
    forceAi?: boolean;
}): Promise<IIdeaValidationScore | null>;
export declare function recalculateAllPublishedIdeas(options?: {
    forceAi?: boolean;
    batchSize?: number;
}): Promise<number>;
//# sourceMappingURL=ValidationEngine.d.ts.map