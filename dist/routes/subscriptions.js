import { Router } from 'express';
import mongoose from 'mongoose';
import { requireAuth } from '../middleware/require-auth.js';
import { User } from '../models/index.js';
import { createBillingPortalSession, createCheckoutSession, getStripe, } from '../services/stripe-billing.service.js';
export const subscriptionsRouter = Router();
function requireDb(_req, res, next) {
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
subscriptionsRouter.get('/status', requireDb, (_req, res) => {
    const configured = Boolean(getStripe());
    res.json({
        success: true,
        message: 'OK',
        data: {
            stripeConfigured: configured,
        },
    });
});
subscriptionsRouter.post('/checkout', requireDb, requireAuth, async (req, res) => {
    const userId = res.locals.authUserId;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        res.status(401).json({
            success: false,
            message: 'Invalid session',
            data: null,
        });
        return;
    }
    const body = req.body;
    if (body.plan !== 'pro' && body.plan !== 'investor') {
        res.status(400).json({
            success: false,
            message: 'plan must be "pro" or "investor"',
            data: null,
        });
        return;
    }
    const plan = body.plan;
    const interval = body.interval === 'year' ? 'year' : 'month';
    const user = await User.findById(userId).select('email');
    if (!user?.email) {
        res.status(400).json({
            success: false,
            message: 'User email required for checkout',
            data: null,
        });
        return;
    }
    const session = await createCheckoutSession({
        userId,
        email: user.email,
        plan,
        interval,
    });
    if ('error' in session) {
        res.status(400).json({
            success: false,
            message: session.error,
            data: null,
        });
        return;
    }
    res.json({
        success: true,
        message: 'OK',
        data: { url: session.url },
    });
});
subscriptionsRouter.get('/portal', requireDb, requireAuth, async (req, res) => {
    const userId = res.locals.authUserId;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        res.status(401).json({
            success: false,
            message: 'Invalid session',
            data: null,
        });
        return;
    }
    const session = await createBillingPortalSession(userId);
    if ('error' in session) {
        res.status(400).json({
            success: false,
            message: session.error,
            data: null,
        });
        return;
    }
    res.json({
        success: true,
        message: 'OK',
        data: { url: session.url },
    });
});
//# sourceMappingURL=subscriptions.js.map