import jwt from 'jsonwebtoken';
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES?.trim() || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES?.trim() || '7d';
function secrets() {
    const access = process.env.JWT_ACCESS_SECRET ||
        (process.env.NODE_ENV !== 'production' ? 'dev-ideahub-access-secret' : '');
    const refresh = process.env.JWT_REFRESH_SECRET ||
        (process.env.NODE_ENV !== 'production' ? 'dev-ideahub-refresh-secret' : '');
    if (!access || !refresh) {
        throw new Error('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET are required in production');
    }
    return { access, refresh };
}
export function signAccessToken(userId) {
    const { access } = secrets();
    const opts = {
        expiresIn: ACCESS_EXPIRES,
    };
    return jwt.sign({ sub: userId, kind: 'access' }, access, opts);
}
export function signRefreshToken(userId) {
    const { refresh } = secrets();
    const opts = {
        expiresIn: REFRESH_EXPIRES,
    };
    return jwt.sign({ sub: userId, kind: 'refresh' }, refresh, opts);
}
export function verifyAccessToken(token) {
    const { access } = secrets();
    const payload = jwt.verify(token, access);
    if (payload.kind !== 'access' || typeof payload.sub !== 'string') {
        throw new Error('Invalid access token');
    }
    return { sub: payload.sub };
}
export function verifyRefreshToken(token) {
    const { refresh } = secrets();
    const payload = jwt.verify(token, refresh);
    if (payload.kind !== 'refresh' || typeof payload.sub !== 'string') {
        throw new Error('Invalid refresh token');
    }
    return { sub: payload.sub };
}
export function signTokenPair(userId) {
    return {
        accessToken: signAccessToken(userId),
        refreshToken: signRefreshToken(userId),
    };
}
//# sourceMappingURL=jwt.js.map