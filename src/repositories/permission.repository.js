import db from '../models/index.js';
const { Permission, Role } = db;

class PermissionRepository {
    
    async createPermission(permissionData) {
        return await Permission.create(permissionData);
    }

    async createPermissions(permissionArray) {
        return await Permission.bulkCreate(permissionArray, { returning: true });
    }

    async findByRoleId(role_id) {
        return await Role.findByPk(role_id);
    }

}

export default new PermissionRepository();
