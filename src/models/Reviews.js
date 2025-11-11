'use strict';
// Enable strict mode for better error checking.

const { Model } = require('sequelize');
// Import Sequelize's base Model class.

module.exports = (sequelize, DataTypes) => {
  class Reviews extends Model {
    // Define relationships between models.
    static associate(models) {
      // A review belongs to one user (the reviewer)
      Reviews.belongsTo(models.Users, {
        foreignKey: 'user_id',   // FK linking to Users.user_id
        onDelete: 'CASCADE',     // Delete reviews if user is deleted
        onUpdate: 'CASCADE'      // Update user_id if it changes
      });

      // A review belongs to one restaurant
      Reviews.belongsTo(models.Restaurants, {
        foreignKey: 'restaurant_id',  // FK linking to Restaurants.restaurant_id
        onDelete: 'CASCADE',          // Delete reviews if restaurant is deleted
        onUpdate: 'CASCADE'
      });
    }
  }

  // Define model structure
  Reviews.init({
    review_id: {
      type: DataTypes.INTEGER,   // Primary key for the table
      primaryKey: true,
      autoIncrement: true        // Auto-increment new IDs
    },
    user_id: {
      type: DataTypes.INTEGER,   // FK to Users table
      allowNull: false
    },
    restaurant_id: {
      type: DataTypes.INTEGER,   // FK to Restaurants table
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,   // Rating value between 1 and 5
      allowNull: false,
      validate: { min: 1, max: 5 }  // Enforce valid range
    },
    comment: {
      type: DataTypes.STRING(500) // Optional text review
    },
    created_at: {
      type: DataTypes.DATE,      // Timestamp when review is created
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,                   // Sequelize instance
    modelName: 'Reviews',        // Internal model name
    tableName: 'Reviews',        // Explicit DB table name
    underscored: true,           // Use snake_case for DB fields
    timestamps: false            // Disable auto createdAt/updatedAt
  });

  return Reviews; // Return the defined model
};
