'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1) Ensure profile permissions exist
    const profilePerms = [
      { resource: 'profile', action: 'read', possession: 'any' },
      { resource: 'profile', action: 'update', possession: 'own' },
      { resource: 'profile', action: 'update', possession: 'any' }
    ];

    await queryInterface.bulkInsert('permissions', profilePerms, { ignoreDuplicates: true });

    // 2) Load roles and permissions
    const [roles] = await queryInterface.sequelize.query('SELECT id, name FROM roles');
    const [perms] = await queryInterface.sequelize.query(
      "SELECT id, resource, action, possession FROM permissions WHERE resource = 'profile'"
    );

    const roleIdByName = Object.fromEntries(roles.map(r => [r.name, r.id]));
    const permId = (r, a, p) => {
      const found = perms.find(x => x.resource === r && x.action === a && x.possession === p);
      return found ? found.id : null;
    };

    // 3) Build role-permission mappings
    const mappings = [];

    // Admin gets read:any and update:any for profile
    if (roleIdByName.admin) {
      const rp = [
        { permission_id: permId('profile', 'read', 'any') },
        { permission_id: permId('profile', 'update', 'any') }
      ].filter(x => x.permission_id);
      rp.forEach(x => mappings.push({ role_id: roleIdByName.admin, permission_id: x.permission_id }));
    }

    // Author gets update:own for profile
    if (roleIdByName.author) {
      const pid = permId('profile', 'update', 'own');
      if (pid) mappings.push({ role_id: roleIdByName.author, permission_id: pid });
    }

    // Reader also gets update:own for profile (optional but helpful)
    if (roleIdByName.reader) {
      const pid = permId('profile', 'update', 'own');
      if (pid) mappings.push({ role_id: roleIdByName.reader, permission_id: pid });
    }

    if (mappings.length) {
      await queryInterface.bulkInsert('role_permissions', mappings, { ignoreDuplicates: true });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove role-permission mappings for profile resource
    await queryInterface.sequelize.query(`
      DELETE rp FROM role_permissions rp
      JOIN permissions p ON rp.permission_id = p.id
      WHERE p.resource = 'profile';
    `);

    // Remove the profile permissions themselves
    await queryInterface.bulkDelete('permissions', { resource: 'profile' }, {});
  }
};
