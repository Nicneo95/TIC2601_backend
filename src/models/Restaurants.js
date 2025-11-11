'use strict';
// Enable strict mode for safer, cleaner JavaScript.

const { Model } = require('sequelize');
// Import Sequelize's base Model class to extend.

module.exports = (sequelize, DataTypes) => {
// Export a function that defines the Restaurants model using the provided
// Sequelize instance and the available DataTypes.

  class Restaurants extends Model {
    // Define the Restaurants class which extends Sequelize's Model.
    // Custom methods and associations live here.

    static associate(models) {
      // Define relationships between models. This is called by Sequelize after all models load.

      Restaurants.belongsTo(models.Users, { foreignKey: 'user_id' });
      // Each restaurant is owned by a single User (the host).
      // Adds a foreign key column `user_id` pointing to Users.

      Restaurants.hasMany(models.MenuItems, { foreignKey: 'restaurant_id', onDelete: 'CASCADE' });
      // A restaurant can have many menu items.
      // If the restaurant is deleted, its menu items are deleted too.

      Restaurants.hasMany(models.Orders, { foreignKey: 'restaurant_id', onDelete: 'CASCADE' });
      // A restaurant can have many orders.
      // Deleting the restaurant cascades and deletes related orders.

      Restaurants.hasMany(models.Reviews, { foreignKey: 'restaurant_id', onDelete: 'CASCADE' });
      // A restaurant can have many reviews.
      // Deleting the restaurant deletes its reviews as well.
    }
  }

  Restaurants.init({
    // Define the table schema (columns and constraints).

    restaurant_id: {
      type: DataTypes.INTEGER,   // Integer column type.
      primaryKey: true,          // Primary key of the table.
      autoIncrement: true        // Auto-increment on insert.
    },

    user_id: {
      type: DataTypes.INTEGER,   // Links to Users.user_id (owner/host).
      allowNull: false           // Must be present (a restaurant must have an owner).
      // (Optionally add references: { model: 'Users', key: 'user_id' } in migrations for FK constraint)
    },

    name: {
      type: DataTypes.STRING(100), // Restaurant name up to 100 chars.
      allowNull: false             // Required.
    },

    address: {
      type: DataTypes.STRING(255), // Street address up to 255 chars.
      allowNull: false             // Required.
    },

    phone: {
      type: DataTypes.STRING(11),  // Phone number stored as string (leading zeros safe).
      allowNull: false             // Required.
      // (You can add validate: { isNumeric: true, len: [10, 11] } if helpful)
    },

    cuisine_type: DataTypes.STRING(50),
    // Optional simple text label for cuisine (e.g., 'Italian').

    latitude: {
      type: DataTypes.DOUBLE,      // Latitude as floating-point.
      allowNull: true             // Required to locate the restaurant.
      // (Optionally: validate: { min: -90, max: 90 })
    },

    longitude: {
      type: DataTypes.DOUBLE,      // Longitude as floating-point.
      allowNull: true             // Required to locate the restaurant.
      // (Optionally: validate: { min: -180, max: 180 })
    },

    image_url: {
      type: DataTypes.STRING,
      allowNull: true
    },

    description: DataTypes.STRING(500)
    // Optional description/bio up to 500 chars.
  }, {
    sequelize,                // Attach to the provided Sequelize instance.
    modelName: 'Restaurants', // Internal model name used by Sequelize.
    tableName: 'Restaurants', // Explicit DB table name.
    underscored: true,        // Use snake_case column names (created_at, updated_at).
    timestamps: true          // Auto-manage created_at and updated_at timestamps.
  });

  return Restaurants;
  // Return the model so the caller can use it and Sequelize can register it.
};
