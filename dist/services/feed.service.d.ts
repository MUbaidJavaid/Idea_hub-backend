import type { IIdeaDocument } from '../models/Idea.model.js';
export declare function getFeedPage(params: {
    userId: string | null;
    cursor?: string | null;
    limit?: number;
    /** Single tag filter (lowercase); matches ideas that include this tag */
    tag?: string | null;
}): Promise<{
    ideas: IIdeaDocument[];
    nextCursor?: string;
}>;
//# sourceMappingURL=feed.service.d.ts.map