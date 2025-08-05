import * as adminService from '../services/admin.service.js';

/**
 * Admin user can updateRole.
 */
export const updateRole = async (req, res, next) => {
    // Implementation placeholder — update this if needed
    try {
        // Example: const result = await adminService.updateRole(req.body);
        res.status(200).json({ message: 'updateRole not implemented yet' });
    } catch (err) {
        next(err);
    }
};

export const createRole = async (req, res, next) => {
    try {
        const { name } = req.body;
        const role = await adminService.createRole(name);
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
