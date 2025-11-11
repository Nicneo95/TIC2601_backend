'use strict';  
// Enforces strict mode for cleaner JavaScript (helps catch errors).

const Joi = require('joi');  
// Import Joi library for input validation.

const createRestaurantSchema = Joi.object({
  // Define a Joi schema describing the structure of restaurant creation data.

  name: Joi.string().max(100).required(),
  // Restaurant name (max 100 chars, required).

  address: Joi.string().max(255).required(),
  // Restaurant address (max 255 chars, required).

  phone: Joi.string().pattern(/^\d{10,11}$/).required(),
  // Phone number must be 10–11 digits long, required.

  cuisine_type: Joi.string().max(50).optional(),
  // Optional cuisine type (e.g., "Italian", "Thai").

  latitude: Joi.number().optional(),
  // Latitude coordinate (required).

  longitude: Joi.number().optional(),
  // Longitude coordinate (required).

  description: Joi.string().max(500).optional()
  // Optional restaurant description (max 500 chars).
});

module.exports = {
  // Export the validation function.

  validateRestaurantCreate(body = {}) {
    // Function to validate restaurant creation request body.

    const { value, error } = createRestaurantSchema.validate(body, { abortEarly: false });
    // Validate data using Joi; `abortEarly: false` collects all errors, not just first one.

    if (error) {
      // If validation fails:

      const details = error.details.map(d => ({ field: d.path.join('.'), message: d.message }));
      // Map Joi error objects into cleaner format: [{ field, message }].

      const err = new Error('Validation failed');
      // Create a custom error object.

      err.status = 400;   // HTTP status for bad request.
      err.details = details;  // Attach validation details to error.
      throw err;  // Throw the formatted error.
    }

    return value;
    // Return validated and sanitized input data.
  }
};
