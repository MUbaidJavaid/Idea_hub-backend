import mongoose from 'mongoose';
import { LISTING_TTL_DAYS } from '../config/monetization.config.js';
import { MarketplaceListing, Notification } from '../models/index.js';
export function defaultListingExpiresAt() {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + LISTING_TTL_DAYS);
    return d;
}
export async function assertNoConflictingActiveListing(ideaId, excludeListingId) {
    const q = {
        ideaId,
        status: { $in: ['active', 'under_negotiation'] },
    };
    if (excludeListingId) {
        q._id = { $ne: excludeListingId };
    }
    const exists = await MarketplaceListing.exists(q);
    return !exists;
}
export async function notifyMarketplaceBid(params) {
    await Notification.create({
        recipientId: params.sellerId,
        senderId: null,
        type: 'marketplace_bid',
        referenceId: params.listingId,
        referenceType: 'marketplace_listing',
        title: 'New offer on your listing',
        body: `${params.bidderName} offered $${params.amount} on “${params.ideaTitle.slice(0, 80)}”.`.slice(0, 500),
        isRead: false,
        isPushSent: false,
        metadata: { amount: params.amount },
    });
}
export async function notifyMarketplaceInterest(params) {
    await Notification.create({
        recipientId: params.sellerId,
        senderId: null,
        type: 'marketplace_interest',
        referenceId: params.listingId,
        referenceType: 'marketplace_listing',
        title: 'Someone expressed interest',
        body: `${params.userName} is interested in “${params.ideaTitle.slice(0, 80)}”.`.slice(0, 500),
        isRead: false,
        isPushSent: false,
        metadata: {},
    });
}
export async function notifyBidderOutcome(params) {
    await Notification.create({
        recipientId: params.bidderId,
        senderId: null,
        type: params.accepted
            ? 'marketplace_bid_accepted'
            : 'marketplace_bid_rejected',
        referenceId: params.listingId,
        referenceType: 'marketplace_listing',
        title: params.accepted ? 'Your offer was accepted' : 'Your offer was declined',
        body: params.accepted
            ? `The seller accepted your offer for “${params.ideaTitle.slice(0, 80)}”.`
            : `Your offer on “${params.ideaTitle.slice(0, 80)}” was not accepted.`.slice(0, 500),
        isRead: false,
        isPushSent: false,
        metadata: {},
    });
}
export async function loadListingForSeller(listingId, sellerId) {
    if (!mongoose.Types.ObjectId.isValid(listingId) ||
        !mongoose.Types.ObjectId.isValid(sellerId)) {
        return null;
    }
    return MarketplaceListing.findOne({
        _id: new mongoose.Types.ObjectId(listingId),
        sellerId: new mongoose.Types.ObjectId(sellerId),
    });
}
export function validStatusTransition(from, to) {
    if (from === 'sold' || from === 'withdrawn')
        return false;
    if (to === 'active') {
        return from === 'draft' || from === 'under_negotiation';
    }
    if (to === 'withdrawn') {
        return true;
    }
    if (to === 'draft') {
        return from === 'active' || from === 'under_negotiation';
    }
    return false;
}
//# sourceMappingURL=marketplace.service.js.map