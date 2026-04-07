import type { IIdeaDocument } from '../models/Idea.model.js';
import type { IMarketplaceListingDocument } from '../models/MarketplaceListing.model.js';
export declare function ideaPreviewForListing(idea: IIdeaDocument | Record<string, unknown>): Record<string, unknown>;
export declare function listingToApi(doc: IMarketplaceListingDocument, opts?: {
    idea?: Record<string, unknown> | null;
    seller?: Record<string, unknown> | null;
    isSeller?: boolean;
    viewerUserId?: string | null;
    bidderSummaries?: Map<string, Record<string, unknown>>;
}): Record<string, unknown>;
//# sourceMappingURL=serialize-marketplace.d.ts.map