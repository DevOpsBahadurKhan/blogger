import dotenv from 'dotenv';
dotenv.config();

import db from '../models/index.js'; // ✅ Already fine

const { Role, Permission, sequelize } = db;

(async () => {
  try {
    await sequelize.sync();

    // ✅ Insert roles if not already present
    const rolesToInsert = [
      { id: 1, name: 'admin' },
      { id: 2, name: 'author' },
      { id: 3, name: 'reader' },
    ];

    for (const role of rolesToInsert) {
      await Role.findOrCreate({ where: { id: role.id }, defaults: role });
    }

    // ✅ Now insert permissions
    await Permission.bulkCreate([
      { role_id: 1, resource: 'user', action: 'create', possession: 'any' },
      { role_id: 1, resource: 'user', action: 'update', possession: 'any' },
      { role_id: 1, resource: 'user', action: 'delete', possession: 'any' },

      { role_id: 2, resource: 'profile', action: 'update', possession: 'any' },

      { role_id: 3, resource: 'post', action: 'create', possession: 'own' },
      { role_id: 3, resource: 'post', action: 'update', possession: 'own' },

      { role_id: 4, resource: 'post', action: 'read', possession: 'any' }
    ], {
      ignoreDuplicates: true
    });

    console.log('✅ Roles and permissions inserted.');
    process.exit(0);

  } catch (err) {
    console.error('❌ Error seeding:', err);
    process.exit(1);
  }
})();
