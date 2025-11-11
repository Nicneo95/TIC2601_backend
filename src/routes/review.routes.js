'use strict';
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// PUBLIC: view reviews for a restaurant
router.get('/:restaurant_id', reviewController.getReviewsByRestaurant);

// CUSTOMER: create, update, delete own reviews
router.post('/', authenticate, authorize('customer'), reviewController.createReview);
router.put('/:review_id', authenticate, authorize('customer'), reviewController.updateReview);
router.delete('/:review_id', authenticate, authorize('customer'), reviewController.deleteReview);

module.exports = router;
