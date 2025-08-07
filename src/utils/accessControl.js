// /src/utils/accessControl.js
import { newEnforcer } from 'casbin';
import path from 'path';
import db from '../models/index.js';

const { Role, Permission } = db;

let enforcerInstance = null;

export default async function loadAccessControl() {
  const modelPath = path.resolve('src/config/rbac_model.conf');
  const enforcer = await newEnforcer(modelPath);

  // Load roles with permissions
  const roles = await Role.findAll({ include: [Permission] });

  for (const role of roles) {
    const roleName = role.name;

    for (const perm of role.Permissions) {
      const { resource, action, possession } = perm;
      await enforcer.addPolicy(roleName, resource, action, possession);
    }
  }

  // Optional: define role hierarchy if needed
  // await enforcer.addGroupingPolicy('admin', 'editor');

  enforcerInstance = enforcer;
  global.ac = enforcer;
  return enforcer;
}
