// blogger\src\services\admin.service.js
import adminRepo from '../repositories/admin.repository.js';
import logger from '../utils/logger.js';

// controllers/rolePermissionController.js
import db from '../models/index.js';
const { User, Role, Permission, RolePermission } = db;


class AdminService {

  // every user has default role 'reader', just need to update that 
  async assignRoleToUser(userId, roleId) {
    const updatedUser = await adminRepo.assignRoleToUser(userId, roleId);
    logger.info(`Assigned role ${roleId} to user ${userId}`);
    return updatedUser;
  }


  async assignPermissionToRole(params) {
    const { roleId, permissionId } = params;
    
    const role = await Role.findByPk(roleId);
    if (!role) throw new Error('Target role not found');

    const permission = await Permission.findByPk(permissionId);
    if (!permission) throw new Error('Permission not found');

    const alreadyAssigned = await RolePermission.findOne({
      where: { role_id: roleId, permission_id: permissionId }
    });

    if (alreadyAssigned) throw new Error('Permission already assigned to this role');

    await RolePermission.create({
      role_id: roleId,
      permission_id: permissionId
    });
  }

}

export default new AdminService();
