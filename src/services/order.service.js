'use strict';

const { Orders, Restaurants } = require('../models');  // adjust names if different

// -------- new code ------
/**
 * Return all orders whose status is 'Pending', including basic restaurant info
 * for rider display.
 */
async function getPendingOrders() {
  const orders = await Orders.findAll({
    where: { status: 'Pending' },
    include: [
      {
        model: Restaurants,
        attributes: ['name', 'address', 'phone', 'image_url']
      }
    ],
    order: [['order_date', 'ASC']]
  });

  // Sequelize instances → plain objects
  return orders.map(o => o.get({ plain: true }));
}
// -------- end of new code ------

// EXPORT
module.exports = {
  // -------- new code ------
  getPendingOrders,
  // -------- end of new code ------
  // ...keep any existing exports here
};