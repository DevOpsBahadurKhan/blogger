'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('policies', 'priority', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Higher priority policies are evaluated first',
      after: 'effect',
    });

    await queryInterface.addColumn('policies', 'possession', {
      type: Sequelize.STRING(100),
      allowNull: false,
      defaultValue: 'any',
      after: 'action',
    });

    // Optional helpful indexes
    await queryInterface.addIndex('policies', ['resource', 'action', 'possession']);
    await queryInterface.addIndex('policies', ['priority']);
    await queryInterface.addIndex('policies', ['is_active']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('policies', ['resource', 'action', 'possession']).catch(() => {});
    await queryInterface.removeIndex('policies', ['priority']).catch(() => {});
    await queryInterface.removeIndex('policies', ['is_active']).catch(() => {});

    await queryInterface.removeColumn('policies', 'possession').catch(() => {});
    await queryInterface.removeColumn('policies', 'priority').catch(() => {});
  },
};
