import { verifyAccessToken } from '../lib/jwt.js';
/** Sets `res.locals.authUserId` when a valid Bearer access token is present; otherwise continues anonymously. */
export function optionalAuth(req, res, next) {
    const raw = req.headers.authorization;
    const m = typeof raw === 'string' ? raw.match(/^Bearer\s+(\S+)/i) : null;
    if (!m?.[1]) {
        next();
        return;
    }
    try {
        const { sub } = verifyAccessToken(m[1]);
        res.locals.authUserId = sub;
    }
    catch {
        /* expired / invalid — feed falls back to public ranking */
    }
    next();
}
//# sourceMappingURL=optional-auth.js.map