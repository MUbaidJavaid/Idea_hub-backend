import { handleStripeWebhookRaw } from '../services/stripe-billing.service.js';
export async function stripeWebhookRoute(req, res) {
    const sig = req.headers['stripe-signature'];
    const raw = req.body;
    if (!Buffer.isBuffer(raw)) {
        res.status(400).send('Expected raw body');
        return;
    }
    const result = await handleStripeWebhookRaw(raw, typeof sig === 'string' ? sig : undefined);
    if ('error' in result && result.error) {
        res.status(400).send(result.error);
        return;
    }
    res.json({ received: true });
}
//# sourceMappingURL=stripe-webhook.js.map