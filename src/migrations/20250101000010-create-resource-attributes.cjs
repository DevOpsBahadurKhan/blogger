'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('resource_attributes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      resource_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      resource_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      attribute_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'attributes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      value: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add composite index for efficient lookups
    try {
      await queryInterface.addIndex('resource_attributes', ['resource_type', 'resource_id', 'attribute_id'], {
        unique: true,
        name: 'unique_resource_attribute'
      });
    } catch (error) {
      console.log('Index creation skipped:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('resource_attributes');
  }
};
