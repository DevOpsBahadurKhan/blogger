'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get users with author or admin roles
    const [authors] = await queryInterface.sequelize.query(`
      SELECT DISTINCT u.id, u.username 
      FROM users u 
      JOIN user_roles ur ON u.id = ur.user_id 
      JOIN roles r ON ur.role_id = r.id 
      WHERE r.name IN ('admin', 'author')
    `);

    if (authors.length === 0) {
      console.log('⚠️ No authors found. Run user and role seeders first.');
      return;
    }

    const demoPosts = [
      {
        title: 'Welcome to BlogBuddy',
        content: 'This is the first post on our new blogging platform. BlogBuddy is designed to be a modern, feature-rich blogging system with role-based access control and comprehensive user management.',
        user_id: authors[0].id,
        created_at: new Date('2024-01-15'),
        updated_at: new Date('2024-01-15')
      },
      {
        title: 'Getting Started with Node.js and Express',
        content: 'Node.js has revolutionized server-side JavaScript development. In this post, we explore how to build scalable web applications using Express.js framework. We\'ll cover routing, middleware, and best practices for building RESTful APIs.',
        user_id: authors[0].id,
        created_at: new Date('2024-02-01'),
        updated_at: new Date('2024-02-01')
      },
      {
        title: 'Understanding Database Migrations',
        content: 'Database migrations are essential for managing database schema changes in production environments. This post explains how to use Sequelize migrations effectively, including best practices for Docker deployments.',
        user_id: authors.length > 1 ? authors[1].id : authors[0].id,
        created_at: new Date('2024-02-15'),
        updated_at: new Date('2024-02-15')
      },
      {
        title: 'Role-Based Access Control (RBAC) Implementation',
        content: 'Security is paramount in modern web applications. This comprehensive guide covers implementing RBAC using Node.js, including user roles, permissions, and attribute-based access control (ABAC) patterns.',
        user_id: authors[0].id,
        created_at: new Date('2024-03-01'),
        updated_at: new Date('2024-03-01')
      },
      {
        title: 'Docker Containerization Best Practices',
        content: 'Containerization has become the standard for application deployment. Learn how to create efficient Docker images, manage multi-stage builds, and implement proper health checks for production deployments.',
        user_id: authors.length > 1 ? authors[1].id : authors[0].id,
        created_at: new Date('2024-03-15'),
        updated_at: new Date('2024-03-15')
      },
      {
        title: 'Building RESTful APIs with Express',
        content: 'REST APIs are the backbone of modern web applications. This tutorial covers designing clean API endpoints, implementing proper HTTP status codes, error handling, and API documentation best practices.',
        user_id: authors[0].id,
        created_at: new Date('2024-04-01'),
        updated_at: new Date('2024-04-01')
      }
    ];

    await queryInterface.bulkInsert('posts', demoPosts, { ignoreDuplicates: true });
    console.log(`✅ Seeded ${demoPosts.length} demo posts`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('posts', {
      title: {
        [Sequelize.Op.in]: [
          'Welcome to BlogBuddy',
          'Getting Started with Node.js and Express',
          'Understanding Database Migrations',
          'Role-Based Access Control (RBAC) Implementation',
          'Docker Containerization Best Practices',
          'Building RESTful APIs with Express'
        ]
      }
    });
  }
};
