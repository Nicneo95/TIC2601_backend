'use strict';
const { Orders, OrderDetails, MenuItems, Restaurants, Users } = require('../models');

// CUSTOMER — Place an Order
async function createOrder(req, res) {
  const transaction = await Orders.sequelize.transaction(); // Start transaction
  try {
    const { restaurant_id, delivery_address, items } = req.body;

    // Check: Only customers can place orders
    if (req.user.role !== 'user') {
      return res.status(403).json({ message: 'Only customers can place orders' });
    }

    // Validate inputs
    if (!restaurant_id || !delivery_address || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'Restaurant, delivery address, and at least one menu item are required'
      });
    }

    // Verify restaurant exists
    const restaurant = await Restaurants.findByPk(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Validate items belong to the restaurant and calculate total
    let totalAmount = 0;
    const validItems = [];

    for (const item of items) {
      const menuItem = await MenuItems.findOne({
        where: { item_id: item.item_id, restaurant_id }
      });

      if (!menuItem) {
        await transaction.rollback();
        return res.status(400).json({
          message: `Menu item ID ${item.item_id} does not belong to restaurant ${restaurant_id}`
        });
      }

      const quantity = item.quantity > 0 ? item.quantity : 1;
      const unit_price = menuItem.price;

      totalAmount += quantity * unit_price;

      validItems.push({
        item_id: item.item_id,
        quantity,
        unit_price
      });
    }

    // Create the Order (matches your Orders table schema)
    const newOrder = await Orders.create({
      user_id: req.user.user_id,
      restaurant_id,
      order_date: new Date(),
      total_amount: totalAmount,
      status: 'Pending',
      payment_status: 'Pending',
      delivery_address,
      created_at: new Date()
    }, { transaction });

    // Create OrderDetails for each item
    for (const item of validItems) {
      await OrderDetails.create({
        order_id: newOrder.order_id,
        item_id: item.item_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        created_at: new Date()
      }, { transaction });
    }

    // Commit the transaction
    await transaction.commit();

    return res.status(201).json({
      message: 'Order placed successfully',
      order_id: newOrder.order_id,
      total_amount: totalAmount,
      items: validItems
    });
  } catch (err) {
    await transaction.rollback();
    console.error('Error placing order:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}


// CUSTOMER — View My Orders
async function getMyOrders(req, res) {
  try {
    const orders = await Orders.findAll({
      where: { user_id: req.user.user_id },
      include: [
        {
          model: OrderDetails,
          include: [{ model: MenuItems, attributes: ['name', 'price'] }]
        },
        {
          model: Restaurants,
          attributes: ['name', 'address']
        }
      ],
      order: [['order_date', 'DESC']]
    });

    res.status(200).json({
      message: 'My orders fetched successfully',
      total_orders: orders.length,
      orders
    });
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}


// HOST — View all orders for their restaurant(s)
async function getRestaurantOrders(req, res) {
  try {
    // If host, fetch only their own restaurant’s orders
    let whereCondition = {};

    if (req.user.role === 'owner') {
      const restaurant = await Restaurants.findOne({
        where: { user_id: req.user.user_id }
      });

      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found for this host' });
      }

      whereCondition = { restaurant_id: restaurant.restaurant_id };
    }

    // If admin, show all restaurant orders
    const orders = await Orders.findAll({
      where: whereCondition,
      include: [
        {
          model: OrderDetails,
          include: [{ model: MenuItems, attributes: ['name', 'price'] }]
        },
        {
          model: Restaurants,
          attributes: ['name', 'address']
        },
        {
          model: Users, // customer who placed the order
          attributes: ['name', 'email']
        }
      ],
      order: [['order_date', 'DESC']]
    });

    res.status(200).json({
      message: 'Restaurant orders fetched successfully',
      total_orders: orders.length,
      orders
    });
  } catch (err) {
    console.error('Error fetching restaurant orders:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}


// -------- NEW CODE: Rider – get pending orders --------
async function getPendingOrders(req, res) {
  try {
    const orders = await Orders.findAll({
      where: { status: 'Pending' },          // only unclaimed orders
      include: [
        {
          model: Restaurants,
          attributes: ['name', 'address', 'phone', 'image_url']
        }
      ],
      order: [['order_date', 'ASC']]
    });

    return res.status(200).json({
      message: 'Pending orders fetched successfully',
      total_orders: orders.length,
      orders
    });
  } catch (err) {
    console.error('Error fetching pending orders:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}
// -------- END NEW CODE --------


// HOST — Update order status (Preparing → Delivered)
async function updateOrderStatus(req, res) {
  try {
    const { order_id } = req.params;
    const { status } = req.body;

    // Validate allowed statuses
    const allowedStatuses = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` });
    }

    // Fetch the order
    const order = await Orders.findByPk(order_id, {
      include: [{ model: Restaurants, attributes: ['restaurant_id', 'user_id', 'name'] }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // If host, verify the order belongs to their restaurant
    if (req.user.role === 'owner') {
      const restaurant = await Restaurants.findOne({ where: { user_id: req.user.user_id } });
      if (!restaurant || restaurant.restaurant_id !== order.restaurant_id) {
        return res.status(403).json({ message: 'You can only update orders for your own restaurant' });
      }
    }

    // Update order status
    order.status = status;
    await order.save();

    res.status(200).json({
      message: `Order status updated to ${status}`,
      order: {
        id: order.order_id,
        restaurant: order.Restaurant?.name,
        status: order.status,
        updated_at: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}


// -------- NEW CODE: Rider – claim / accept an order --------
async function claimOrder(req, res) {
  try {
    const { order_id } = req.params;

    if (req.user.role !== 'rider') {
      return res.status(403).json({ message: 'Only riders can accept orders' });
    }

    const order = await Orders.findByPk(order_id, {
      include: [
        {
          model: Restaurants,
          attributes: ['name', 'address', 'phone', 'image_url']
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({
        message: 'Order is not pending. It may have been accepted by another rider.'
      });
    }

    // If you add a rider_id column later, set it here:
    // order.rider_id = req.user.user_id;

    order.status = 'Preparing';  // or 'Assigned' if you extend allowedStatuses
    await order.save();

    return res.status(200).json({
      message: 'Order claimed successfully',
      order
    });
  } catch (err) {
    console.error('Error claiming order:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}
// -------- END NEW CODE --------


// Export all controller functions
module.exports = {
  createOrder,
  getMyOrders,
  getRestaurantOrders,
  updateOrderStatus,
  getPendingOrders,   // NEW
  claimOrder          // NEW
};