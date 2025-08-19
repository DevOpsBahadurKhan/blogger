// src/middlewares/errorHandler.js
import logger from '../utils/logger.js';

export default (error, req, res, next) => {
    // Centralized error logging
    try {
        logger.error('[GlobalErrorHandler] Unhandled error', {
            path: req.originalUrl,
            method: req.method,
            statusCode: error.statusCode || 500,
            message: error.message,
            stack: error.stack,
            userId: req.user?.id,
        });
    } catch (_) {
        // no-op: ensure handler never throws
    }

    res.status(error.statusCode || 500).json({
        message: error.message || 'Internal Server Error',
        data: error.data || null,
        validation: error.validation || null
    });
};
