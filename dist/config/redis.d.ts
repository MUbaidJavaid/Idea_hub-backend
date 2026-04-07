import { Redis } from 'ioredis';
/**
 * Shared ioredis client for BullMQ and app code. Returns null when REDIS_URL is unset
 * (no connection attempt — avoids localhost:6379 ECONNREFUSED on platforms like Render).
 */
export declare function getRedisClient(): Redis | null;
/** Use when Redis is mandatory (e.g. scanner worker process). */
export declare function requireRedisClient(): Redis;
export declare function closeRedisConnection(): Promise<void>;
//# sourceMappingURL=redis.d.ts.map