import db from '../models/index.js';
const { Role, Permission, User } = db;

class RoleRepository {

    async createRole(name, description) {
        return await Role.create({ name, description });
    }

    async findAll() {
        return await Role.findAll({
            include: [
                {
                    model: Permission,
                    as: 'permissions',
                    through: { attributes: [] }
                }
            ]
        });
    }

    async findById(id) {
        return await Role.findByPk(id, {
            include: [
                {
                    model: Permission,
                    as: 'permissions',
                    through: { attributes: [] }
                }
            ]
        });
    }

    async findByName(name) {
        return await Role.findOne({ where: { name } });
    }

    async update(id, data) {
        await Role.update(data, { where: { id } });
        return await Role.findByPk(id);
    }

    async delete(id) {
        const role = await Role.findByPk(id);
        if (role) {
            await role.destroy();
            return true;
        }
        return false;
    }

    async getRolePermissions(roleId) {
        const role = await Role.findByPk(roleId, {
            include: [
                {
                    model: Permission,
                    as: 'permissions',
                    through: { attributes: [] }
                }
            ]
        });
        return role ? role.permissions : [];
    }

    async getRoleUsers(roleId) {
        const role = await Role.findByPk(roleId, {
            include: [
                {
                    model: User,
                    as: 'users',
                    through: { attributes: [] },
                    attributes: ['id', 'username', 'email']
                }
            ]
        });
        return role ? role.users : [];
    }
}

export default new RoleRepository();
