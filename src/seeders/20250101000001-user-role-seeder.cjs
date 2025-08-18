'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get existing users and roles
    const [users] = await queryInterface.sequelize.query('SELECT id, username FROM users');
    const [roles] = await queryInterface.sequelize.query('SELECT id, name FROM roles');

    if (users.length === 0 || roles.length === 0) {
      console.log('⚠️ No users or roles found. Skipping user-role seeding.');
      return;
    }

    // Create user-role mappings
    const userRoles = [
      // Admin user gets admin role
      {
        user_id: users.find(u => u.username === 'admin')?.id || users[0].id,
        role_id: roles.find(r => r.name === 'admin')?.id || roles[0].id,
        assigned_by: null,
        assigned_at: new Date(),
        expires_at: null,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Author user gets author role
      {
        user_id: users.find(u => u.username === 'author')?.id || users[1]?.id || users[0].id,
        role_id: roles.find(r => r.name === 'author')?.id || roles[1]?.id || roles[0].id,
        assigned_by: null,
        assigned_at: new Date(),
        expires_at: null,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Reader user gets reader role
      {
        user_id: users.find(u => u.username === 'reader')?.id || users[2]?.id || users[0].id,
        role_id: roles.find(r => r.name === 'reader')?.id || roles[2]?.id || roles[0].id,
        assigned_by: null,
        assigned_at: new Date(),
        expires_at: null,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ].filter(ur => ur.user_id && ur.role_id); // Filter out invalid mappings

    if (userRoles.length > 0) {
      await queryInterface.bulkInsert('user_roles', userRoles, { ignoreDuplicates: true });
      console.log(`✅ Seeded ${userRoles.length} user-role relationships`);
    }

    // Create some additional user-role combinations for testing
    const additionalUserRoles = [];
    
    // Give first user multiple roles if possible
    if (roles.length > 1) {
      additionalUserRoles.push({
        user_id: users[0].id,
        role_id: roles[1].id,
        assigned_by: null,
        assigned_at: new Date(),
        expires_at: null,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    if (roles.length > 2) {
      additionalUserRoles.push({
        user_id: users[0].id,
        role_id: roles[2].id,
        assigned_by: null,
        assigned_at: new Date(),
        expires_at: null,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    if (additionalUserRoles.length > 0) {
      await queryInterface.bulkInsert('user_roles', additionalUserRoles, { ignoreDuplicates: true });
      console.log(`✅ Seeded ${additionalUserRoles.length} additional user-role relationships`);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user_roles', null, {});
  }
};
