import db from '../models/index.js';
const { UserRole, User, Role } = db;

class UserRoleRepository {

    async assignRoleToUser(userId, roleId, assignedBy = null, expiresAt = null) {
        return await UserRole.create({
            user_id: userId,
            role_id: roleId,
            assigned_by: assignedBy,
            expires_at: expiresAt,
            is_active: true
        });
    }

    async removeRoleFromUser(userId, roleId) {
        const userRole = await UserRole.findOne({
            where: { user_id: userId, role_id: roleId }
        });
        
        if (userRole) {
            await userRole.destroy();
            return true;
        }
        return false;
    }

    async getUserRoles(userId) {
        return await UserRole.findAll({
            where: { user_id: userId, is_active: true },
            include: [
                {
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'name', 'description']
                }
            ]
        });
    }

    async getRoleUsers(roleId) {
        return await UserRole.findAll({
            where: { role_id: roleId, is_active: true },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username', 'email']
                }
            ]
        });
    }

    async updateUserRole(userId, roleId, updates) {
        const userRole = await UserRole.findOne({
            where: { user_id: userId, role_id: roleId }
        });
        
        if (userRole) {
            await userRole.update(updates);
            return userRole;
        }
        return null;
    }

    async deactivateUserRole(userId, roleId) {
        return await this.updateUserRole(userId, roleId, { is_active: false });
    }

    async activateUserRole(userId, roleId) {
        return await this.updateUserRole(userId, roleId, { is_active: true });
    }

    async getUserActiveRoles(userId) {
        return await UserRole.findAll({
            where: { user_id: userId, is_active: true },
            include: [
                {
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'name', 'description']
                }
            ]
        });
    }

    async checkUserHasRole(userId, roleId) {
        const userRole = await UserRole.findOne({
            where: { user_id: userId, role_id: roleId, is_active: true }
        });
        return !!userRole;
    }

    async getExpiredUserRoles() {
        const now = new Date();
        return await UserRole.findAll({
            where: {
                expires_at: { [db.Sequelize.Op.lt]: now },
                is_active: true
            }
        });
    }

    async deactivateExpiredRoles() {
        const expiredRoles = await this.getExpiredUserRoles();
        for (const userRole of expiredRoles) {
            await userRole.update({ is_active: false });
        }
        return expiredRoles.length;
    }
}

export default new UserRoleRepository();
