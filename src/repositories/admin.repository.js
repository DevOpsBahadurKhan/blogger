import db from '../models/index.js';
const { User, Role } = db;

class AdminRepository {

    async assignRoleToUser(userId, roleId) {
        const user = await User.findByPk(userId);
        const role = await Role.findByPk(roleId);

        if (!user || !role) throw new Error('Invalid user or role');

        user.role_id = roleId;
        await user.save();

        return user;
    }


    async assignPermissionToRole() {

    }

    async checkPermissionExists() { return await Permission.findByPk(permissionId); }
    async checkRoleExists() { return await Role.findByPk(role_id); }

}

export default new AdminRepository();
