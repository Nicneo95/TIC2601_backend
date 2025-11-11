const express = require('express');
const router = express.Router();
const controller = require('../controllers/menuItem.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const menuItemController = require('../controllers/menuItem.controller');
const upload = require('../middlewares/upload.middleware');

// // Host or Admin can create/update/delete menu items
// router.post('/', authenticate, authorize('host', 'admin'), menuItemController.create);
// // Host or Admin can update menu items
// router.put('/:id', authenticate, authorize('host', 'admin'), menuItemController.update);
// Host or Admin can delete menu items
router.delete('/:id', authenticate, authorize('host', 'admin'), menuItemController.remove);
// Create menu item with image
router.post('/', authenticate, authorize('host', 'admin'), upload.single('image'), controller.create);
// Update menu item text fields or image (combined)
router.put('/:id', authenticate, authorize('host', 'admin'), upload.single('image'), controller.update);
// Optional dedicated image-only route (if you want to keep it)
router.put('/:id/image', authenticate, authorize('host', 'admin'), upload.single('image'), controller.update);


// Public routes (no auth)
router.get('/restaurant/:restaurant_id', menuItemController.getAllByRestaurant);
router.get('/:id', menuItemController.getOne);

module.exports = router;
