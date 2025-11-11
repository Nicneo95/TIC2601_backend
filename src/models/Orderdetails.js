'use strict';
// Enable strict mode for cleaner JavaScript behavior.

const { Model } = require('sequelize');
// Import Sequelize's base Model class for defining models.

module.exports = (sequelize, DataTypes) => {
  // Export a function that defines the OrderDetails model.

  class OrderDetails extends Model {
    // Define the class extending Sequelize's Model.

    static associate(models) {
      // Define model relationships.

      // Each OrderDetail belongs to one Order.
      OrderDetails.belongsTo(models.Orders, {
        foreignKey: 'order_id',   // FK referencing Orders.order_id.
        onDelete: 'CASCADE'       // Delete order details if the order is deleted.
      });

      // Each OrderDetail belongs to one MenuItem.
      OrderDetails.belongsTo(models.MenuItems, {
        foreignKey: 'item_id',    // FK referencing MenuItems.item_id.
        onDelete: 'CASCADE'       // Delete order details if the menu item is deleted.
      });
    }
  }

  // Initialize the model (table structure)
  OrderDetails.init({
    detail_id: {
      type: DataTypes.INTEGER,   // Primary key for this table.
      primaryKey: true,
      autoIncrement: true        // Auto-incrementing ID.
    },
    order_id: {
      type: DataTypes.INTEGER,   // FK to Orders table.
      allowNull: false           // Required.
    },
    item_id: {
      type: DataTypes.INTEGER,   // FK to MenuItems table.
      allowNull: false           // Required.
    },
    quantity: {
      type: DataTypes.INTEGER,   // Number of units ordered.
      allowNull: false,
      validate: { min: 1 }       // Must be greater than 0.
    },
    unit_price: {
      type: DataTypes.DOUBLE,    // Price per item at the time of order.
      allowNull: false,
      validate: { min: 0 }       // Must be non-negative.
    },
    created_at: {
      type: DataTypes.DATE,      // Timestamp when record was created.
      defaultValue: DataTypes.NOW // Defaults to current time.
    }
  }, {
    sequelize,                   // Sequelize instance (connection).
    modelName: 'OrderDetails',   // Internal model name.
    tableName: 'OrderDetails',   // Explicit table name.
    underscored: true,           // Use snake_case for columns (created_at).
    timestamps: false            // Disable Sequelize auto timestamps (no updated_at).
  });

  return OrderDetails;           // Return model for use elsewhere.
};
