import type { NextFunction, Request, Response } from 'express';
/**
 * After `requireAuth`: ensures user is moderator or super_admin.
 */
export declare function requireStaff(_req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=require-staff.d.ts.map