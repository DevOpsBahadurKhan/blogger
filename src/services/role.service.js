import roleRepo from '../repositories/role.repository.js';

class RoleService {

    async createRole(name, description) {
        return await roleRepo.createRole(name, description);
    }

    async getAllRoles() {
        return await roleRepo.findAll();
    }

    async getRoleById(id) {
        return await roleRepo.findById(id);
    }

    async updateRole(id, data) {
        const role = await roleRepo.findById(id);
        if (!role) throw new Error('Role not found');

        const exists = await roleRepo.findByName(data.name);
        if (exists && exists.id !== parseInt(id)) {
            throw new Error('Role name already exists');
        }

        return await roleRepo.update(id, data);
    }

    async deleteRole(id) {
        const role = await roleRepo.findById(id);
        if (!role) throw new Error('Role not found');

        // Check if role has users assigned
        const users = await roleRepo.getRoleUsers(id);
        if (users && users.length > 0) {
            throw new Error('Cannot delete role with assigned users');
        }

        return await roleRepo.delete(id);
    }

    async getRolePermissions(id) {
        const role = await roleRepo.findById(id);
        if (!role) throw new Error('Role not found');

        return await roleRepo.getRolePermissions(id);
    }

    async getRoleUsers(id) {
        const role = await roleRepo.findById(id);
        if (!role) throw new Error('Role not found');

        return await roleRepo.getRoleUsers(id);
    }
}

export default new RoleService();
