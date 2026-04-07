import mongoose from 'mongoose';
export function requireDb(_req, res, next) {
    if (mongoose.connection.readyState !== 1) {
        res.status(503).json({
            success: false,
            message: 'Database unavailable',
            data: null,
        });
        return;
    }
    next();
}
export function publicFeedFilter() {
    return { status: 'published', visibility: 'public' };
}
export function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//# sourceMappingURL=guards.js.map