import type { NextFunction, Request, Response } from 'express';
/** Sets `res.locals.authUserId` when a valid Bearer access token is present; otherwise continues anonymously. */
export declare function optionalAuth(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=optional-auth.d.ts.map