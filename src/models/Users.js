'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      Users.hasMany(models.Restaurants, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      Users.hasMany(models.Orders, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      Users.hasMany(models.Reviews, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    }

    async validPassword(pwd) {
      return await bcrypt.compare(pwd, this.password);
    }
  }

  Users.init({
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name:    { type: DataTypes.STRING(100), allowNull: false },
    email:   { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password:{ type: DataTypes.STRING(255), allowNull: false },
    address: DataTypes.STRING(255),
    phone:   DataTypes.STRING(20),
    role:    { type: DataTypes.ENUM('customer','host','admin'), defaultValue: 'customer' }
  }, {
    sequelize,
    modelName: 'Users',
    hooks: {
      beforeCreate: async u => { u.password = await bcrypt.hash(u.password, 10); },
      beforeUpdate: async u => { if (u.changed('password')) u.password = await bcrypt.hash(u.password, 10); }
    }
  });

  return Users;
};
