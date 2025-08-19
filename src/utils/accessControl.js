// /src/utils/accessControl.js
import { newEnforcer } from 'casbin';
import path from 'path';
import db from '../models/index.js';
import abacEngine from './abacEngine.js';

const { Role, Permission } = db;

let enforcerInstance = null;

export default async function loadAccessControl() {
  const modelPath = path.resolve('src/config/rbac_model.conf');
  const enforcer = await newEnforcer(modelPath);

  // Load roles with permissions
  const roles = await Role.findAll({
    include: [{
        model: Permission,
        as: 'permissions' // alias must match the association alias
    }]
});

  for (const role of roles) {
    const roleName = role.name;

    for (const perm of role.permissions) { 
      const { resource, action, possession } = perm;
      await enforcer.addPolicy(roleName, resource, action, possession);
    }
  }

  // Optional: define role hierarchy if needed
  // await enforcer.addGroupingPolicy('admin', 'editor');

  enforcerInstance = enforcer;
  global.ac = enforcer;
  global.abac = abacEngine; // Make ABAC engine globally available
  return enforcer;
}

/**
 * Enhanced access control that combines RBAC and ABAC
 * @param {string} role - User's role
 * @param {string} resource - Resource being accessed
 * @param {string} action - Action being performed
 * @param {string} possession - Possession scope
 * @param {Object} user - User object for ABAC evaluation
 * @param {Object} resourceObj - Resource object for ABAC evaluation
 * @returns {boolean} - Whether access is allowed
 */
export async function checkAccess(role, resource, action, possession, user = null, resourceObj = null) {
  try {
    // First check RBAC (Casbin)
    const rbacAllowed = await global.ac.enforce(role, resource, action, possession);

    if (!rbacAllowed) {
      return false; // RBAC denied, no need to check ABAC
    }

    // If RBAC allowed, check ABAC conditions
    const permissions = await getPermissionsForRole(role, resource, action, possession);

    for (const permission of permissions) {
      if (permission.condition) {
        const abacAllowed = await global.abac.evaluateCondition(
          permission.condition,
          user,
          resourceObj
        );

        if (!abacAllowed) {
          return false; // ABAC condition not met
        }
      }
    }

    return true; // Both RBAC and ABAC passed
  } catch (error) {
    console.error('[AccessControl] Error checking access:', error);
    return false;
  }
}

/**
 * Get permissions for a specific role, resource, action, and possession
 */
async function getPermissionsForRole(roleName, resource, action, possession) {
  try {
    const role = await Role.findOne({
      where: { name: roleName },
      include: [{
        model: Permission, as:'permissions',
        where: { resource, action, possession }
      }]
    });

    return role?.permissions || [];
  } catch (error) {
    console.error('[AccessControl] Error getting permissions:', error);
    return [];
  }
}

/**
 * Get all permissions for a role
 */
export async function getRolePermissions(roleName) {
  try {
    const role = await Role.findOne({
      where: { name: roleName },
      include: [{ model: Permission, as: 'permissions' }]
    });

    return role?.permissions || [];
  } catch (error) {
    console.error('[AccessControl] Error getting role permissions:', error);
    return [];
  }
}

/**
 * Check if a user has a specific permission with ABAC evaluation
 */
export async function hasPermission(user, resource, action, possession, resourceObj = null) {
  if (!user || !user.role) {
    return false;
  }

  return checkAccess(user.role, resource, action, possession, user, resourceObj);
}
