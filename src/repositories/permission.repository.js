import db from '../models/index.js';
const { Permission, Role } = db;

class PermissionRepository {

    async createPermission(permissionData) {
        return await Permission.create(permissionData);
    }

    async getAllPermissions() {
        return await Permission.findAll({
            order: [['createdAt', 'DESC']]
        });
    }

    async getPermissionById(id) {
        return await Permission.findByPk(id);
    }

    async updatePermission(id, updateData) {
        const [updatedRowsCount] = await Permission.update(updateData, {
            where: { id },
            returning: true
        });
        
        if (updatedRowsCount === 0) {
            return null;
        }
        
        return await Permission.findByPk(id);
    }

    async deletePermission(id) {
        const deletedRowsCount = await Permission.destroy({
            where: { id }
        });
        return deletedRowsCount > 0;
    }

    async getPermissionsByResource(resource) {
        return await Permission.findAll({
            where: { resource },
            order: [['createdAt', 'DESC']]
        });
    }

    async getPermissionsByAction(action) {
        return await Permission.findAll({
            where: { action },
            order: [['createdAt', 'DESC']]
        });
    }

    async findByFields({ resource, action, possession }) {
        return await Permission.findOne({
            where: { resource, action, possession }
        });
    }

    async createPermissions(permissionArray) {
        return await Permission.bulkCreate(permissionArray, { returning: true });
    }

    async findByRoleId(role_id) {
        return await Role.findByPk(role_id);
    }

}

export default new PermissionRepository();
