/**
 * Vercel HTTP entry — bundles from `src/` (do not import `dist/`; paths break in lambdas).
 */
import 'dotenv/config';

import express, { type Express } from 'express';

import { createApp } from '../src/app.js';
import { markRuntimeStarted } from '../src/lib/runtime-state.js';

markRuntimeStarted('vercel');

function bootstrapFailureApp(err: unknown): Express {
  const fallback = express();
  console.error('[vercel] createApp failed during bootstrap', err);
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
