'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Creates the Users table
    await queryInterface.createTable('Users', {
      user_id: {
        type: Sequelize.INTEGER,      // Primary key: integer
        autoIncrement: true,          // Auto-increment for new records
        primaryKey: true              // Marks as primary key
      },
      name: {
        type: Sequelize.STRING(100),  // Max 100 characters
        allowNull: false              // Required field
      },
      email: {
        type: Sequelize.STRING(255),  // Max 255 characters
        allowNull: false,             // Required
        unique: true,                 // Must be unique
        validate: { isEmail: true }   // Validates proper email format
      },
      password: {
        type: Sequelize.STRING(255),  // Stores the hashed password
        allowNull: false              // Required
      },
      address: {
        type: Sequelize.STRING(255),  // Optional address field
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING(11),   // Up to 11 digits
        allowNull: false              // Required
      },
      role: {
        type: Sequelize.ENUM('customer', 'host', 'admin'), // Only these roles allowed
        defaultValue: 'customer',       // Default value
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        // Automatically set creation time
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        // Automatically set last update time
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Drops the Users table if rolled back
    await queryInterface.dropTable('Users');
  }
};
