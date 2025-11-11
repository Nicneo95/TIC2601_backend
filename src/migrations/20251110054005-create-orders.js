'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the Orders table
    await queryInterface.createTable('Orders', {
      order_id: {
        type: Sequelize.INTEGER,        // Primary key
        autoIncrement: true,            // Auto-incrementing integer
        primaryKey: true                // Marks as primary key
      },
      user_id: {
        type: Sequelize.INTEGER,        // FK to Users.user_id
        allowNull: false,               // Required field
        references: {
          model: 'Users',               // References the Users table
          key: 'user_id'                // Column in Users being referenced
        },
        onDelete: 'CASCADE',            // Delete orders if user is deleted
        onUpdate: 'CASCADE'             // Update FK if user_id changes
      },
      restaurant_id: {
        type: Sequelize.INTEGER,        // FK to Restaurants.restaurant_id
        allowNull: false,               // Required field
        references: {
          model: 'Restaurants',         // References the Restaurants table
          key: 'restaurant_id'
        },
        onDelete: 'CASCADE',            // Delete orders if restaurant is deleted
        onUpdate: 'CASCADE'
      },
      order_date: {
        type: Sequelize.DATE,           // Timestamp of order placement
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      total_amount: {
        type: Sequelize.DOUBLE,         // Total price of the order
        allowNull: false,               // Must be provided
        validate: { min: 0 }            // Should be >= 0 (model-level validation)
      },
      status: {
        type: Sequelize.STRING(50),     // Order status
        allowNull: false,
        defaultValue: 'Pending',        // Default value
      },
      payment_status: {
        type: Sequelize.STRING(50),     // Payment status
        allowNull: false,
        defaultValue: 'Pending',        // Default value
      },
      delivery_address: {
        type: Sequelize.STRING(255),    // Delivery location
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,           // Record creation timestamp
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop the Orders table if migration is rolled back
    await queryInterface.dropTable('Orders');
  }
};
