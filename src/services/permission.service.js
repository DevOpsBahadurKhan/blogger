import permissionRepo from '../repositories/permission.repository.js';

class PermissionService {
    async createPermission(data) {
        return await permissionRepo.create(data);
    }
}

export default new PermissionService();
