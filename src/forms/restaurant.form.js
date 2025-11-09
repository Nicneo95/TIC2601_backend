const Joi = require('joi');

/**
 * Validation schema for creating / updating a restaurant.
 * All fields match the PDF (page 2) and the Restaurants table.
 */
const restaurantSchema = Joi.object({
  name:         Joi.string().max(100).required(),
  address:      Joi.string().max(255).required(),
  phone:        Joi.string().max(20).optional(),
  cuisine_type: Joi.string().max(50).optional(),
  latitude:     Joi.number().precision(6).required(),   // e.g. 1.296600
  longitude:    Joi.number().precision(6).required(),
  description:  Joi.string().max(500).optional()
});

module.exports = { restaurantSchema };
