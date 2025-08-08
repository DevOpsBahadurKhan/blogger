import roleRepo from '../repositories/role.repository.js';

class RoleService {
    
    async createRole(name) {
        return await roleRepo.createRole(name);
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

}

export default new RoleService();
