import AccessControl from 'accesscontrol';
import db from '../models/index.js';

const { Role, Permission } = db;

export default async function loadAccessControl() {
  const grantsObject = {};

  // Load all roles with their permissions
  const roles = await Role.findAll({
    include: [Permission],
  });

  for (const role of roles) {
    const roleName = role.name;

    for (const perm of role.Permissions) {
      const { resource, action, possession } = perm;
      const actionPossession = `${action}${capitalize(possession)}`;

      if (!grantsObject[roleName]) {
        grantsObject[roleName] = {};
      }

      if (!grantsObject[roleName][resource]) {
        grantsObject[roleName][resource] = [];
      }

      grantsObject[roleName][resource].push(actionPossession);
    }
  }

  // Convert grants object into AccessControl instance
  const ac = new AccessControl();

  for (const role in grantsObject) {
    for (const resource in grantsObject[role]) {
      for (const action of grantsObject[role][resource]) {
        ac.grant(role)[action](resource);
      }
    }
  }

  return ac;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
