'use strict';
const { Users } = require('../models');

// Create a new user
async function createUser(payload) {
  try {
    // Role validation (only host or customer, admin is superuser)
    const allowedRoles = new Set(['user', 'rider', 'owner']);
    const role = allowedRoles.has(payload.role) ? payload.role : 'user';

    // Create user in DB
    const user = await Users.create({
      name: payload.name,
      email: payload.email,
      password: payload.password, // will be hashed by model hook
      phone: payload.phone,
      address: payload.address || null,
      role
    });

    // Clean output
    const plain = user.get({ plain: true });
    delete plain.password;

    return plain;
  } catch (err) {
    // Handle duplicate email
    if (err.name === 'SequelizeUniqueConstraintError') {
      const e = new Error('Email already registered');
      e.status = 409;
      throw e;
    }
    throw err;
  }
}

module.exports = { createUser };
