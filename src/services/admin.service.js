// blogger\src\services\admin.service.js
import adminRepo from '../repositories/admin.repository.js';
import logger from '../utils/logger.js';

class AdminService {

  async assignRole(userId, roleId) {
    const updatedUser = await adminRepo.assignRoleToUser(userId, roleId);
    logger.info(`Assigned role ${roleId} to user ${userId}`);
    return updatedUser;
  }



}

export default new AdminService();
