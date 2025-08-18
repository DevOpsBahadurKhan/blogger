'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get users and attributes
    const [users] = await queryInterface.sequelize.query('SELECT id, username FROM users');
    const [attributes] = await queryInterface.sequelize.query('SELECT id, name FROM attributes');

    if (users.length === 0 || attributes.length === 0) {
      console.log('⚠️ No users or attributes found. Run previous seeders first.');
      return;
    }

    const departmentAttr = attributes.find(a => a.name === 'department');
    const locationAttr = attributes.find(a => a.name === 'location');
    const experienceAttr = attributes.find(a => a.name === 'experience_level');

    const demoUserAttributes = [];

    users.forEach(user => {
      // Add department attribute
      if (departmentAttr) {
        let department = 'Engineering';
        if (user.username.includes('admin')) department = 'Administration';
        else if (user.username.includes('sarah')) department = 'Marketing';
        else if (user.username.includes('mike')) department = 'Sales';

        demoUserAttributes.push({
          user_id: user.id,
          attribute_id: departmentAttr.id,
          value: department
        });
      }

      // Add location attribute
      if (locationAttr) {
        const locations = ['New York', 'San Francisco', 'London', 'Toronto', 'Sydney'];
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];

        demoUserAttributes.push({
          user_id: user.id,
          attribute_id: locationAttr.id,
          value: randomLocation
        });
      }

      // Add experience level attribute
      if (experienceAttr) {
        let experience = 'intermediate';
        if (user.username.includes('admin')) experience = 'expert';
        else if (user.username.includes('john') || user.username.includes('jane')) experience = 'senior';
        else if (user.username.includes('alex')) experience = 'junior';

        demoUserAttributes.push({
          user_id: user.id,
          attribute_id: experienceAttr.id,
          value: experience
        });
      }
    });

    if (demoUserAttributes.length > 0) {
      await queryInterface.bulkInsert('user_attributes', demoUserAttributes, { ignoreDuplicates: true });
      console.log(`✅ Seeded ${demoUserAttributes.length} demo user attributes`);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE username IN ('admin', 'john_doe', 'jane_smith', 'mike_wilson', 'sarah_johnson', 'alex_brown')"
    );
    
    if (users.length > 0) {
      const userIds = users.map(u => u.id);
      await queryInterface.bulkDelete('user_attributes', {
        user_id: { [Sequelize.Op.in]: userIds }
      });
    }
  }
};
