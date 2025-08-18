import db from '../models/index.js';
const { User, Role, Permission } = db;

class AdminRepository {
    async assignRoleToUser(userId, roleId) {
        const user = await User.findByPk(userId);
        if (!user) {
            const err = new Error('User not found');
            err.statusCode = 404;
            throw err;
        }

        const role = await Role.findByPk(roleId);
        if (!role) {
            const err = new Error('Role not found');
            err.statusCode = 404;
            throw err;
        }

        user.role_id = roleId; // snake_case because DB column
        await user.save();

        return user;
    }

    async checkPermissionExists(permissionId) {
        return await Permission.findByPk(permissionId);
    }

    async checkRoleExists(roleId) {
        return await Role.findByPk(roleId);
    }
}

export default new AdminRepository();
