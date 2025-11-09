const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  create, getByRestaurant, getById, update, remove
} = require('../controllers/menuItem.controller');
const { authenticate } = require('../middlewares/jwtAuth');
const { hasRole } = require('../middlewares/role');
const { validate } = require('../middlewares/validate');
const { menuItemSchema } = require('../forms/menuItem.form');

// Host‑only
router.post('/', authenticate, hasRole(['host']), validate(menuItemSchema), create);
router.put('/:id', authenticate, hasRole(['host']), validate(menuItemSchema), update);
router.delete('/:id', authenticate, hasRole(['host']), remove);

// Public
router.get('/', getByRestaurant);
router.get('/:id', getById);

module.exports = router;
