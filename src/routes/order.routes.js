'use strict';
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// USER ROUTES
router.post('/', authenticate, authorize('user'), orderController.createOrder);
router.get('/my-orders', authenticate, orderController.getMyOrders);
router.get('/user/:user_id', authenticate, orderController.getOrdersByUser);

// OWNER ROUTES
router.get('/restaurant-orders', authenticate, authorize('owner'), orderController.getRestaurantOrders);
router.put('/:order_id/status', authenticate, authorize('owner'), orderController.updateOrderStatus);

// RIDER ROUTES
router.get(
  '/pending',
  authenticate,
  authorize('rider'),
  orderController.getPendingOrders
);

// NEW: rider accepts / claims an order
router.post(
  '/:order_id/claim',
  authenticate,
  authorize('rider'),
  orderController.claimOrder
);

module.exports = router;