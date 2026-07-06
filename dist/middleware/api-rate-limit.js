import { rateLimit } from 'express-rate-limit';
const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const max = Number(process.env.RATE_LIMIT_MAX) ||
    (process.env.NODE_ENV === 'production' ? 3000 : 20_000);
let globalApiLimiter = null;
let strictWriteLimiter = null;
function createGlobalLimiter() {
    return rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message: 'Too many requests — try again later',
            data: null,
            errors: [],
        },
        skip: (req) => req.path === '/' ||
            req.path === '/health' ||
            req.path.startsWith('/health/'),
    });
}
function createStrictWriteLimiter() {
    return rateLimit({
        windowMs,
        max: Math.min(max, 600),
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message: 'Too many write requests — slow down',
            data: null,
            errors: [],
        },
    });
}
/** Lazy init — avoids module-load failures in serverless bundles. */
export function getGlobalApiLimiter() {
    if (!globalApiLimiter) {
        try {
            globalApiLimiter = createGlobalLimiter();
        }
        catch (err) {
            console.error('[api] rate-limit init failed, using noop', err);
            return (_req, _res, next) => next();
        }
    }
    return globalApiLimiter;
}
export function getStrictWriteLimiter() {
    if (!strictWriteLimiter) {
        try {
            strictWriteLimiter = createStrictWriteLimiter();
        }
        catch (err) {
            console.error('[api] strict rate-limit init failed, using noop', err);
            return (_req, _res, next) => next();
        }
    }
    return strictWriteLimiter;
}
//# sourceMappingURL=api-rate-limit.js.map