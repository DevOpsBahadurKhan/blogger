import db from '../models/index.js';
const { Permission, Role } = db;

class PermissionRepository {

    async createPermission({ role_id, resource, action, possession }) {
        const permission = await Permission.create({ resource, action, possession });

        const role = await Role.findByPk(role_id);
        if (!role) throw new Error('Role not found');

        // create entry in role_permissions
        await role.addPermission(permission); 

        return permission;
    }

}

export default new PermissionRepository();
