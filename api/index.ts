/**
 * Vercel serverless function — routes all HTTP traffic to the Express app.
 */
import 'dotenv/config';
import type { VercelRequest, VercelResponse } from '@vercel/node';

import { createApp } from '../dist/app.js';
import { markRuntimeStarted } from '../dist/lib/runtime-state.js';

markRuntimeStarted('vercel');

const app = createApp();

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
