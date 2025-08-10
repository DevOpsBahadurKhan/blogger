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
    const { meId, roleId, permissionId } = params;

    // Get the logged-in user's role_id
    const me = await User.findByPk(meId);
    if (!me) {
      logger.warn({ message: 'Authenticated user not found' });
      throw new Error('Authenticated user not found');
    }
    const currentUserRoleId = me.role_id;

    // 1. Check target role exists
    const role = await Role.findByPk(roleId);
    if (!role) {
      logger.warn({ message: 'Target role not found' });
      throw new Error('Target role not found');
    }

    // 2. Check target permission exists
    const permission = await Permission.findByPk(permissionId);
    if (!permission) {
      logger.warn({ message: 'Permission not found' });
      throw new Error('Permission not found');
    }

    // 3. Check the admin's own permissions
    const adminHasPermission = await RolePermission.findOne({
      where: {
        role_id: currentUserRoleId,
        permission_id: permissionId
      }
    });

    if (!adminHasPermission) {
      logger.error({ message: 'You cannot assign a permission you do not have' });
      throw new Error('You cannot assign a permission you do not have');
    }

    // 4. Check if already assigned
    const alreadyAssigned = await RolePermission.findOne({
      where: { role_id: roleId, permission_id: permissionId }
    });

    if (alreadyAssigned) {
      logger.warn({ message: 'Permission already assigned to this role' });
      throw new Error('Permission already assigned to this role');
    }

    // 5. Assign permission
    await RolePermission.create({
      role_id: roleId,
      permission_id: permissionId
    });
  }


}

export default new AdminService();
