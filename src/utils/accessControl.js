import AccessControl from 'accesscontrol';
import db from '../models/index.js';
const { Role, Permission } = db; // Ensure this file exports both models

export default async function loadAccessControl() {
  const grantsObject = {};

  // Load all permissions with associated roles
  const permissions = await Permission.findAll({ include: [Role] });

  for (const perm of permissions) {
    const roleName = perm.Role.name; // assuming Role is associated in Permission model
    const { resource, action, possession } = perm;
    const actionPossession = `${action}${capitalize(possession)}`; // e.g., readOwn

    if (!grantsObject[roleName]) {
      grantsObject[roleName] = {};
    }

    if (!grantsObject[roleName][resource]) {
      grantsObject[roleName][resource] = [];
    }

    grantsObject[roleName][resource].push(actionPossession);
  }

  const ac = new AccessControl();

  // Build grants in AccessControl instance
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
