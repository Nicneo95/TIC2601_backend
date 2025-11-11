'use strict';
const { Reviews, Orders, Restaurants, Users } = require('../models');


// CREATE REVIEW — only if customer ordered from restaurant
async function createReview(req, res) {
  try {
    const { restaurant_id, rating, comment } = req.body;
    const user_id = req.user.user_id;

    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Only customers can leave reviews' });
    }

    const restaurant = await Restaurants.findByPk(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const hasOrdered = await Orders.findOne({ where: { user_id, restaurant_id } });
    if (!hasOrdered) {
      return res.status(403).json({ message: 'You can only review restaurants you have ordered from' });
    }

    const existing = await Reviews.findOne({ where: { user_id, restaurant_id } });
    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this restaurant' });
    }

    const review = await Reviews.create({ user_id, restaurant_id, rating, comment });

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}


// UPDATE REVIEW — only by the same customer
async function updateReview(req, res) {
  try {
    const { review_id } = req.params;
    const { rating, comment } = req.body;

    const review = await Reviews.findByPk(review_id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (req.user.role !== 'customer' || review.user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'You can only update your own reviews' });
    }

    await review.update({ rating, comment });
    res.status(200).json({ message: 'Review updated successfully', review });
  } catch (err) {
    console.error('Error updating review:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}


// DELETE REVIEW — only by the same customer
async function deleteReview(req, res) {
  try {
    const { review_id } = req.params;

    const review = await Reviews.findByPk(review_id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (req.user.role !== 'customer' || review.user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }

    await review.destroy();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}


// GET ALL REVIEWS for a restaurant (public)
async function getReviewsByRestaurant(req, res) {
  try {
    const { restaurant_id } = req.params;

    const reviews = await Reviews.findAll({
      where: { restaurant_id },
      include: [
        { model: Users, attributes: ['name', 'email'] },
        { model: Restaurants, attributes: ['name'] }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      message: 'Reviews fetched successfully',
      total_reviews: reviews.length,
      reviews
    });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}


// Export all controller functions
module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getReviewsByRestaurant
};
