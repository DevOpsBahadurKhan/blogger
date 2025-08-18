// blogger\src\controllers\role.controller.js

import roleService from '../services/role.service.js';

// Create Role
export const createRole = async (req, res, next) => {
    try {
        const role = await roleService.createRole(req.body.name, req.body.description);
        res.status(201).json({
            success: true,
            message: 'Role created successfully',
            data: role
        });
    } catch (err) {
        next(err);
    }
};

// Get All Roles
export const getAllRoles = async (req, res, next) => {
    try {
        const roles = await roleService.getAllRoles();
        res.status(200).json({
            success: true,
            message: 'Roles retrieved successfully',
            data: roles
        });
    } catch (err) {
        next(err);
    }
};

// Get Role by ID
export const getRoleById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const role = await roleService.getRoleById(id);

        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Role retrieved successfully',
            data: role
        });
    } catch (err) {
        next(err);
    }
};

// Update Role
export const updateRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const updatedRole = await roleService.updateRole(id, { name, description });

        if (!updatedRole) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Role updated successfully',
            data: updatedRole
        });
    } catch (err) {
        next(err);
    }
};

// Delete Role
export const deleteRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await roleService.deleteRole(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Role deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};

// Get Role Permissions
export const getRolePermissions = async (req, res, next) => {
    try {
        const { id } = req.params;
        const permissions = await roleService.getRolePermissions(id);

        res.status(200).json({
            success: true,
            message: 'Role permissions retrieved successfully',
            data: permissions
        });
    } catch (err) {
        next(err);
    }
};

// Get Role Users
export const getRoleUsers = async (req, res, next) => {
    try {
        const { id } = req.params;
        const users = await roleService.getRoleUsers(id);

        res.status(200).json({
            success: true,
            message: 'Role users retrieved successfully',
            data: users
        });
    } catch (err) {
        next(err);
    }
};
