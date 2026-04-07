import type { IncomingMessage, ServerResponse } from 'node:http';
import pino from 'pino';
/** Root logger: JSON in production, pretty in development (stdout). */
export declare const logger: pino.Logger<never, boolean>;
/**
 * HTTP request/response logging (method, url, status, duration).
 * Does not log Authorization / Cookie (see serializers).
 */
export declare const httpLogger: import("pino-http").HttpLogger<IncomingMessage, ServerResponse<IncomingMessage>, never>;
/** Safe startup snapshot: booleans only, no secrets. */
export declare function logStartupSummary(port: number): void;
//# sourceMappingURL=logger.d.ts.map