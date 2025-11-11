'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BlacklistedTokens extends Model {
    static associate(models) {
      // No associations needed for this table
    }
  }

  BlacklistedTokens.init({
    token_id: {
      type: DataTypes.INTEGER,    // Primary key ID
      primaryKey: true,
      autoIncrement: true
    },
    token: {
      type: DataTypes.STRING(255), // Token string (usually JWT)
      allowNull: false,
      unique: true                 // Must be unique
    },
    created_at: {
      type: DataTypes.DATE,        // Timestamp when token was blacklisted
      defaultValue: DataTypes.NOW
    },
    expires_at: {
      type: DataTypes.DATE,        // Expiration time for the token
      allowNull: false
    }
  }, {
    sequelize,                      // Sequelize instance
    modelName: 'BlacklistedTokens', // Internal model name
    tableName: 'BlacklistedTokens', // Explicit DB table name
    underscored: true,              // Use snake_case for column names
    timestamps: false,              // Disable Sequelize’s auto timestamps
    indexes: [{ fields: ['token'] }] // Optional index for faster lookups
  });

  return BlacklistedTokens;
};
