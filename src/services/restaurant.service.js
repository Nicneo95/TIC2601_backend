'use strict';  
// Use strict mode for better JS safety and performance.

const { Sequelize } = require('sequelize');  
// Import Sequelize to use raw SQL and operators.

const { Restaurants, Reviews} = require('../models');  
// Import your models — we'll use Restaurants and Reviews.

const { geocodeAddress } = require('../utils/geocode');  
// Import the geocoding helper for address → lat/lng conversion.

const EARTH_RADIUS_KM = 6371;  
// Earth's radius in kilometers (used for Haversine formula).
// You can switch to 3959 for miles if needed.

// CREATE Restaurant — only host or admin allowed
async function createRestaurant(user, payload) {
  // Only 'host' or 'admin' can create a restaurant.
  if (user.role !== 'owner') {
    const err = new Error('Only owners can create restaurants');
    err.status = 403;
    throw err;
  }

  // If user didn’t provide latitude/longitude, try to geocode the address.
  // if (!payload.latitude || !payload.longitude) {
  //   const coords = await geocodeAddress(payload.address);

  //   // If no coordinates found, stop with an error.
  //   if (!coords) {
  //     const err = new Error('Unable to fetch coordinates for this address');
  //     err.status = 400;
  //     throw err;
  //   }

  //   // Set lat/lng automatically.
  //   payload.latitude = coords.lat;
  //   payload.longitude = coords.lng;
  // }

  // Save restaurant in DB with owner (user_id).
  const restaurant = await Restaurants.create({
    user_id: user.id || user.user_id,
    ...payload
  });

  // Return a clean, plain object version of the record.
  return restaurant.get({ plain: true });
}

// UPDATE Restaurant — host (own) or admin can update
async function updateRestaurant(user, restaurantId, payload) {
  // Find the restaurant by ID
  const restaurant = await Restaurants.findByPk(restaurantId);
  if (!restaurant) {
    const err = new Error('Restaurant not found');
    err.status = 404;
    throw err;
  }

  // If not admin, make sure the user owns this restaurant.
  if (user.role !== 'owner' && restaurant.user_id !== (user.id || user.user_id)) {
    const err = new Error('Forbidden: you can only update your own restaurant');
    err.status = 403;
    throw err;
  }

  // If address changes and no coords given, automatically re-geocode.
  // if (payload.address && (!payload.latitude || !payload.longitude)) {
  //   const coords = await geocodeAddress(payload.address);
  //   if (coords) {
  //     payload.latitude = coords.lat;
  //     payload.longitude = coords.lng;
  //   }
  // }

  // Update the restaurant fields in the database.
  await restaurant.update(payload);

  return restaurant.get({ plain: true });
}

// GET ALL Restaurants — supports filters and nearby search
async function getAllRestaurants(query = {}) {
  const { cuisine_type, sort, lat, lng, maxDistance } = query;
  const where = {};

  // Apply case-insensitive exact match for cuisine type
  if (cuisine_type) {
    where[Sequelize.Op.and] = Sequelize.where(
      Sequelize.fn('lower', Sequelize.col('Restaurants.cuisine_type')),
      Sequelize.fn('lower', cuisine_type.trim())
    );
  }

  const options = {
    where,
    include: [],
    attributes: {
      include: []
    },
    subQuery: false, // Important — force WHERE to apply on Restaurants
    group: ['Restaurants.restaurant_id'] // required when using aggregations or literals
  };

  // 🧭 Distance calculation (optional)
  // if (lat && lng) {
  //   const latNum = parseFloat(lat);
  //   const lngNum = parseFloat(lng);

  //   options.attributes.include.push([
  //     sequelize.literal(`
  //       ${EARTH_RADIUS_KM} * acos(
  //         cos(radians(${latNum})) *
  //         cos(radians(latitude)) *
  //         cos(radians(longitude) - radians(${lngNum})) +
  //         sin(radians(${latNum})) *
  //         sin(radians(latitude))
  //       )
  //     `),
  //     'distance_km'
  //   ]);

  //   if (maxDistance) {
  //     options.having = sequelize.literal(`distance_km <= ${parseFloat(maxDistance)}`);
  //   }
  // }

  // Sorting logic
  if (sort === 'reviews') {
    options.order = [
      [
        sequelize.literal(
          '(SELECT COUNT(*) FROM Reviews WHERE Reviews.restaurant_id = Restaurants.restaurant_id)'
        ),
        'DESC'
      ]
    ];
  } else if (lat && lng) {
    options.order = [[sequelize.literal('distance_km'), 'ASC']];
  } else {
    options.order = [['created_at', 'DESC']];
  }

  console.log('WHERE FILTER APPLIED:', where);
  const restaurants = await Restaurants.findAll({ ...options, logging: console.log });

  return restaurants;
}

// GET SINGLE Restaurant by ID
async function getRestaurantById(id) {
  // Fetch restaurant and include its reviews (rating, comment, etc.)
  return await Restaurants.findByPk(id, {
    include: [
      {
        model: Reviews,
        attributes: ['rating', 'comment', 'created_at']
      }
    ]
  });
}

// DELETE Restaurant — admin only
async function deleteRestaurant(user, restaurantId) {
  // Only admin can delete.
  if (user.role !== 'admin') {
    const err = new Error('Only admins can delete restaurants');
    err.status = 403;
    throw err;
  }

  // Check if restaurant exists.
  const restaurant = await Restaurants.findByPk(restaurantId);
  if (!restaurant) {
    const err = new Error('Restaurant not found');
    err.status = 404;
    throw err;
  }

  // Permanently delete restaurant.
  await restaurant.destroy();
  return { message: 'Restaurant deleted successfully' };
}

// EXPORT all service functions
module.exports = {
  createRestaurant,
  updateRestaurant,
  getAllRestaurants,
  getRestaurantById,
  deleteRestaurant
};
