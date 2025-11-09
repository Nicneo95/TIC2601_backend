const Joi = require('joi');

/**
 * Validation for creating / updating a menu item.
 * Matches PDF (MenuItems table).
 */
const menuItemSchema = Joi.object({
  name:        Joi.string().max(100).required(),
  description: Joi.string().max(500).optional(),
  price:       Joi.number().positive().precision(2).required()
});

module.exports = { menuItemSchema };
