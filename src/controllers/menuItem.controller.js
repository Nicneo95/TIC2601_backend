'use strict';

// Import models and Joi validators
const { MenuItems, Restaurants } = require('../models');
const { validateMenuItemCreate, validateMenuItemUpdate } = require('../forms/menuItem.form');


//CREATE MENU ITEM — host (own restaurant) or admin
async function create(req, res) {
  try {
    // 1. Validate the incoming request body using Joi
    const body = validateMenuItemCreate(req.body);
    const { name, description, price } = body;

    let restaurant;

    // 2. If user is a host, auto-detect their restaurant from the DB
    if (req.user.role === 'owner') {
      restaurant = await Restaurants.findOne({ where: { user_id: req.user.user_id } });

      if (!restaurant) {
        return res.status(400).json({
          message: 'You do not have a restaurant yet. Please create one first.'
        });
      }

    // 3. If user is an admin, they must specify restaurant_id manually
    } else if (req.user.role === 'admin') {
      if (!req.body.restaurant_id) {
        return res.status(400).json({
          message: 'Admin must specify a restaurant_id'
        });
      }

      restaurant = await Restaurants.findByPk(req.body.restaurant_id);
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
    }

    // Handle image upload
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    // 4. Create menu item and associate with the correct restaurant
    const menuItem = await MenuItems.create({
      restaurant_id: restaurant.restaurant_id,
      name,
      description,
      price,
      image_url
    });

    res.status(201).json({
      message: 'Menu item created successfully',
      menuItem
    });

  } catch (err) {
    console.error('Error creating menu item:', err);
    res.status(err.status || 500).json({
      message: err.message || 'Server error',
      details: err.details || null
    });
  }
};


//UPDATE MENU ITEM — host (own restaurant) or admin
async function update(req, res) {
  try {
    const { id } = req.params;

    // Validate request body (must include at least one editable field)
    const body = validateMenuItemUpdate(req.body);

    // Find menu item and its associated restaurant
    const menuItem = await MenuItems.findByPk(id, {
      include: { model: Restaurants }
    });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Restrict host users to their own restaurant only
    if (req.user.role === 'owner' && menuItem.Restaurant.user_id !== req.user.user_id) {
      return res.status(403).json({
        message: 'You cannot edit menu items for another restaurant'
      });
    }

    if (req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // Update fields if provided
    menuItem.name = body.name || menuItem.name;
    menuItem.description = body.description || menuItem.description;
    menuItem.price = body.price ?? menuItem.price;
    
    if (req.file && req.file.filename) {
      menuItem.image_url = `/uploads/${req.file.filename}`;
    }

    await menuItem.save();

    res.status(200).json({
      message: 'Menu item image updated successfully',
      image_url: menuItem.image_url
    });

  } catch (err) {
    console.error('Error updating menu item:', err);
    res.status(err.status || 500).json({
      message: err.message || 'Server error',
      details: err.details || null
    });
  }
};


//DELETE MENU ITEM — host (own restaurant) or admin
async function remove(req, res) {
  try {
    const { id } = req.params;

    // Find menu item and linked restaurant
    const menuItem = await MenuItems.findByPk(id, {
      include: { model: Restaurants }
    });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Only the host who owns this restaurant or admin can delete
    if (req.user.role === 'owner' && menuItem.Restaurant.user_id !== req.user.user_id) {
      return res.status(403).json({
        message: 'You cannot delete menu items for another restaurant'
      });
    }

    await menuItem.destroy();
    res.status(200).json({ message: 'Menu item deleted successfully' });

  } catch (err) {
    console.error('Error deleting menu item:', err);
    res.status(err.status || 500).json({
      message: err.message || 'Server error',
      details: err.details || null
    });
  }
};


//PUBLIC ROUTES
// Get all menu items for a specific restaurant (public)
async function getAllByRestaurant(req, res) {
  try {
    const { restaurant_id } = req.params;
    const items = await MenuItems.findAll({ where: { restaurant_id } });

    if (!items.length) {
      return res.status(404).json({ message: 'No menu items found for this restaurant' });
    }

    res.status(200).json({ restaurant_id, items });
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Get a single menu item by ID (public)
async function getOne(req, res) {
  try {
    const { id } = req.params;
    const item = await MenuItems.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json(item);
  } catch (err) {
    console.error('Error fetching menu item:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Export all controller functions
module.exports = {
  create,
  update,
  remove,
  getAllByRestaurant,
  getOne
};
