'use strict';
// Use strict mode for cleaner, safer JavaScript.

const express = require('express');
const router = express.Router();

// Import controller functions
const { register, login, updateProfile, getProfile } = require('../controllers/auth.controller');

// Import middlewares
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// PUBLIC ROUTES
// Register new user (customer or host)
router.post('/register', register);

// Login existing user
router.post('/login', login);

// PROTECTED ROUTES
// Update user profile (only logged-in users)
router.put('/update', authenticate, updateProfile);

// Get current logged-in user's profile
router.get('/info', authenticate, getProfile);

module.exports = router;


