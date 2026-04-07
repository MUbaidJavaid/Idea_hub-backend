/** Operational errors mapped to HTTP responses (never leak stack to client). */
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly code: string;
    readonly isOperational = true;
    constructor(message: string, statusCode?: number, code?: string);
}
export declare function isAppError(err: unknown): err is AppError;
//# sourceMappingURL=AppError.d.ts.map