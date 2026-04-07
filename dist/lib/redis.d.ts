import type { Redis } from 'ioredis';
/** @deprecated Prefer getRedisClient from config/redis.js */
export declare function getRedis(): Redis | null;
export declare function closeRedis(): Promise<void>;
//# sourceMappingURL=redis.d.ts.map