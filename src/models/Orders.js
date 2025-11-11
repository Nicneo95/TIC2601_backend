'use strict';
// Enables strict mode to catch common JavaScript mistakes.

const { Model } = require('sequelize');
// Import Sequelize's base Model class to extend when defining the model.

module.exports = (sequelize, DataTypes) => {
  // Export a function that defines the Orders model.
  // Sequelize automatically injects the `sequelize` instance and `DataTypes`.

  class Orders extends Model {
    // Define the Orders class which extends Sequelize's Model.
    // This lets you define associations and custom instance/static methods.

    static associate(models) {
      // Define relationships between this model and others.
      // This method is automatically called by Sequelize.

      Orders.belongsTo(models.Users, {
        // Each order belongs to one user (the customer who placed it).
        foreignKey: 'user_id',   // The column in Orders that links to Users.
        onDelete: 'CASCADE'      // If the user is deleted, delete their orders.
      });

      Orders.belongsTo(models.Restaurants, {
        // Each order belongs to one restaurant (the one fulfilling it).
        foreignKey: 'restaurant_id', // The column linking to Restaurants.
        onDelete: 'CASCADE'          // If the restaurant is deleted, delete related orders.
      });

      Orders.hasMany(models.OrderDetails, {
        // One order can contain multiple order details (individual items).
        foreignKey: 'order_id', // Foreign key in OrderDetails referencing Orders.
        onDelete: 'CASCADE'     // If order is deleted, its details are deleted too.
      });
    }
  }

  // Define the Orders table schema and configurations.
  Orders.init({
    order_id: {
      type: DataTypes.INTEGER,    // Integer type for unique order identifier.
      primaryKey: true,           // Set as primary key.
      autoIncrement: true         // Auto-increment new records (1, 2, 3, ...).
    },

    user_id: {
      type: DataTypes.INTEGER,    // Foreign key to Users.user_id.
      allowNull: false            // Required — every order must belong to a user.
    },

    restaurant_id: {
      type: DataTypes.INTEGER,    // Foreign key to Restaurants.restaurant_id.
      allowNull: false            // Required — every order must be from a restaurant.
    },

    order_date: {
      type: DataTypes.DATE,       // Date/time when the order was placed.
      defaultValue: DataTypes.NOW // Defaults to current timestamp if not provided.
    },

    total_amount: {
      type: DataTypes.DOUBLE,     // Total cost of the order.
      allowNull: false,           // Must always have a total amount.
      validate: { min: 0 }        // Enforces total_amount >= 0.
    },

    status: {
      type: DataTypes.STRING(50), // Status text (e.g., 'Pending', 'Delivered').
      allowNull: false,           // Must always have a status.
      defaultValue: 'Pending',    // Defaults to 'Pending'.
      validate: {
        // Restrict values to these valid statuses.
        isIn: [['Pending', 'Preparing', 'Shipped', 'Delivered', 'Cancelled']]
      }
    },

    payment_status: {
      type: DataTypes.STRING(50), // Payment state (e.g., 'Pending', 'Completed').
      allowNull: false,
      defaultValue: 'Pending',    // Defaults to 'Pending' on creation.
      validate: {
        // Restrict to only these values.
        isIn: [['Pending', 'Completed', 'Failed']]
      }
    },

    delivery_address: {
      type: DataTypes.STRING(255), // Where the order is delivered.
      allowNull: false             // Required — can’t have an order without address.
    },

    created_at: {
      type: DataTypes.DATE,        // Timestamp for when the order was created.
      defaultValue: DataTypes.NOW  // Defaults to current timestamp.
    }

  }, {
    sequelize,                     // Sequelize instance (database connection).
    modelName: 'Orders',           // Internal name used by Sequelize.
    tableName: 'Orders',           // Explicit table name in the database.
    underscored: true,             // Converts camelCase → snake_case in DB columns.
    timestamps: false              // Disable Sequelize’s auto createdAt/updatedAt.
  });

  return Orders;
  // Return the defined model so Sequelize can use it.
};
