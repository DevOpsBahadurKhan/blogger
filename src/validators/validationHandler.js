//BlogBuddy/src/validators/validationHandler.js


import { validationResult } from 'express-validator';

export default function validateRequest(req) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.validation = validationErrors.array();
        throw error;
    }
}
