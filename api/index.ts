/**
 * Vercel serverless entry.
 * Runtime expects: export default function (req, res) { app(req, res) }
 * Env vars come from Vercel dashboard — no dotenv here (avoids missing-package crash).
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createApp } from '../src/app.js';
import { markRuntimeStarted } from '../src/lib/runtime-state.js';

markRuntimeStarted('vercel');

let app: ReturnType<typeof createApp> | null = null;
let bootstrapError: unknown = null;

try {
  app = createApp();
} catch (err) {
  bootstrapError = err;
  console.error('[vercel] createApp failed at module load', err);
}

export default function handler(
  req: IncomingMessage,
  res: ServerResponse
): void {
  if (!app) {
    const detail =
      bootstrapError instanceof Error
        ? bootstrapError.message
        : String(bootstrapError ?? 'unknown');
    console.error('[vercel] handler called but app not initialized:', detail);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('content-type', 'application/json; charset=utf-8');
      res.end(
        JSON.stringify({
          success: false,
          message: 'API failed to start',
          code: 'BOOTSTRAP_ERROR',
          detail,
          data: null,
          errors: [],
        })
      );
    }
    return;
  }
  app(req, res);
}
