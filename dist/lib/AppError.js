/** Operational errors mapped to HTTP responses (never leak stack to client). */
export class AppError extends Error {
    statusCode;
    code;
    isOperational = true;
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.code = code;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export function isAppError(err) {
    return err instanceof AppError;
}
//# sourceMappingURL=AppError.js.map