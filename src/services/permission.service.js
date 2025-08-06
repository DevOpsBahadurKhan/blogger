import permissionRepo from '../repositories/permission.repository.js';

class PermissionService {



    /** @Create Permission */
    async createPermission(data) {
        return await permissionRepo.create(data);
    }



}

export default new PermissionService();
