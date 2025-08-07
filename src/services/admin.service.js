import adminRepo from '../repositories/admin.repository.js';
import logger from '../utils/logger.js';

class AdminService {
  
  /** @UpdateRole */
  
  async updateRole(id, data) {
    const role = await adminRepo.findRoleById(id);
    if (!role) {
      logger.warn(`Update failed: Role with ID ${id} not found`);
      throw new Error('Role not found');
    }

    // Prevent renaming to existing role name
    const exists = await adminRepo.findRoleByName(data.name);
    if (exists && exists.id !== parseInt(id)) {
      logger.warn(`Update failed: Role with ID ${id} not found`);
      throw new Error('Role name already exists');
    }

    logger.info(`Role with ID ${id} updated successfully`, { updatedRole });
    return await adminRepo.updateRole(id, data);
  }

  
  /** @CreateRole */
  async createRole(name) {
    // Optional: validate name format, check for duplicates
    return await adminRepo.createRole(name);
  }

 
}

export default new AdminService();
