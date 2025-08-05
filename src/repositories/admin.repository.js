import db from '../models/index.js';
const { Role, Permission } = db;

class AdminRepository {
    // Create a new role
    async createRole(name) {
        return await Role.create({ name });
    }

    // Create a new permission
    async createPermission({ role_id, resource, action, possession }) {
        return await Permission.create({ role_id, resource, action, possession });
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
