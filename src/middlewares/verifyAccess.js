import logger from '../utils/logger.js';

export default function verifyAccess(action, resource, possession = 'any') {
    return async (req, res, next) => {
        try {
            const role = req.user?.role; // Role name string, e.g. 'admin'
            if (!role) {
                return res.status(403).json({ message: 'Missing role' });
            }

            // Casbin expects: (subject, object, action, possession)
            const allowed = await global.ac.enforce(role, resource, action, possession);

            if (!allowed) {
                logger.warn('[AccessControl] Access denied', {
                    role,
                    resource,
                    action,
                    possession,
                    user_id: req.user?.id,
                    ip: req.ip,
                    path: req.originalUrl,
                    method: req.method,
                });
                return res.status(403).json({ message: 'Access Denied' });
            }

            req.permission = { granted: true };
            next();
        } catch (err) {
            logger.error('[AccessControl] Error checking permission', {
                error: err.message,
                stack: err.stack,
                role: req.user?.role,
                resource,
                action,
                possession,
                user_id: req.user?.id,
                ip: req.ip,
                path: req.originalUrl,
                method: req.method,
            });
            next(err);
        }
    };
}
