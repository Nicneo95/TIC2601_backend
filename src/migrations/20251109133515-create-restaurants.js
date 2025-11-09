'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Restaurants', {
      restaurant_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      phone: Sequelize.STRING(20),
      cuisine_type: Sequelize.STRING(50),
      latitude: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      longitude: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      description: Sequelize.STRING(500),
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add foreign key
    await queryInterface.addConstraint('Restaurants', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_restaurants_user_id',
      references: { table: 'Users', field: 'user_id' },
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Restaurants');
  }
};