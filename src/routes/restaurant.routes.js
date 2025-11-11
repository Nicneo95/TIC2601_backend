'use strict';
const express = require('express');
const router = express.Router();

const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const controller = require('../controllers/restaurant.controller');
const upload = require('../middlewares/upload.middleware');

// // CREATE restaurant (only host or admin)
// router.post('/', authenticate, authorize('host', 'admin'), controller.create);
// // UPDATE restaurant (only host or admin)
// router.put('/:id', authenticate, authorize('host', 'admin'), controller.update);
// DELETE restaurant (only admin)
router.delete('/:id', authenticate, authorize('admin'), controller.remove);
// GET all restaurants (public)
router.get('/', controller.getAll);
// GET one restaurant (public)
router.get('/:id', controller.getOne);
// Create restaurant (Host/Admin) + Image
router.post('/', authenticate, authorize('host', 'admin'), upload.single('image'), controller.create);
// Update restaurant image
router.put('/:id/image', authenticate, authorize('host', 'admin'), upload.single('image'), controller.update);

module.exports = router;
