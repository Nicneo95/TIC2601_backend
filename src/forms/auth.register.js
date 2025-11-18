'use strict';
const Joi = require('joi'); // Import Joi for validation

// Alias: we store 'restaurant' as 'host' in DB
// const ROLE_ALIASES = { restaurant: 'host' };

// Define validation schema
const schema = Joi.object({
  name: Joi.string().max(100).required().messages({
    'any.required': 'Name is required',
    'string.max': 'Name must not exceed 100 characters'
  }),

  email: Joi.string().email().max(255).required().messages({
    'any.required': 'Email is required',
    'string.email': 'Invalid email format'
  }),

  password: Joi.string().min(8).max(255).required().messages({
    'any.required': 'Password is required',
    'string.min': 'Password must be at least 8 characters'
  }),

  phone: Joi.string().pattern(/^\d{10,11}$/).required().messages({
    'any.required': 'Phone is required',
    'string.pattern.base': 'Phone must be 10-11 digits'
  }),

  address: Joi.string().max(255).allow('', null),

  role: Joi.string()
    .valid('user', 'rider', 'owner')
    .default('user')
    .messages({
      'any.only': 'Role must be either user, rider or owner'
    })
});

// Validation function
module.exports = function validateRegister(body = {}) {
  // Normalize role alias
  if (body.role && ROLE_ALIASES[body.role]) {
    body.role = ROLE_ALIASES[body.role];
  }

  // Normalize email
  if (body.email) body.email = String(body.email).trim().toLowerCase();

  // Validate input
  const { value, error } = schema.validate(body, {
    abortEarly: false, // report all errors
    stripUnknown: true // remove extra fields
  });

  if (error) {
    const details = error.details.map(d => ({
      field: d.path.join('.'),
      message: d.message
    }));
    const err = new Error('Validation error');
    err.status = 400;
    err.details = details;
    throw err;
  }

  return value;
};
