export declare function cacheGetJson<T>(key: string): Promise<T | null>;
export declare function cacheSetJson(key: string, value: unknown, ttlSeconds: number): Promise<void>;
export declare function cacheDel(key: string): Promise<void>;
//# sourceMappingURL=api-cache.d.ts.map