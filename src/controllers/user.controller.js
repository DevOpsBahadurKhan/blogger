import userService from '../services/user.service.js';
import logger from '../utils/logger.js';

// Get all users
export const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const users = await userService.getAllUsers({ page, limit, search });

        logger.info('[UserController] All users retrieved', {
            count: users.length,
            requestedBy: req.user?.id
        });

        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: users
        });
    } catch (error) {
        logger.error('[UserController] Error getting all users', {
            error: error.message,
            stack: error.stack,
            requestedBy: req.user?.id
        });
        next(error);
    }
};

// Get user by ID
export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        logger.info('[UserController] User retrieved by ID', {
            userId: id,
            requestedBy: req.user?.id
        });

        res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data: user
        });
    } catch (error) {
        logger.error('[UserController] Error getting user by ID', {
            error: error.message,
            stack: error.stack,
            userId: req.params.id,
            requestedBy: req.user?.id
        });
        next(error);
    }
};

// Update user
export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const user = await userService.updateUser(id, updateData);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        logger.info('[UserController] User updated', {
            userId: id,
            updatedBy: req.user?.id
        });

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        logger.error('[UserController] Error updating user', {
            error: error.message,
            stack: error.stack,
            userId: req.params.id,
            updatedBy: req.user?.id
        });
        next(error);
    }
};

// Delete user
export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await userService.deleteUser(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        logger.info('[UserController] User deleted', {
            userId: id,
            deletedBy: req.user?.id
        });

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        logger.error('[UserController] Error deleting user', {
            error: error.message,
            stack: error.stack,
            userId: req.params.id,
            deletedBy: req.user?.id
        });
        next(error);
    }
};

// Assign role to user
export const assignRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { roleId } = req.body;

        const result = await userService.assignRole(id, roleId);

        logger.info('[UserController] Role assigned to user', {
            userId: id,
            roleId,
            assignedBy: req.user?.id
        });

        res.status(200).json({
            success: true,
            message: 'Role assigned successfully',
            data: result
        });
    } catch (error) {
        logger.error('[UserController] Error assigning role', {
            error: error.message,
            stack: error.stack,
            userId: req.params.id,
            assignedBy: req.user?.id
        });
        next(error);
    }
};

// Get user role
export const getUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const roles = await userService.getUserRoles(id);

        logger.info('[UserController] User roles retrieved', {
            userId: id,
            requestedBy: req.user?.id
        });

        res.status(200).json({
            success: true,
            message: 'User roles retrieved successfully',
            data: roles
        });
    } catch (error) {
        logger.error('[UserController] Error getting user roles', {
            error: error.message,
            stack: error.stack,
            userId: req.params.id,
            requestedBy: req.user?.id
        });
        next(error);
    }
};

// Get user permissions
export const getUserPermissions = async (req, res, next) => {
    try {
        const { id } = req.params;
        const permissions = await userService.getUserPermissions(id);

        logger.info('[UserController] User permissions retrieved', {
            userId: id,
            requestedBy: req.user?.id
        });

        res.status(200).json({
            success: true,
            message: 'User permissions retrieved successfully',
            data: permissions
        });
    } catch (error) {
        logger.error('[UserController] Error getting user permissions', {
            error: error.message,
            stack: error.stack,
            userId: req.params.id,
            requestedBy: req.user?.id
        });
        next(error);
    }
};

export const getProfile = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await userService.getProfile(userId);

        logger.info('[UserController] User profile retrieved', {
            userId,
            requestedBy: req.user?.id
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        logger.error('[UserController] Error getting user profile', {
            error: error.message,
            stack: error.stack,
            userId: req.params.id,
            requestedBy: req.user?.id
        });
        next(error);
    }
};

export const me = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await userService.me(userId);

        logger.info('[UserController] Current user profile retrieved', {
            userId,
            requestedBy: req.user?.id
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        logger.error('[UserController] Error getting current user profile', {
            error: error.message,
            stack: error.stack,
            userId: req.user?.id
        });
        next(error);
    }
};
