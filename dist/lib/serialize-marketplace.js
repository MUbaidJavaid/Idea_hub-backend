import { ideaToApi } from './serialize-idea.js';
export function ideaPreviewForListing(idea) {
    const j = ideaToApi(idea);
    const media = j.media ?? [];
    const first = media.find((m) => m.mediaType === 'image' || m.mediaType === 'video');
    const thumb = first
        ? String(first.thumbnailUrl || first.cdnUrl || first.firebaseUrl || '').trim()
        : '';
    return {
        _id: j._id,
        title: j.title,
        category: j.category,
        thumbnailUrl: thumb,
        validationScore: j.validationScore,
    };
}
function iso(d) {
    if (d instanceof Date)
        return d.toISOString();
    if (typeof d === 'string')
        return d;
    return null;
}
export function listingToApi(doc, opts = {}) {
    const j = doc.toObject({ virtuals: true });
    const bids = Array.isArray(j.bids) ? j.bids : [];
    const viewer = opts.viewerUserId ?? null;
    const isSeller = Boolean(opts.isSeller);
    function mapBid(b) {
        const bidderId = String(b.bidderId);
        const base = {
            _id: String(b._id),
            bidderId,
            amount: b.amount,
            message: b.message ?? '',
            status: b.status,
            createdAt: iso(b.createdAt),
        };
        if (isSeller && opts.bidderSummaries?.has(bidderId)) {
            return { ...base, bidder: opts.bidderSummaries.get(bidderId) };
        }
        return base;
    }
    let bidsOut = [];
    if (isSeller) {
        bidsOut = bids.map((b) => mapBid(b));
    }
    else if (viewer) {
        bidsOut = bids
            .filter((b) => String(b.bidderId) === viewer)
            .map((b) => mapBid(b));
    }
    return {
        _id: String(j._id),
        ideaId: String(j.ideaId),
        sellerId: String(j.sellerId),
        listingType: j.listingType,
        askingPrice: j.askingPrice ?? 0,
        equity: j.equity ?? 0,
        status: j.status,
        description: j.description ?? '',
        proofPoints: j.proofPoints ?? [],
        targetBuyer: j.targetBuyer ?? '',
        views: j.views ?? 0,
        interestedCount: j.interestedCount ?? 0,
        bidCount: bids.length,
        bids: bidsOut,
        soldTo: j.soldTo ? String(j.soldTo) : null,
        soldPrice: j.soldPrice ?? null,
        soldAt: iso(j.soldAt),
        platformFeeUsd: j.platformFeeUsd ?? null,
        netToSellerUsd: j.netToSellerUsd ?? null,
        expiresAt: iso(j.expiresAt),
        featuredUntil: iso(j.featuredUntil ?? null),
        isFeatured: Boolean(j.featuredUntil &&
            new Date(j.featuredUntil).getTime() > Date.now()),
        createdAt: iso(j.createdAt),
        updatedAt: iso(j.updatedAt),
        idea: opts.idea ?? null,
        seller: opts.seller ?? null,
    };
}
//# sourceMappingURL=serialize-marketplace.js.map