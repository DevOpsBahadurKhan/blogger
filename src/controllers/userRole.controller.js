import userRoleService from '../services/userRole.service.js';

// Assign role to user
export const assignRoleToUser = async (req, res, next) => {
    try {
        const { userId, roleId } = req.params;
        const { expiresAt } = req.body;
        const assignedBy = req.user?.id; // Current authenticated user

        const userRole = await userRoleService.assignRoleToUser(
            parseInt(userId),
            parseInt(roleId),
            assignedBy,
            expiresAt
        );

        res.status(201).json({
            success: true,
            message: 'Role assigned to user successfully',
            data: userRole
        });
    } catch (err) {
        next(err);
    }
};

// Remove role from user
export const removeRoleFromUser = async (req, res, next) => {
    try {
        const { userId, roleId } = req.params;

        const removed = await userRoleService.removeRoleFromUser(
            parseInt(userId),
            parseInt(roleId)
        );

        if (!removed) {
            return res.status(404).json({
                success: false,
                message: 'User-role relationship not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Role removed from user successfully'
        });
    } catch (err) {
        next(err);
    }
};

// Get user roles
export const getUserRoles = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const userRoles = await userRoleService.getUserRoles(parseInt(userId));

        res.status(200).json({
            success: true,
            message: 'User roles retrieved successfully',
            data: userRoles
        });
    } catch (err) {
        next(err);
    }
};

// Get role users
export const getRoleUsers = async (req, res, next) => {
    try {
        const { roleId } = req.params;

        const roleUsers = await userRoleService.getRoleUsers(parseInt(roleId));

        res.status(200).json({
            success: true,
            message: 'Role users retrieved successfully',
            data: roleUsers
        });
    } catch (err) {
        next(err);
    }
};

// Update user role
export const updateUserRole = async (req, res, next) => {
    try {
        const { userId, roleId } = req.params;
        const updates = req.body;

        const updatedUserRole = await userRoleService.updateUserRole(
            parseInt(userId),
            parseInt(roleId),
            updates
        );

        if (!updatedUserRole) {
            return res.status(404).json({
                success: false,
                message: 'User-role relationship not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User role updated successfully',
            data: updatedUserRole
        });
    } catch (err) {
        next(err);
    }
};

// Deactivate user role
export const deactivateUserRole = async (req, res, next) => {
    try {
        const { userId, roleId } = req.params;

        const deactivated = await userRoleService.deactivateUserRole(
            parseInt(userId),
            parseInt(roleId)
        );

        if (!deactivated) {
            return res.status(404).json({
                success: false,
                message: 'User-role relationship not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User role deactivated successfully'
        });
    } catch (err) {
        next(err);
    }
};

// Activate user role
export const activateUserRole = async (req, res, next) => {
    try {
        const { userId, roleId } = req.params;

        const activated = await userRoleService.activateUserRole(
            parseInt(userId),
            parseInt(roleId)
        );

        if (!activated) {
            return res.status(404).json({
                success: false,
                message: 'User-role relationship not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User role activated successfully'
        });
    } catch (err) {
        next(err);
    }
};

// Get user roles with permissions
export const getUserRolesWithPermissions = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const rolesWithPermissions = await userRoleService.getUserRolesWithPermissions(
            parseInt(userId)
        );

        res.status(200).json({
            success: true,
            message: 'User roles with permissions retrieved successfully',
            data: rolesWithPermissions
        });
    } catch (err) {
        next(err);
    }
};

// Bulk assign roles to user
export const bulkAssignRoles = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { roleIds } = req.body;
        const assignedBy = req.user?.id;

        if (!Array.isArray(roleIds) || roleIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'roleIds must be a non-empty array'
            });
        }

        const results = await userRoleService.bulkAssignRoles(
            parseInt(userId),
            roleIds,
            assignedBy
        );

        res.status(200).json({
            success: true,
            message: 'Bulk role assignment completed',
            data: results
        });
    } catch (err) {
        next(err);
    }
};

// Bulk remove roles from user
export const bulkRemoveRoles = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { roleIds } = req.body;

        if (!Array.isArray(roleIds) || roleIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'roleIds must be a non-empty array'
            });
        }

        const results = await userRoleService.bulkRemoveRoles(
            parseInt(userId),
            roleIds
        );

        res.status(200).json({
            success: true,
            message: 'Bulk role removal completed',
            data: results
        });
    } catch (err) {
        next(err);
    }
};

// Check if user has specific role
export const checkUserHasRole = async (req, res, next) => {
    try {
        const { userId, roleId } = req.params;

        const hasRole = await userRoleService.checkUserHasRole(
            parseInt(userId),
            parseInt(roleId)
        );

        res.status(200).json({
            success: true,
            message: 'Role check completed',
            data: { hasRole }
        });
    } catch (err) {
        next(err);
    }
};
