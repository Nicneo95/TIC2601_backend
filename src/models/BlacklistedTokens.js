'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BlacklistedTokens extends Model {
    static associate(models) {
      // no associations
    }
  }

  BlacklistedTokens.init({
    token: { type: DataTypes.TEXT, allowNull: false, unique: true },
    expires_at: { type: DataTypes.DATE, allowNull: false }
  }, {
    sequelize,
    modelName: 'BlacklistedTokens',
    indexes: [{ fields: ['token'] }]
  });

  return BlacklistedTokens;
};
