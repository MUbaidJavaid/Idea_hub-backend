import { closeRedisConnection, getRedisClient, } from '../config/redis.js';
/** @deprecated Prefer getRedisClient from config/redis.js */
export function getRedis() {
    return getRedisClient();
}
export async function closeRedis() {
    await closeRedisConnection();
}
//# sourceMappingURL=redis.js.map