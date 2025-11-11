'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the Reviews table
    await queryInterface.createTable('Reviews', {
      review_id: {
        type: Sequelize.INTEGER,         // Primary key
        autoIncrement: true,             // Auto-increment for each review
        primaryKey: true                 // Marks as PK
      },
      user_id: {
        type: Sequelize.INTEGER,         // FK referencing Users.user_id
        allowNull: false,                // Each review must belong to a user
        references: {
          model: 'Users',                // Table being referenced
          key: 'user_id'                 // Column in Users
        },
        onDelete: 'CASCADE',             // Delete review if user is deleted
        onUpdate: 'CASCADE'              // Update user_id if changed
      },
      restaurant_id: {
        type: Sequelize.INTEGER,         // FK referencing Restaurants.restaurant_id
        allowNull: false,                // Each review must belong to a restaurant
        references: {
          model: 'Restaurants',          // Table being referenced
          key: 'restaurant_id'           // Column in Restaurants
        },
        onDelete: 'CASCADE',             // Delete reviews if restaurant is deleted
        onUpdate: 'CASCADE'              // Update if restaurant_id changes
      },
      rating: {
        type: Sequelize.INTEGER,         // Rating value (1–5)
        allowNull: false,                // Required field
        validate: { min: 1, max: 5 }     // Validation constraint
      },
      comment: {
        type: Sequelize.STRING(500),     // Optional text comment
        allowNull: true
      },
      created_at: {
        allowNull: false,                // Always has a timestamp
        type: Sequelize.DATE,            // Timestamp for creation
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // Defaults to now
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop the Reviews table if the migration is rolled back
    await queryInterface.dropTable('Reviews');
  }
};
