import { rateLimit } from 'express-rate-limit';
let authLimiter = null;
/** Stricter limit for auth endpoints (login, register, password reset). */
export function getAuthLimiter() {
    if (!authLimiter) {
        try {
            authLimiter = rateLimit({
                windowMs: 15 * 60 * 1000,
                max: 40,
                standardHeaders: true,
                legacyHeaders: false,
                message: {
                    success: false,
                    message: 'Too many attempts, please try again later',
                    data: null,
                },
            });
        }
        catch (err) {
            console.error('[api] auth rate-limit init failed, using noop', err);
            return (_req, _res, next) => next();
        }
    }
    return authLimiter;
}
//# sourceMappingURL=rateLimiter.js.map