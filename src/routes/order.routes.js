'use strict';
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');


// CUSTOMER ROUTES
// router.post('/', authenticate, authorize('customer'), orderController.createOrder);
// router.get('/my-orders', authenticate, authorize('customer'), orderController.getMyOrders);

router.post('/', authenticate, authorize('user'), orderController.createOrder);
router.get('/my-orders', authenticate, authorize('user'), orderController.getMyOrders);

// HOST / ADMIN ROUTES
router.get('/restaurant-orders', authenticate, authorize('owner'), orderController.getRestaurantOrders);
router.put('/:order_id/status', authenticate, authorize('owner'), orderController.updateOrderStatus);


module.exports = router;
