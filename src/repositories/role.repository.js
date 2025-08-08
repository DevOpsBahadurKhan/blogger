import db from '../models/index.js';
const { Role } = db;

class RoleRepository {

    async createRole(name) {
        return await Role.create({ name });
    }

    async findById(id) {
        return await Role.findByPk(id);
    }

    async findByName(name) {
        return await Role.findOne({ where: { name } });
    }

    async update(id, data) {
        await Role.update(data, { where: { id } });
        return await Role.findByPk(id);
    }
}

export default new RoleRepository();
