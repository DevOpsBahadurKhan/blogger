'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get posts and users
    const [posts] = await queryInterface.sequelize.query('SELECT id, title FROM posts');
    const [users] = await queryInterface.sequelize.query('SELECT id, username FROM users');

    if (posts.length === 0 || users.length === 0) {
      console.log('⚠️ No posts or users found. Run previous seeders first.');
      return;
    }

    const demoComments = [
      {
        content: 'Great introduction to the platform! Looking forward to more content.',
        user_id: users.find(u => u.username === 'mike_wilson')?.id || users[0].id,
        post_id: posts.find(p => p.title.includes('Welcome'))?.id || posts[0].id,
        created_at: new Date('2024-01-16'),
        updated_at: new Date('2024-01-16')
      },
      {
        content: 'This is exactly what I was looking for. The explanation is very clear and comprehensive.',
        user_id: users.find(u => u.username === 'sarah_johnson')?.id || users[1].id,
        post_id: posts.find(p => p.title.includes('Node.js'))?.id || posts[1].id,
        created_at: new Date('2024-02-02'),
        updated_at: new Date('2024-02-02')
      },
      {
        content: 'Could you provide more examples of complex migration scenarios?',
        user_id: users.find(u => u.username === 'alex_brown')?.id || users[2].id,
        post_id: posts.find(p => p.title.includes('Database'))?.id || posts[2].id,
        created_at: new Date('2024-02-16'),
        updated_at: new Date('2024-02-16')
      },
      {
        content: 'Excellent tutorial! The RBAC implementation is very well explained.',
        user_id: users.find(u => u.username === 'mike_wilson')?.id || users[0].id,
        post_id: posts.find(p => p.title.includes('RBAC'))?.id || posts[3].id,
        created_at: new Date('2024-03-02'),
        updated_at: new Date('2024-03-02')
      },
      {
        content: 'Thanks for sharing this! Docker has been confusing for me, but this makes it clearer.',
        user_id: users.find(u => u.username === 'sarah_johnson')?.id || users[1].id,
        post_id: posts.find(p => p.title.includes('Docker'))?.id || posts[4].id,
        created_at: new Date('2024-03-16'),
        updated_at: new Date('2024-03-16')
      },
      {
        content: 'Very helpful guide. I\'ve bookmarked this for future reference.',
        user_id: users.find(u => u.username === 'alex_brown')?.id || users[2].id,
        post_id: posts.find(p => p.title.includes('RESTful'))?.id || posts[5].id,
        created_at: new Date('2024-04-02'),
        updated_at: new Date('2024-04-02')
      },
      {
        content: 'I implemented this in my project and it works perfectly. Thank you!',
        user_id: users.find(u => u.username === 'john_doe')?.id || users[3].id,
        post_id: posts.find(p => p.title.includes('Node.js'))?.id || posts[1].id,
        created_at: new Date('2024-02-05'),
        updated_at: new Date('2024-02-05')
      },
      {
        content: 'Would love to see a follow-up post about testing these APIs.',
        user_id: users.find(u => u.username === 'jane_smith')?.id || users[4].id,
        post_id: posts.find(p => p.title.includes('RESTful'))?.id || posts[5].id,
        created_at: new Date('2024-04-03'),
        updated_at: new Date('2024-04-03')
      }
    ];

    await queryInterface.bulkInsert('comments', demoComments, { ignoreDuplicates: true });
    console.log(`✅ Seeded ${demoComments.length} demo comments`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('comments', {
      content: {
        [Sequelize.Op.like]: '%Great introduction%'
      }
    });
    await queryInterface.bulkDelete('comments', {
      content: {
        [Sequelize.Op.like]: '%This is exactly what%'
      }
    });
    await queryInterface.bulkDelete('comments', {
      content: {
        [Sequelize.Op.like]: '%Could you provide more%'
      }
    });
  }
};
