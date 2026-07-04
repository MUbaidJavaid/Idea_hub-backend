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
