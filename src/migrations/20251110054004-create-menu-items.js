'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the MenuItems table
    await queryInterface.createTable('MenuItems', {
      item_id: {
        type: Sequelize.INTEGER,        // Primary key
        autoIncrement: true,            // Auto-increment value
        primaryKey: true                // Marks as PK
      },
      restaurant_id: {
        type: Sequelize.INTEGER,        // Foreign key to Restaurants.restaurant_id
        allowNull: false,               // Required field
        references: {
          model: 'Restaurants',         // References the Restaurants table
          key: 'restaurant_id'          // Column being referenced
        },
        onDelete: 'CASCADE',            // If restaurant deleted → delete menu items
        onUpdate: 'CASCADE'             // If restaurant_id changes → update here
      },
      name: {
        type: Sequelize.STRING(100),    // Item name (max 100 chars)
        allowNull: false
      },
      description: {
        type: Sequelize.STRING(600),    // Optional item description
        allowNull: true
      },
      price: {
        type: Sequelize.DOUBLE,         // Item price
        allowNull: false,
        validate: { min: 0 }            // Must be >= 0 (logic validation)
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,           // Record creation timestamp
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // Auto default
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop the MenuItems table if rolled back
    await queryInterface.dropTable('MenuItems');
  }
};
