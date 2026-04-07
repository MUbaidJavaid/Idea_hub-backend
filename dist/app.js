import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import mongoose from 'mongoose';
import { httpLogger } from './lib/logger.js';
import { globalApiLimiter } from './middleware/api-rate-limit.js';
import { errorHandler } from './middleware/error-handler.js';
import { requestTimeout } from './middleware/request-timeout.js';
import { adminRouter } from './routes/admin.js';
import { authRouter } from './routes/auth.js';
import { behaviorRouter } from './routes/behavior.js';
import { ideasRouter } from './routes/ideas.js';
import { uploadRouter } from './routes/upload.js';
import { usersRouter } from './routes/users.js';
import { progressRouter } from './routes/progress.js';
import { marketplaceRouter } from './routes/marketplace.js';
import { liveRoomsRouter } from './routes/live-rooms.js';
import { aiCoachRouter } from './routes/ai-coach.js';
import { collectionsRouter } from './routes/collections.js';
import { stripeWebhookRoute } from './routes/stripe-webhook.js';
import { subscriptionsRouter } from './routes/subscriptions.js';
const defaultDevOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
];
function resolveCorsOrigin() {
    const front = process.env.FRONTEND_URL?.trim();
    if (front)
        return front;
    const raw = process.env.CORS_ORIGIN?.trim();
    if (raw) {
        const list = raw.split(',').map((s) => s.trim()).filter(Boolean);
        if (list.length > 0)
            return list;
    }
    if (process.env.NODE_ENV !== 'production') {
        return defaultDevOrigins;
    }
    return true;
}
const corsOptions = {
    origin: resolveCorsOrigin(),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
export function createApp() {
    const app = express();
    /** JSON responses default to ETag → browsers send If-None-Match → 304 with empty body breaks axios clients. */
    app.set('etag', false);
    if (process.env.NODE_ENV === 'production') {
        app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS) || 1);
    }
    /** Cast avoids duplicate @types/express-serve-static-core (e.g. under @types/compression) breaking app.use overloads on CI. */
    const compressMiddleware = compression({
        level: 6,
        threshold: 2048,
        filter: (req, res) => {
            if (req.headers['x-no-compression'])
                return false;
            return compression.filter(req, res);
        },
    });
    app.use(compressMiddleware);
    app.use(helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));
    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions));
    app.use(httpLogger);
    app.post('/api/subscriptions/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
        void stripeWebhookRoute(req, res).catch(next);
    });
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(mongoSanitize({ replaceWith: '_' }));
    app.use(globalApiLimiter);
    app.use(requestTimeout(Number(process.env.REQUEST_TIMEOUT_MS) || 30_000));
    app.get('/health', (_req, res) => {
        res.json({
            ok: true,
            mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        });
    });
    app.use('/api/auth', authRouter);
    app.use('/api/users', usersRouter);
    app.use('/api/ideas', ideasRouter);
    app.use('/api/collections', collectionsRouter);
    app.use('/api/subscriptions', subscriptionsRouter);
    app.use('/api/upload', uploadRouter);
    app.use('/api/admin', adminRouter);
    app.use('/api/behavior', behaviorRouter);
    app.use('/api/progress', progressRouter);
    app.use('/api/marketplace', marketplaceRouter);
    app.use('/api/live-rooms', liveRoomsRouter);
    app.use('/api/coach', aiCoachRouter);
    app.use((_req, res) => {
        res.status(404).json({
            success: false,
            message: 'Route not found',
            data: null,
            errors: [],
        });
    });
    app.use(errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map