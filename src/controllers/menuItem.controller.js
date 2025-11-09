const MenuItemService = require('../services/menuItem.service');

const create = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const item = await MenuItemService.create(req.body, restaurantId, req.user.userId);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getByRestaurant = async (req, res) => {
  try {
    const items = await MenuItemService.getByRestaurantId(req.params.restaurantId);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const item = await MenuItemService.getById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const item = await MenuItemService.update(req.params.id, req.body, req.user.userId);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const result = await MenuItemService.delete(req.params.id, req.user.userId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { create, getByRestaurant, getById, update, remove };
