import userRoleRepo from '../repositories/userRole.repository.js';
import userRepo from '../repositories/user.repository.js';
import roleRepo from '../repositories/role.repository.js';

class UserRoleService {

    async assignRoleToUser(userId, roleId, assignedBy = null, expiresAt = null) {
        // Validate user exists
        const user = await userRepo.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Validate role exists
        const role = await roleRepo.findById(roleId);
        if (!role) {
            throw new Error('Role not found');
        }

        // Check if user already has this role
        const existingUserRole = await userRoleRepo.checkUserHasRole(userId, roleId);
        if (existingUserRole) {
            throw new Error('User already has this role');
        }

        return await userRoleRepo.assignRoleToUser(userId, roleId, assignedBy, expiresAt);
    }

    async removeRoleFromUser(userId, roleId) {
        // Validate user exists
        const user = await userRepo.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Validate role exists
        const role = await roleRepo.findById(roleId);
        if (!role) {
            throw new Error('Role not found');
        }

        return await userRoleRepo.removeRoleFromUser(userId, roleId);
    }

    async getUserRoles(userId) {
        // Validate user exists
        const user = await userRepo.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        return await userRoleRepo.getUserRoles(userId);
    }

    async getRoleUsers(roleId) {
        // Validate role exists
        const role = await roleRepo.findById(roleId);
        if (!role) {
            throw new Error('Role not found');
        }

        return await userRoleRepo.getRoleUsers(roleId);
    }

    async updateUserRole(userId, roleId, updates) {
        // Validate user exists
        const user = await userRepo.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Validate role exists
        const role = await roleRepo.findById(roleId);
        if (!role) {
            throw new Error('Role not found');
        }

        return await userRoleRepo.updateUserRole(userId, roleId, updates);
    }

    async deactivateUserRole(userId, roleId) {
        return await this.updateUserRole(userId, roleId, { is_active: false });
    }

    async activateUserRole(userId, roleId) {
        return await this.updateUserRole(userId, roleId, { is_active: true });
    }

    async getUserActiveRoles(userId) {
        // Validate user exists
        const user = await userRepo.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        return await userRoleRepo.getUserActiveRoles(userId);
    }

    async checkUserHasRole(userId, roleId) {
        return await userRoleRepo.checkUserHasRole(userId, roleId);
    }

    async getUserRolesWithPermissions(userId) {
        const userRoles = await this.getUserRoles(userId);
        
        // For each role, get its permissions
        const rolesWithPermissions = await Promise.all(
            userRoles.map(async (userRole) => {
                const role = userRole.role;
                const permissions = await roleRepo.getRolePermissions(role.id);
                return {
                    ...role.toJSON(),
                    permissions: permissions
                };
            })
        );

        return rolesWithPermissions;
    }

    async deactivateExpiredRoles() {
        return await userRoleRepo.deactivateExpiredRoles();
    }

    async bulkAssignRoles(userId, roleIds, assignedBy = null) {
        const results = [];
        
        for (const roleId of roleIds) {
            try {
                const userRole = await this.assignRoleToUser(userId, roleId, assignedBy);
                results.push({ roleId, success: true, data: userRole });
            } catch (error) {
                results.push({ roleId, success: false, error: error.message });
            }
        }

        return results;
    }

    async bulkRemoveRoles(userId, roleIds) {
        const results = [];
        
        for (const roleId of roleIds) {
            try {
                const removed = await this.removeRoleFromUser(userId, roleId);
                results.push({ roleId, success: true, removed });
            } catch (error) {
                results.push({ roleId, success: false, error: error.message });
            }
        }

        return results;
    }
}

export default new UserRoleService();
