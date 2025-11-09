'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Orders.init({
    user_id: DataTypes.INTEGER,
    restaurant_id: DataTypes.INTEGER,
    total_amount: DataTypes.DOUBLE,
    status: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    delivery_address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Orders',
  });
  return Orders;
};