import mongoose from 'mongoose';
import { isAppError } from '../lib/AppError.js';
import { logger } from '../lib/logger.js';
export function errorHandler(err, _req, res, _next) {
    if (res.headersSent) {
        return;
    }
    if (isAppError(err)) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.code,
            data: null,
            errors: [],
        });
        return;
    }
    if (err instanceof mongoose.Error.ValidationError) {
        const first = Object.values(err.errors)[0];
        res.status(400).json({
            success: false,
            message: first?.message ?? 'Validation failed',
            code: 'VALIDATION_ERROR',
            data: null,
            errors: Object.values(err.errors).map((e) => e.message),
        });
        return;
    }
    if (typeof err === 'object' &&
        err !== null &&
        err.code === 'LIMIT_FILE_SIZE') {
        res.status(413).json({
            success: false,
            message: 'File too large',
            code: 'FILE_TOO_LARGE',
            data: null,
            errors: [],
        });
        return;
    }
    if (err instanceof mongoose.Error.CastError) {
        res.status(400).json({
            success: false,
            message: 'Invalid identifier',
            code: 'CAST_ERROR',
            data: null,
            errors: [],
        });
        return;
    }
    logger.error({ err }, 'Unhandled route error');
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
        data: null,
        errors: [],
    });
}
//# sourceMappingURL=error-handler.js.map