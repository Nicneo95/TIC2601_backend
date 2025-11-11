'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the Restaurants table
    await queryInterface.createTable('Restaurants', {
      restaurant_id: {
        type: Sequelize.INTEGER,        // Primary key
        autoIncrement: true,            // Auto-increment value
        primaryKey: true                // Marks as primary key
      },
      user_id: {
        type: Sequelize.INTEGER,        // FK to Users.user_id
        allowNull: false,               // Every restaurant must belong to a user
        references: {
          model: 'Users',               // References Users table
          key: 'user_id'                // Column in Users
        },
        onDelete: 'CASCADE',            // Delete restaurant if user is deleted
        onUpdate: 'CASCADE'             // Update FK if user_id changes
      },
      name: {
        type: Sequelize.STRING(100),    // Restaurant name
        allowNull: false
      },
      address: {
        type: Sequelize.STRING(255),    // Restaurant address
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING(11),     // Restaurant phone number
        allowNull: false
      },
      cuisine_type: {
        type: Sequelize.STRING(50),     // Cuisine type (e.g., "Italian", "Mexican")
        allowNull: true
      },
      latitude: {
        type: Sequelize.DOUBLE,         // Latitude coordinate
        allowNull: true
      },
      longitude: {
        type: Sequelize.DOUBLE,         // Longitude coordinate
        allowNull: true
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.STRING(500),    // Optional restaurant description
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        // Auto-filled with current timestamp
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        // Auto-updated on record modification
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop the Restaurants table if migration is rolled back
    await queryInterface.dropTable('Restaurants');
  }
};
