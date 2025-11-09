// src/routes/restaurant.routes.js
const express = require('express');
const router = express.Router();
const {
  create, getAll, getById, update, remove
} = require('../controllers/restaurant.controller');
const { authenticate } = require('../middlewares/jwtAuth');
const { hasRole } = require('../middlewares/role');
const { validate } = require('../middlewares/validate');
const { restaurantSchema } = require('../forms/restaurant.form');

// ---------- HOST‑ONLY ----------
router.post('/', authenticate, hasRole(['host']), validate(restaurantSchema), create);
router.put('/:id', authenticate, hasRole(['host']), validate(restaurantSchema), update);
router.delete('/:id', authenticate, hasRole(['host']), remove);

// ---------- PUBLIC ----------
router.get('/', getAll);
router.get('/:id', getById);

// ---------- MENU ITEMS (NESTED) ----------
const menuItemRoutes = require('./menuItem.routes');
router.use('/:restaurantId/menu-items', menuItemRoutes);  // ← NOW WORKS

module.exports = router;