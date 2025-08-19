'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add columns expected by seeders and model
    await queryInterface.addColumn('permissions', 'resource', {
      type: Sequelize.STRING(100),
      allowNull: false,
      after: 'id',
    });

    await queryInterface.addColumn('permissions', 'action', {
      type: Sequelize.STRING(100),
      allowNull: false,
      after: 'resource',
    });

    await queryInterface.addColumn('permissions', 'possession', {
      type: Sequelize.STRING(20),
      allowNull: false,
      after: 'action',
    });

    // Optional: Make legacy columns nullable since they are not used by seeder
    await queryInterface.changeColumn('permissions', 'name', {
      type: Sequelize.STRING(100),
      allowNull: true,
    }).catch(() => {});

    await queryInterface.changeColumn('permissions', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    }).catch(() => {});

    // Helpful indexes
    await queryInterface.addIndex('permissions', ['resource', 'action', 'possession'], {
      unique: true,
      name: 'uniq_permission_triplet',
    }).catch(() => {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('permissions', 'uniq_permission_triplet').catch(() => {});
    await queryInterface.removeColumn('permissions', 'possession').catch(() => {});
    await queryInterface.removeColumn('permissions', 'action').catch(() => {});
    await queryInterface.removeColumn('permissions', 'resource').catch(() => {});

    // Optionally restore strictness on legacy columns
    await queryInterface.changeColumn('permissions', 'name', {
      type: Sequelize.STRING(100),
      allowNull: false,
    }).catch(() => {});

    await queryInterface.changeColumn('permissions', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    }).catch(() => {});
  },
};
