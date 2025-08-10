import logger from '../utils/logger.js';

export default function verifyAccess(action, resource, possession = 'any') {
    return async (req, res, next) => {
        try {
            const role = req.user?.role; // string name
            if (!role) {
                return res.status(403).json({ message: 'Missing role' });
            }

            const allowed = await global.ac.enforce(role, resource, action, possession);

            if (!allowed) {
                return res.status(403).json({ message: 'Access Denied' });
            }

            req.permission = { granted: true };
            next();
        } catch (err) {
            logger.info('[AccessControl]', {
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
