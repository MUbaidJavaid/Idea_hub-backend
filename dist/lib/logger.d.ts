import type { IncomingMessage, ServerResponse } from 'node:http';
import pino from 'pino';
/** Plain JSON logs on Vercel/production — pino-pretty is dev-only and not bundled on Vercel. */
export declare const logger: pino.Logger<never, boolean>;
/**
 * HTTP request/response logging (method, url, status, duration).
 * Does not log Authorization / Cookie (see serializers).
 */
export declare const httpLogger: import("pino-http").HttpLogger<IncomingMessage, ServerResponse<IncomingMessage>, never>;
/** Safe startup snapshot: booleans only, no secrets. */
export declare function logStartupSummary(port: number): void;
//# sourceMappingURL=logger.d.ts.map