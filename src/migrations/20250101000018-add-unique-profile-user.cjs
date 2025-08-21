'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Enforce one-to-one: each user can have at most one profile
    await queryInterface.addConstraint('profiles', {
      fields: ['user_id'],
      type: 'unique',
      name: 'profiles_user_id_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('profiles', 'profiles_user_id_unique');
  }
};
