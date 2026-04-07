/**
 * Marketplace & subscription monetization constants (Stripe wiring comes later).
 */
/** Platform commission on completed sales (buyer pays full amount; seller receives net). */
export declare const PLATFORM_SALE_COMMISSION_RATE = 0.15;
export declare const LISTING_TTL_DAYS = 60;
/** Monthly add-on prices in USD (display + future billing). */
export declare const SUBSCRIPTION_PRICES_USD: {
    readonly premiumListingMonthly: 29;
    readonly proSellerMonthly: 9;
    readonly investorMonthly: 99;
};
export declare function platformFeeFromSaleUsd(salePriceUsd: number): number;
export declare function netToSellerUsd(salePriceUsd: number): number;
//# sourceMappingURL=monetization.config.d.ts.map