const { Role, Permission } = require('../models');
const sequelize = require('../config/db.config'); // or wherever you export Sequelize instance

(async () => {
  try {
    await sequelize.sync();

    // Insert roles
    const roles = await Role.bulkCreate([
      { id: 1, name: 'superAdmin' },
      { id: 2, name: 'admin' },
      { id: 3, name: 'author' },
      { id: 4, name: 'reader' },
    ], { ignoreDuplicates: true });

    // Insert permissions
    await Permission.bulkCreate([
      { role_id: 1, resource: 'user', action: 'create', possession: 'any' },
      { role_id: 1, resource: 'user', action: 'update', possession: 'any' },
      { role_id: 1, resource: 'user', action: 'delete', possession: 'any' },

      { role_id: 2, resource: 'profile', action: 'update', possession: 'any' },

      { role_id: 3, resource: 'post', action: 'create', possession: 'own' },
      { role_id: 3, resource: 'post', action: 'update', possession: 'own' },

      { role_id: 4, resource: 'post', action: 'read', possession: 'any' }
    ]);

    console.log('✅ Roles and permissions inserted.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding:', err);
    process.exit(1);
  }
})();
