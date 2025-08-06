import db from '../models/index.js';
const { User, Role, Permission } = db;

class AdminRepository {


    async assignRoleToUser(userId, roleId) {
        const user = await User.findByPk(userId);
        const role = await Role.findByPk(roleId);

        if (!user || !role) throw new Error('Invalid user or role');

        user.role_id = roleId;
        await user.save();

        return user;
    }

    // Create a new role
    async createRole(name) {
        return await Role.create({ name });
    }

    // Create a new permission
    async createPermission({ role_id, resource, action, possession }) {
        const permission = await Permission.create({ resource, action, possession });

        const role = await Role.findByPk(role_id);
        if (!role) throw new Error('Role not found');

        await role.addPermission(permission); // create entry in role_permissions

        return permission;
    }


    // Find role by ID
    async findRoleById(id) {
        return await Role.findByPk(id);
    }

    // Find role by name
    async findRoleByName(name) {
        return await Role.findOne({ where: { name } });
    }

    // Update role by ID
    async updateRole(id, data) {
        await Role.update(data, { where: { id } });
        return await Role.findByPk(id); // return updated role
    }
}

export default new AdminRepository();
