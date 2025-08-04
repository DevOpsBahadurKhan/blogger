const AccessControl = require('accesscontrol');
const { Role, Permission } = require('../models'); // Sequelize models

async function loadAccessControl() {
  const grantsObject = {};

  // Load all roles with their permissions
  const permissions = await Permission.findAll({ include: [Role] });

  for (const perm of permissions) {
    const roleName = perm.Role.name; // assuming association
    const { resource, action, possession } = perm;

    const actionPossession = `${action}${capitalize(possession)}`; // e.g., readOwn

    if (!grantsObject[roleName]) grantsObject[roleName] = {};

    if (!grantsObject[roleName][resource]) {
      grantsObject[roleName][resource] = [];
    }

    grantsObject[roleName][resource].push(actionPossession);
  }

  const ac = new AccessControl();

  // Dynamically add to AccessControl
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

module.exports = loadAccessControl;
