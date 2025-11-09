const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().max(100).required(),
  email: Joi.string().email().max(255).required(),
  password: Joi.string().min(6).required(),
  address: Joi.string().max(255).optional(),
  phone: Joi.string().max(20).optional(),
  role: Joi.string().valid('customer', 'host', 'admin').default('customer')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = { registerSchema, loginSchema };
