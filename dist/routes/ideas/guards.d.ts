import type { NextFunction, Request, Response } from 'express';
export declare function requireDb(_req: Request, res: Response, next: NextFunction): void;
export declare function publicFeedFilter(): Record<string, unknown>;
export declare function escapeRegex(s: string): string;
//# sourceMappingURL=guards.d.ts.map