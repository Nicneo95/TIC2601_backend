'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OrderDetails.init({
    order_id: DataTypes.INTEGER,
    item_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    unit_price: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'OrderDetails',
  });
  return OrderDetails;
};