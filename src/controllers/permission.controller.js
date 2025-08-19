// blogger\src\controllers\permission.controller.js

import permissionService from '../services/permission.service.js';
import logger from '../utils/logger.js';

// Create Permission
export const createPermission = async (req, res, next) => {
    try {
        const permission = await permissionService.createSinglePermission(req.body);
        
        logger.info('[PermissionController] Permission created', {
            permissionId: permission.id,
            name: permission.name,
            userId: req.user?.id
        });
        
        res.status(201).json({
            success: true,
            message: 'Permission created successfully',
            data: permission
        });
    } catch (err) {
        logger.error('[PermissionController] Error creating permission', {
            error: err.message,
            stack: err.stack,
            userId: req.user?.id
        });
        next(err);
    }
};

// Get All Permissions
export const getAllPermissions = async (req, res, next) => {
    try {
        const permissions = await permissionService.getAllPermissions();
        
        res.status(200).json({
            success: true,
            message: 'Permissions retrieved successfully',
            data: permissions
        });
    } catch (err) {
        logger.error('[PermissionController] Error getting permissions', {
            error: err.message,
            stack: err.stack,
            userId: req.user?.id
        });
        next(err);
    }
};

// Get Permission by ID
export const getPermissionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const permission = await permissionService.getPermissionById(id);
        
        if (!permission) {
            return res.status(404).json({
                success: false,
                message: 'Permission not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Permission retrieved successfully',
            data: permission
        });
    } catch (err) {
        logger.error('[PermissionController] Error getting permission by ID', {
            error: err.message,
            stack: err.stack,
            permissionId: req.params.id,
            userId: req.user?.id
        });
        next(err);
    }
};

// Update Permission
export const updatePermission = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const permission = await permissionService.updatePermission(id, updateData);
        
        if (!permission) {
            return res.status(404).json({
                success: false,
                message: 'Permission not found'
            });
        }
        
        logger.info('[PermissionController] Permission updated', {
            permissionId: id,
            userId: req.user?.id
        });
        
        res.status(200).json({
            success: true,
            message: 'Permission updated successfully',
            data: permission
        });
    } catch (err) {
        logger.error('[PermissionController] Error updating permission', {
            error: err.message,
            stack: err.stack,
            permissionId: req.params.id,
            userId: req.user?.id
        });
        next(err);
    }
};

// Delete Permission
export const deletePermission = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await permissionService.deletePermission(id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Permission not found'
            });
        }
        
        logger.info('[PermissionController] Permission deleted', {
            permissionId: id,
            userId: req.user?.id
        });
        
        res.status(200).json({
            success: true,
            message: 'Permission deleted successfully'
        });
    } catch (err) {
        logger.error('[PermissionController] Error deleting permission', {
            error: err.message,
            stack: err.stack,
            permissionId: req.params.id,
            userId: req.user?.id
        });
        next(err);
    }
};

// Get Permissions by Resource
export const getPermissionsByResource = async (req, res, next) => {
    try {
        const { resource } = req.params;
        const permissions = await permissionService.getPermissionsByResource(resource);
        
        res.status(200).json({
            success: true,
            message: 'Permissions retrieved successfully',
            data: permissions
        });
    } catch (err) {
        logger.error('[PermissionController] Error getting permissions by resource', {
            error: err.message,
            stack: err.stack,
            resource: req.params.resource,
            userId: req.user?.id
        });
        next(err);
    }
};

// Get Permissions by Action
export const getPermissionsByAction = async (req, res, next) => {
    try {
        const { action } = req.params;
        const permissions = await permissionService.getPermissionsByAction(action);
        
        res.status(200).json({
            success: true,
            message: 'Permissions retrieved successfully',
            data: permissions
        });
    } catch (err) {
        logger.error('[PermissionController] Error getting permissions by action', {
            error: err.message,
            stack: err.stack,
            action: req.params.action,
            userId: req.user?.id
        });
        next(err);
    }
};
