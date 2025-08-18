'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get users and roles
    const [users] = await queryInterface.sequelize.query('SELECT id, email FROM users');
    const [roles] = await queryInterface.sequelize.query('SELECT id, name FROM roles');

    if (users.length === 0 || roles.length === 0) {
      console.log('⚠️ No users or roles found. Run previous seeders first.');
      return;
    }

    const adminRole = roles.find(r => r.name === 'admin');
    const authorRole = roles.find(r => r.name === 'author');
    const readerRole = roles.find(r => r.name === 'reader');

    const demoUserRoles = [];

    // Assign roles to demo users
    users.forEach(user => {
      if (user.email === 'admin@blogbuddy.com' && adminRole) {
        demoUserRoles.push({
          user_id: user.id,
          role_id: adminRole.id,
          assigned_by: null,
          assigned_at: new Date(),
          expires_at: null,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        });
      } else if (user.email.includes('john@') || user.email.includes('jane@')) {
        // Make John and Jane authors
        if (authorRole) {
          demoUserRoles.push({
            user_id: user.id,
            role_id: authorRole.id,
            assigned_by: null,
            assigned_at: new Date(),
            expires_at: null,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
          });
        }
      } else if (readerRole) {
        // Everyone else gets reader role
        demoUserRoles.push({
          user_id: user.id,
          role_id: readerRole.id,
          assigned_by: null,
          assigned_at: new Date(),
          expires_at: null,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    });

    if (demoUserRoles.length > 0) {
      await queryInterface.bulkInsert('user_roles', demoUserRoles, { ignoreDuplicates: true });
      console.log(`✅ Assigned roles to ${demoUserRoles.length} demo users`);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email IN ('admin@blogbuddy.com', 'john@example.com', 'jane@example.com', 'mike@example.com', 'sarah@example.com', 'alex@example.com')"
    );
    
    if (users.length > 0) {
      const userIds = users.map(u => u.id);
      await queryInterface.bulkDelete('user_roles', {
        user_id: { [Sequelize.Op.in]: userIds }
      });
    }
  }
};
