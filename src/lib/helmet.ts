<<<<<<< HEAD
import { createRequire } from 'node:module';

import type { RequestHandler } from 'express';

const require = createRequire(import.meta.url);

const fallbackHeaders: RequestHandler = (_req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
};

let cached: RequestHandler | null = null;

function loadHelmetFactory(): ((options?: object) => RequestHandler) | null {
  let mod: unknown;
  try {
    mod = require('helmet');
  } catch {
    return null;
  }

  if (typeof mod === 'function') {
    return mod as (options?: object) => RequestHandler;
  }

  if (typeof mod === 'object' && mod !== null && 'default' in mod) {
    const inner = (mod as { default: unknown }).default;
    if (typeof inner === 'function') {
      return inner as (options?: object) => RequestHandler;
    }
  }

  return null;
}

/** Lazy — never throws at import time (Vercel bundles helmet differently than local tsc). */
export function getSecurityHeaders(): RequestHandler {
  if (cached) return cached;

  const factory = loadHelmetFactory();
  if (!factory) {
    cached = fallbackHeaders;
    return cached;
  }

  try {
    cached = factory({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }) as RequestHandler;
  } catch {
    cached = fallbackHeaders;
  }

  return cached;
}
=======
import type { RequestHandler } from 'express';
import * as helmetModule from 'helmet';

type HelmetFactory = (options?: {
  crossOriginResourcePolicy?: { policy: 'cross-origin' | 'same-origin' | 'same-site' };
}) => RequestHandler;

/**
 * NodeNext + helmet's `export { helmet as default }` types the import as a
 * non-callable module namespace on some TS versions (e.g. 5.9 on Vercel).
 * Resolve the factory only after runtime typeof checks from `unknown`.
 */
function resolveHelmet(): HelmetFactory {
  const mod: unknown = helmetModule;
  if (typeof mod === 'function') {
    return mod as unknown as HelmetFactory;
  }
  if (typeof mod === 'object' && mod !== null && 'default' in mod) {
    const inner: unknown = (mod as { default: unknown }).default;
    if (typeof inner === 'function') {
      return inner as unknown as HelmetFactory;
    }
  }
  throw new Error('helmet did not export a callable default');
}

export const securityHeaders: RequestHandler = resolveHelmet()({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});
>>>>>>> 5c71605708b9b39af445cd40f6626e131afbec28
