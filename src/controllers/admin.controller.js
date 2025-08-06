import adminService from '../services/admin.service.js';
import logger from '../utils/logger.js';

/**
 * @Admin user can updateRole.
 */
export const updateRole = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { role_id } = req.body;
        const updated = await adminService.updateRole(userId, role_id);
        res.json({ message: 'Role updated', role: updated });
    } catch (err) {
        next(err);
    }
};

export const createRole = async (req, res, next) => {
    try {
        const { name } = req.body;
        const role = await adminService.createRole(name);
        
        logger.info({ message: 'Role created', role });

        res.status(201).json({ message: 'Role created', role });
    } catch (err) {
        next(err);
    }
};

export const createPermission = async (req, res, next) => {
    try {
        const permission = await adminService.createPermission(req.body);
        res.status(201).json({ message: 'Permission created', permission });
    } catch (err) {
        next(err);
    }
};
