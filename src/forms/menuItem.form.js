'use strict';

const Joi = require('joi');

// Schema for creating a menu item
const createMenuItemSchema = Joi.object({
  name: Joi.string().max(100).required()
    .messages({
      'any.required': 'Menu item name is required',
      'string.empty': 'Menu item name cannot be empty'
    }),

  description: Joi.string().max(600).optional()
    .messages({
      'string.max': 'Description cannot exceed 600 characters'
    }),

  price: Joi.number().min(0).required()
    .messages({
      'any.required': 'Price is required',
      'number.min': 'Price must be greater than or equal to 0'
    })
});

// Schema for updating a menu item (all optional)
const updateMenuItemSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  description: Joi.string().max(600).optional(),
  price: Joi.number().min(0).optional()
}).or('name', 'description', 'price'); // Require at least one field to update

module.exports = {
  validateMenuItemCreate(body = {}) {
    const { value, error } = createMenuItemSchema.validate(body, { abortEarly: false });
    if (error) {
      const details = error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }));
      const err = new Error('Validation failed');
      err.status = 400;
      err.details = details;
      throw err;
    }
    return value;
  },

  validateMenuItemUpdate(body = {}) {
    const { value, error } = updateMenuItemSchema.validate(body, { abortEarly: false });
    if (error) {
      const details = error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }));
      const err = new Error('Validation failed');
      err.status = 400;
      err.details = details;
      throw err;
    }
    return value;
  }
};
