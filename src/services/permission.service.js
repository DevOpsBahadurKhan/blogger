// services/permission.service.js
import permissionRepo from '../repositories/permission.repository.js';
import logger from '../utils/logger.js';

class PermissionService {

    async createSinglePermission({ user, resource, action, possession }) {
        
        try {
            const role_id = user.id;
            // Validate role
            const role = await permissionRepo.findByRoleId(user.id);
            if (!role) {
                logger.warn(`Role not found for role_id=${role_id}`);
                throw new Error('Role not found');
            }

            // Validate permission fields
            if (!resource || !action || !possession) {
                logger.error(`Missing fields for role_id=${role_id}`, { resource, action, possession });
                throw new Error('resource, action, and possession are required');
            }

            // Create permission & link to role
            const permission = await permissionRepo.createPermission({ resource, action, possession });
            await role.addPermission(permission);

            logger.info(`Single permission created successfully for role_id=${role_id}`, { permissionId: permission.id });
            return permission;

        } catch (error) {
            logger.error(`Error creating single permission for role_id=${role_id}: ${error.message}`, { stack: error.stack });
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
