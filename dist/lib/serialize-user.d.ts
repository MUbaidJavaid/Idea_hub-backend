import type { IUserDocument } from '../models/User.model.js';
/** Public profile responses — email is not exposed. */
export declare function userToApiPublic(user: IUserDocument): Record<string, unknown>;
export declare function userToApi(user: IUserDocument): Record<string, unknown>;
//# sourceMappingURL=serialize-user.d.ts.map