// blogger\src\services\admin.service.js
import adminRepo from '../repositories/admin.repository.js';
import logger from '../utils/logger.js';

// controllers/rolePermissionController.js
import db from '../models/index.js';
const { Role, Permission, RolePermission } = db;


class AdminService {

  async assignRole(userId, roleId) {
    const updatedUser = await adminRepo.assignRoleToUser(userId, roleId);
    logger.info(`Assigned role ${roleId} to user ${userId}`);
    return updatedUser;
  }


  async assignPermissionToRole(params) {
    const { meId: role_id, roleId, permissionId } = params;
console.log({ meId: role_id, roleId, permissionId });

    // 1. Check if target role exists
    const role = await Role.findByPk(role_id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // 2. Check if target permission exists checkPermissionExist(){ return await Permission.findByPk(permissionId);}
    const permission = await Permission.findByPk(permissionId);
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    // 3. Security check — admin must have this permission
    const adminHasPermission = await RolePermission.findOne({
      where: {
        role_id: role_id, // ✅ fixed camelCase to match Passport
        permission_id: permissionId
      }
    });

    if (!adminHasPermission) {
      return res.status(403).json({ message: 'You cannot assign a permission you do not have' });
    }

    // 4. Check if already assigned
    const alreadyAssigned = await RolePermission.findOne({
      where: { role_id: roleId, permission_id: permissionId }
    });

    if (alreadyAssigned) {
      return res.status(409).json({ message: 'Permission already assigned to this role' });
    }

    // 5. Assign permission
    await RolePermission.create({
      role_id: roleId,
      permission_id: permissionId
    });
  }

}

export default new AdminService();
