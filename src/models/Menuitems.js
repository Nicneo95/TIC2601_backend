'use strict'; 
// Enable strict mode for safer JavaScript (catches common mistakes).

const { Model } = require('sequelize'); 
// Import Sequelize's base Model class to extend from.

module.exports = (sequelize, DataTypes) => { 
  // Export a function that defines the model using the provided Sequelize instance and DataTypes.

  class MenuItems extends Model { 
    // Declare the MenuItems class which extends Sequelize's Model (for associations & custom methods).

    static associate(models) { 
      // Define relationships between this model and others. Called automatically by models/index.

      MenuItems.belongsTo(models.Restaurants, { 
        // Each menu item belongs to a single restaurant (many-to-one).
        foreignKey: 'restaurant_id',   // The FK column on MenuItems that links to Restaurants.
        onDelete: 'CASCADE',           // If the restaurant is deleted, delete its menu items.
        onUpdate: 'CASCADE'            // If the restaurant’s PK changes, update FK values here.
      });

      MenuItems.hasMany(models.OrderDetails, { 
        // A menu item can appear in many order details (one-to-many).
        foreignKey: 'item_id',         // The FK column on OrderDetails that links to MenuItems.
        onDelete: 'CASCADE',           // If a menu item is deleted, delete its order details.
        onUpdate: 'CASCADE'            // If this PK changes, update related FKs in OrderDetails.
      });
    }
  }

  MenuItems.init({ 
    // Define table columns and their constraints.

    item_id: { 
      type: DataTypes.INTEGER,        // Integer type for the primary key.
      primaryKey: true,               // Marks this column as the primary key.
      autoIncrement: true             // Auto-increment on insert (1, 2, 3, ...).
    },

    restaurant_id: { 
      type: DataTypes.INTEGER,        // Foreign key to Restaurants.restaurant_id.
      allowNull: false                // Required: every menu item must belong to a restaurant.
      // (FK constraint is typically enforced in the migration with `references`.)
    },

    name: { 
      type: DataTypes.STRING(100),    // Item name, max length 100.
      allowNull: false                // Required field.
    },

    description: { 
      type: DataTypes.STRING(600)     // Optional description, up to 600 characters.
    },

    price: { 
      type: DataTypes.DOUBLE,         // Price stored as a floating number.
      allowNull: false,               // Required field.
      validate: { 
        min: 0                        // Enforces price >= 0 (mirrors SQL CHECK).
      }
    },
    
    image_url: {
      type: DataTypes.STRING,
      allowNull: true
    },

    created_at: { 
      type: DataTypes.DATE,           // Timestamp column.
      defaultValue: DataTypes.NOW     // Defaults to CURRENT_TIMESTAMP when inserted.
    }
  }, { 
    sequelize,                         // Attach to the provided Sequelize instance.
    modelName: 'MenuItems',            // Internal model name used by Sequelize.
    tableName: 'MenuItems',            // Explicit DB table name (avoids pluralization issues).
    underscored: true,                 // Use snake_case column names (created_at, etc.).
    timestamps: false                  // Disable auto createdAt/updatedAt (we define created_at manually).
  });

  return MenuItems; 
  // Return the defined model so Sequelize can register and use it.
};
