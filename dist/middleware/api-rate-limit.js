import rateLimit from 'express-rate-limit';
const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const max = Number(process.env.RATE_LIMIT_MAX) ||
    (process.env.NODE_ENV === 'production' ? 3000 : 20_000);
export const globalApiLimiter = rateLimit({
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
export const strictWriteLimiter = rateLimit({
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
//# sourceMappingURL=api-rate-limit.js.map