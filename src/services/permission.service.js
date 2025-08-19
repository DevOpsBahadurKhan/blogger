// services/permission.service.js
import permissionRepo from '../repositories/permission.repository.js';
import logger from '../utils/logger.js';

class PermissionService {

    async createSinglePermission(data) {
        try {
            const { resource, action, possession } = data;

            // 1️⃣ Check if permission already exists
            const existingPermission = await permissionRepo.findByFields({
                resource,
                action,
                possession
            });

            if (existingPermission) {
                let err = new Error('Permission already exists');
                err.statusCode = 409;
                logger.warn(`Permission already exists`, { permissionId: existingPermission.id });
                throw err;   
            }

            // 2️⃣ Create only the permission, no role logic here
            const permission = await permissionRepo.createPermission({ resource, action, possession });

            logger.info(`Permission created successfully`, { permissionId: permission.id });
            return permission;

        } catch (error) {
            logger.error(`Error creating permission: ${error.message}`, { stack: error.stack });
            throw error;
        }
    }


    async getAllPermissions() {
        try {
            const permissions = await permissionRepo.getAllPermissions();
            logger.info('Retrieved all permissions', { count: permissions.length });
            return permissions;
        } catch (error) {
            logger.error(`Error getting all permissions: ${error.message}`, { stack: error.stack });
            throw error;
        }
    }

    async getPermissionById(id) {
        try {
            const permission = await permissionRepo.getPermissionById(id);
            if (permission) {
                logger.info('Permission retrieved by ID', { permissionId: id });
            } else {
                logger.warn('Permission not found', { permissionId: id });
            }
            return permission;
        } catch (error) {
            logger.error(`Error getting permission by ID: ${error.message}`, { permissionId: id, stack: error.stack });
            throw error;
        }
    }

    async updatePermission(id, updateData) {
        try {
            const permission = await permissionRepo.updatePermission(id, updateData);
            if (permission) {
                logger.info('Permission updated', { permissionId: id });
            } else {
                logger.warn('Permission not found for update', { permissionId: id });
            }
            return permission;
        } catch (error) {
            logger.error(`Error updating permission: ${error.message}`, { permissionId: id, stack: error.stack });
            throw error;
        }
    }

    async deletePermission(id) {
        try {
            const deleted = await permissionRepo.deletePermission(id);
            if (deleted) {
                logger.info('Permission deleted', { permissionId: id });
            } else {
                logger.warn('Permission not found for deletion', { permissionId: id });
            }
            return deleted;
        } catch (error) {
            logger.error(`Error deleting permission: ${error.message}`, { permissionId: id, stack: error.stack });
            throw error;
        }
    }

    async getPermissionsByResource(resource) {
        try {
            const permissions = await permissionRepo.getPermissionsByResource(resource);
            logger.info('Retrieved permissions by resource', { resource, count: permissions.length });
            return permissions;
        } catch (error) {
            logger.error(`Error getting permissions by resource: ${error.message}`, { resource, stack: error.stack });
            throw error;
        }
    }

    async getPermissionsByAction(action) {
        try {
            const permissions = await permissionRepo.getPermissionsByAction(action);
            logger.info('Retrieved permissions by action', { action, count: permissions.length });
            return permissions;
        } catch (error) {
            logger.error(`Error getting permissions by action: ${error.message}`, { action, stack: error.stack });
            throw error;
        }
    }

    async createMultiplePermissions({ role_id, permissions }) {
        logger.info(`Creating multiple permissions for role_id=${role_id}, count=${permissions?.length || 0}`);

        try {
            // Validate role
            const role = await permissionRepo.findByRoleId(role_id);
            if (!role) {
                logger.warn(`Role not found for role_id=${role_id}`);
                throw new Error('Role not found');
            }

            // Validate array
            if (!Array.isArray(permissions) || permissions.length === 0) {
                logger.error(`Invalid permissions array for role_id=${role_id}`);
                throw new Error('permissions array is required and must not be empty');
            }

            // Create all permissions at once
            const createdPermissions = await permissionRepo.createPermissions(permissions);
            await role.addPermissions(createdPermissions);

            logger.info(`Multiple permissions created successfully for role_id=${role_id}`, {
                createdIds: createdPermissions.map(p => p.id)
            });
            return createdPermissions;

        } catch (error) {
            logger.error(`Error creating multiple permissions for role_id=${role_id}: ${error.message}`, { stack: error.stack });
            throw error;
        }
    }
}

export default new PermissionService();
