//BlogBuddy\src\middlewares\verifyAccess.js

import logger from '../utils/logger.js';
import { checkAccess } from '../utils/accessControl.js';

export default function verifyAccess(action, resource, possession = 'any') {
    return async (req, res, next) => {
        try {
            console.log('VerifyAccess - req.user:', req.user); // Debug log
            const role = req.user?.role; // Role name string, e.g. 'admin'
            if (!role) {
                console.log('VerifyAccess - Missing role, user object:', req.user); // Debug log
                return res.status(403).json({ message: 'Missing role' });
            }

            // Get resource object for ABAC evaluation if available
            let resourceObj = null;
            if (req.params.id && resource === 'post') {
                // For post-related actions, try to get the post object
                try {
                    const { Post } = await import('../models/index.js');
                    resourceObj = await Post.findByPk(req.params.id);
                } catch (error) {
                    logger.warn('[AccessControl] Could not load resource for ABAC', { error: error.message });
                }
            }

            // Use enhanced access control (RBAC + ABAC)
            const allowed = await checkAccess(role, resource, action, possession, req.user, resourceObj);

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
                    abac_evaluated: !!resourceObj
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

/**
 * Enhanced middleware for complex ABAC scenarios
 * @param {string} action - Action to verify
 * @param {string} resource - Resource type
 * @param {string} possession - Possession scope
 * @param {Function} resourceLoader - Function to load resource object
 */
export function verifyAccessWithResource(action, resource, possession = 'any', resourceLoader = null) {
    return async (req, res, next) => {
        try {
            const role = req.user?.role;
            if (!role) {
                return res.status(403).json({ message: 'Missing role' });
            }

            // Load resource object using provided loader function
            let resourceObj = null;
            if (resourceLoader && typeof resourceLoader === 'function') {
                try {
                    resourceObj = await resourceLoader(req);
                } catch (error) {
                    logger.warn('[AccessControl] Could not load resource for ABAC', { error: error.message });
                }
            }

            const allowed = await checkAccess(role, resource, action, possession, req.user, resourceObj);

            if (!allowed) {
                logger.warn('[AccessControl] Access denied with resource', {
                    role,
                    resource,
                    action,
                    possession,
                    user_id: req.user?.id,
                    resource_id: resourceObj?.id,
                    ip: req.ip,
                    path: req.originalUrl,
                    method: req.method,
                });
                return res.status(403).json({ message: 'Access Denied' });
            }

            req.permission = { granted: true, resource: resourceObj };
            next();
        } catch (err) {
            logger.error('[AccessControl] Error checking permission with resource', {
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
