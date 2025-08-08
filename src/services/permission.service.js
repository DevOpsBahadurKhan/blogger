import permissionRepo from '../repositories/permission.repository.js';

class PermissionService {

    async createPermission(data) {
        return await permissionRepo.createPermission(data);
    }

}

export default new PermissionService();
