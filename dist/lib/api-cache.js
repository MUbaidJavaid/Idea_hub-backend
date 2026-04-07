import { getRedis } from './redis.js';
const PREFIX = 'api:';
export async function cacheGetJson(key) {
    const r = getRedis();
    if (!r)
        return null;
    try {
        const raw = await r.get(`${PREFIX}${key}`);
        if (!raw)
            return null;
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
export async function cacheSetJson(key, value, ttlSeconds) {
    const r = getRedis();
    if (!r)
        return;
    try {
        await r.set(`${PREFIX}${key}`, JSON.stringify(value), 'EX', ttlSeconds);
    }
    catch {
        /* ignore cache failures */
    }
}
export async function cacheDel(key) {
    const r = getRedis();
    if (!r)
        return;
    try {
        await r.del(`${PREFIX}${key}`);
    }
    catch {
        /* ignore */
    }
}
//# sourceMappingURL=api-cache.js.map