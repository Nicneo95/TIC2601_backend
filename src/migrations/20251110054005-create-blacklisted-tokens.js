'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the BlacklistedTokens table
    await queryInterface.createTable('BlacklistedTokens', {
      token_id: {
        type: Sequelize.INTEGER,        // Primary key
        autoIncrement: true,            // Auto-increment for new entries
        primaryKey: true                // Marks as primary key
      },
      token: {
        type: Sequelize.STRING(255),    // Token string (e.g., JWT)
        allowNull: false,               // Must be provided
        unique: true                    // Must be unique (no duplicate tokens)
      },
      created_at: {
        allowNull: true,               // Always has a timestamp
        type: Sequelize.DATE,           // Timestamp of blacklisting
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      expires_at: {
        allowNull: true,               // Expiration must be defined
        type: Sequelize.DATE            // Expiry timestamp for token
      }
    });

    // Add an index on the token column for faster lookups
    await queryInterface.addIndex('BlacklistedTokens', ['token']);
  },

  async down(queryInterface, Sequelize) {
    // Drop the table if migration is rolled back
    await queryInterface.dropTable('BlacklistedTokens');
  }
};
