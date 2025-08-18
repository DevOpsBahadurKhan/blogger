// blogger\src\services\admin.service.js
import adminRepo from '../repositories/admin.repository.js';
import logger from '../utils/logger.js';
// controllers/rolePermissionController.js
import db from '../models/index.js';
const { Role, Permission, RolePermission } = db;


class AdminService {

  async assignRoleToUser(userId, roleId) {
    try {
      const role = await adminRepo.checkRoleExists(roleId);
      if (!role) {
        const err = new Error('Invalid Role ID');
        err.statusCode = 400;
        throw err;
      }

      const updatedUser = await adminRepo.assignRoleToUser(userId, roleId);

      logger.info(`Role assigned: User ${userId} → Role ${roleId}`);
      return updatedUser;
    } catch (error) {
      logger.error(`Error assigning role: ${error.message}`, { userId, roleId });
      throw error;
    }
  }


  async assignPermissionToRole(params) {
    try {
      const { roleId, permissionId } = params;

      const role = await Role.findByPk(roleId);
      if (!role) {
        logger.warn(`[Admin] Role not found`, { roleId, context: 'assignPermissionToRole' });
        const err = new Error('Target role not found');
        err.statusCode = 404;
        throw err;
      }

      const permission = await Permission.findByPk(permissionId);
      if (!permission) {
        logger.warn(`[Admin] Permission not found`, { permissionId, context: 'assignPermissionToRole' });
        const err = new Error('Permission not found');
        err.statusCode = 404;
        throw err;
      }

      const alreadyAssigned = await RolePermission.findOne({
        where: { role_id: roleId, permission_id: permissionId }
      });

      if (alreadyAssigned) {
        logger.warn(`[Admin] Permission already assigned`, { roleId, permissionId, context: 'assignPermissionToRole' });
        const err = new Error('Permission already assigned to this role');
        err.statusCode = 409;
        err.error = "Conflict💔"
        throw err;
      }

      await role.addPermission(permission);
      
      logger.info(`[Admin] Permission assigned successfully`, {
        roleId,
        permissionId,
        roleName: role.name,
        permissionName: permission.name,
        context: 'assignPermissionToRole'
      });

    } catch (error) {
      logger.error(`[Admin] Error assigning permission to role: ${error.message}`, {
        roleId: params.roleId,
        permissionId: params.permissionId,
        error: error.stack,
        context: 'assignPermissionToRole'
      });
      throw error;
    }
  }

}

export default new AdminService();
