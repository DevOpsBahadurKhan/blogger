import adminRepo from '../repositories/admin.repository.js';

class AdminService {
  /**
   * @Update Role
   */
  async updateRole(id, data) {
    const role = await adminRepo.findRoleById(id);
    if (!role) {
      throw new Error('Role not found');
    }

    // Prevent renaming to existing role name
    const exists = await adminRepo.findRoleByName(data.name);
    if (exists && exists.id !== parseInt(id)) {
      throw new Error('Role name already exists');
    }

    return await adminRepo.updateRole(id, data);
  }

  /**
   * @Create Role
   */
  async createRole(name) {
    // Optional: validate name format, check for duplicates
    return await adminRepo.createRole(name);
  }

  /**
   * @Create Permission
   */
  async createPermission(data) {
    // Optional: validate role existence, check for duplicates
    return await adminRepo.createPermission(data);
  }
}

export default new AdminService();
