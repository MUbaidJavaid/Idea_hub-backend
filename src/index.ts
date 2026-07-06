/**
 * Vercel serverless entry (zero-config Express).
 * Local long-running server: npm run dev / npm start → src/server.ts
 */
import 'dotenv/config';

import express, { type Express } from 'express';

import { createApp } from './app.js';
import { markRuntimeStarted } from './lib/runtime-state.js';

markRuntimeStarted('vercel');

function bootstrapFailureApp(err: unknown): Express {
  const fallback = express();
  console.error('[api] createApp failed during bootstrap', err);
  fallback.all('*', (_req, res) => {
    res.status(500).json({
      success: false,
      message: 'API initialization failed',
      code: 'BOOTSTRAP_ERROR',
      data: null,
      errors: [],
    });
  });
  return fallback;
}

const app: Express = (() => {
  try {
    return createApp();
  } catch (err) {
    return bootstrapFailureApp(err);
  }
})();

export default app;
