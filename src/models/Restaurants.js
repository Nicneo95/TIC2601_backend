'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Restaurants extends Model {
    static associate(models) {
      Restaurants.belongsTo(models.Users, { foreignKey: 'user_id' });
      Restaurants.hasMany(models.MenuItems, { foreignKey: 'restaurant_id', onDelete: 'CASCADE' });
      Restaurants.hasMany(models.Orders, { foreignKey: 'restaurant_id', onDelete: 'CASCADE' });
      Restaurants.hasMany(models.Reviews, { foreignKey: 'restaurant_id', onDelete: 'CASCADE' });
    }
  }

  Restaurants.init({
    restaurant_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone: DataTypes.STRING(20),
    cuisine_type: DataTypes.STRING(50),
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    description: DataTypes.STRING(500)
  }, {
    sequelize,
    modelName: 'Restaurants',
    tableName: 'Restaurants',
    underscored: true,
    timestamps: true
  });

  return Restaurants;
};
