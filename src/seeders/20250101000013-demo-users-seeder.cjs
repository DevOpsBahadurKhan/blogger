'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Hash passwords for demo users
    const hashedPassword = await bcrypt.hash('123', 10);

    const demoUsers = [
      {
        username: 'admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'nida',
        email: 'nida@gmail.com',
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'shifa',
        email: 'shifa@gmail.com',
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'bk',
        email: 'bk@gmail.com',
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'sarah',
        email: 'sarah@gmail.com',
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'alex_brown',
        email: 'alex@gmail.com',
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('users', demoUsers, { ignoreDuplicates: true });
    console.log('✅ Demo users seeded successfully');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      email: {
        [Sequelize.Op.in]: [
          'admin@gmail.com',
          'nida@gmail.com',
          'shifa@gmail.com',
          'bk@gmail.com',
          'sarah@gmail.com',
          'alex@gmail.com'
        ]
      }
    });
  }
};
