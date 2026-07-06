/**
 * Vercel serverless entry (zero-config Express).
 * Local long-running server: npm run dev / npm start → src/server.ts
 */
import 'dotenv/config';

import express, { type Express } from 'express';

import { markRuntimeStarted } from './lib/runtime-state.js';

markRuntimeStarted('vercel');

function bootstrapFailureApp(err: unknown): Express {
  const app = express();
  console.error('[api] createApp failed during bootstrap', err);
  app.all('*', (_req, res) => {
    res.status(500).json({
      success: false,
      message: 'API initialization failed',
      code: 'BOOTSTRAP_ERROR',
      data: null,
      errors: [],
    });
  });
  return app;
}

let app: Express;
try {
  const { createApp } = await import('./app.js');
  app = createApp();
} catch (err) {
  app = bootstrapFailureApp(err);
}

export default app;
