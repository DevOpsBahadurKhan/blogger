'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1️⃣ Insert roles with timestamps
    const roles = [
      { id: 1, name: 'admin' },
      { id: 2, name: 'author' },
      { id: 3, name: 'reader' },
    ];
    await queryInterface.bulkInsert(
      'Roles',
      roles.map(r => ({
        ...r,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      { ignoreDuplicates: true }
    );

    // 2️⃣ Insert permissions with timestamps (added missing ones)
    const permissions = [
      { resource: 'user', action: 'create', possession: 'any' },
      { resource: 'user', action: 'update', possession: 'any' },
      { resource: 'user', action: 'update', possession: 'own' }, // added
      { resource: 'user', action: 'delete', possession: 'any' },

      { resource: 'role', action: 'create', possession: 'any' },
      { resource: 'role', action: 'read', possession: 'any' },
      { resource: 'role', action: 'update', possession: 'any' },
      { resource: 'role', action: 'delete', possession: 'any' },

      { resource: 'permission', action: 'create', possession: 'any' },
      { resource: 'permission', action: 'read', possession: 'any' },
      { resource: 'permission', action: 'update', possession: 'any' },
      { resource: 'permission', action: 'delete', possession: 'any' },

      { resource: 'profile', action: 'update', possession: 'any' },

      { resource: 'post', action: 'create', possession: 'own' },
      { resource: 'post', action: 'create', possession: 'any' }, // added
      { resource: 'post', action: 'update', possession: 'own' },
      { resource: 'post', action: 'update', possession: 'any' }, // added
      { resource: 'post', action: 'read', possession: 'any' },

      { resource: 'role_permissions', action: 'assign', possession: 'any' }, // added
    ];
    await queryInterface.bulkInsert(
      'Permissions',
      permissions.map(p => ({
        ...p,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      { ignoreDuplicates: true }
    );

    // 3️⃣ Map role-permission relationships
    const [roleRows] = await queryInterface.sequelize.query('SELECT id, name FROM Roles');
    const [permRows] = await queryInterface.sequelize.query(
      'SELECT id, resource, action, possession FROM Permissions'
    );

    const roleMap = Object.fromEntries(roleRows.map(r => [r.name, r.id]));

    const rolePermMappings = [
      // admin
      { role: 'admin', resource: 'user', action: 'create', possession: 'any' },
      { role: 'admin', resource: 'user', action: 'update', possession: 'any' },
      { role: 'admin', resource: 'user', action: 'delete', possession: 'any' },
      { role: 'admin', resource: 'role', action: 'create', possession: 'any' },
      { role: 'admin', resource: 'role', action: 'read', possession: 'any' },
      { role: 'admin', resource: 'role', action: 'update', possession: 'any' },
      { role: 'admin', resource: 'role', action: 'delete', possession: 'any' },
      { role: 'admin', resource: 'permission', action: 'create', possession: 'any' },
      { role: 'admin', resource: 'permission', action: 'read', possession: 'any' },
      { role: 'admin', resource: 'permission', action: 'update', possession: 'any' },
      { role: 'admin', resource: 'permission', action: 'delete', possession: 'any' },
      { role: 'admin', resource: 'post', action: 'create', possession: 'any' },
      { role: 'admin', resource: 'post', action: 'update', possession: 'any' },
      { role: 'admin', resource: 'post', action: 'read', possession: 'any' },
      { role: 'admin', resource: 'role_permissions', action: 'assign', possession: 'any' },

      // author
      { role: 'author', resource: 'user', action: 'update', possession: 'own' },

      // reader
      { role: 'reader', resource: 'post', action: 'read', possession: 'any' },
    ];

    const role_permissions = rolePermMappings
      .map(({ role, resource, action, possession }) => {
        const roleId = roleMap[role];
        const permission = permRows.find(
          p => p.resource === resource && p.action === action && p.possession === possession
        );
        if (!roleId || !permission) {
          console.warn(`⚠️ Skipping mapping: ${role} → ${resource}:${action}:${possession}`);
          return null;
        }
        return {
          role_id: roleId,
          permission_id: permission.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
      .filter(Boolean);

    await queryInterface.bulkInsert('role_permissions', role_permissions, { ignoreDuplicates: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role_permissions', null, {});
    await queryInterface.bulkDelete('Permissions', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
