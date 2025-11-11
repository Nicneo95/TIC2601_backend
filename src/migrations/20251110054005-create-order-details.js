'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the OrderDetails table
    await queryInterface.createTable('OrderDetails', {
      detail_id: {
        type: Sequelize.INTEGER,       // Primary key
        autoIncrement: true,           // Auto-increment for each new record
        primaryKey: true               // Marks this column as the primary key
      },
      order_id: {
        type: Sequelize.INTEGER,       // FK referencing Orders.order_id
        allowNull: false,              // Must have an associated order
        references: {
          model: 'Orders',             // Table being referenced
          key: 'order_id'              // Column in Orders table
        },
        onDelete: 'CASCADE',           // Delete details if order is deleted
        onUpdate: 'CASCADE'            // Update FK if order_id changes
      },
      item_id: {
        type: Sequelize.INTEGER,       // FK referencing MenuItems.item_id
        allowNull: false,              // Must have an associated menu item
        references: {
          model: 'MenuItems',          // Table being referenced
          key: 'item_id'               // Column in MenuItems table
        },
        onDelete: 'CASCADE',           // Delete if the menu item is deleted
        onUpdate: 'CASCADE'            // Update if item_id changes
      },
      quantity: {
        type: Sequelize.INTEGER,       // Number of items ordered
        allowNull: false,
        validate: { min: 1 }           // Should be greater than 0
      },
      unit_price: {
        type: Sequelize.DOUBLE,        // Price per item at order time
        allowNull: false,
        validate: { min: 0 }           // Must be non-negative
      },
      created_at: {
        allowNull: false,              // Required timestamp
        type: Sequelize.DATE,          // Date/time of creation
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop the OrderDetails table when rolling back the migration
    await queryInterface.dropTable('OrderDetails');
  }
};
