import type { RequestHandler } from 'express';
/** Lazy init — avoids module-load failures in serverless bundles. */
export declare function getGlobalApiLimiter(): RequestHandler;
export declare function getStrictWriteLimiter(): RequestHandler;
//# sourceMappingURL=api-rate-limit.d.ts.map