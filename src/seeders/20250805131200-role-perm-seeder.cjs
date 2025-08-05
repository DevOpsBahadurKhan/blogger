'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roles = [
      { id: 1, name: 'admin' },
      { id: 2, name: 'author' },
      { id: 3, name: 'reader' },
    ];

    await queryInterface.bulkInsert('Roles', roles, { ignoreDuplicates: true });

    const permissions = [
      { role_id: 1, resource: 'user', action: 'create', possession: 'any' },
      { role_id: 1, resource: 'user', action: 'update', possession: 'any' },
      { role_id: 1, resource: 'user', action: 'delete', possession: 'any' },
      // admin power
      { role_id: 1, resource: 'role', action: 'create', possession: 'any' },
      { role_id: 1, resource: 'role', action: 'read', possession: 'any' },
      { role_id: 1, resource: 'role', action: 'update', possession: 'any' },
      { role_id: 1, resource: 'role', action: 'delete', possession: 'any' },
     
      { role_id: 1, resource: 'permission', action: 'create', possession: 'any' },
      { role_id: 1, resource: 'permission', action: 'read', possession: 'any' },
      { role_id: 1, resource: 'permission', action: 'update', possession: 'any' },
      { role_id: 1, resource: 'permission', action: 'delete', possession: 'any' },

      { role_id: 2, resource: 'profile', action: 'update', possession: 'any' },

      { role_id: 3, resource: 'post', action: 'create', possession: 'own' },
      { role_id: 3, resource: 'post', action: 'update', possession: 'own' },

      { role_id: 4, resource: 'post', action: 'read', possession: 'any' },
      
    ];

    await queryInterface.bulkInsert('Permissions', permissions, { ignoreDuplicates: true });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Permissions', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
