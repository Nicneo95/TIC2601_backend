const RestaurantService = require('../services/restaurant.service');

/** CREATE – host only */
const create = async (req, res) => {
  try {
    const restaurant = await RestaurantService.create(req.body, req.user.userId);
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/** READ ALL – public */
const getAll = async (req, res) => {
  try {
    const restaurants = await RestaurantService.getAll();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/** READ ONE – public */
const getById = async (req, res) => {
  try {
    const restaurant = await RestaurantService.getById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Not found' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/** UPDATE – host only */
const update = async (req, res) => {
  try {
    const restaurant = await RestaurantService.update(req.params.id, req.body, req.user.userId);
    res.json(restaurant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/** DELETE – host only */
const remove = async (req, res) => {
  try {
    const result = await RestaurantService.delete(req.params.id, req.user.userId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { create, getAll, getById, update, remove };
