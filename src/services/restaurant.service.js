const { Restaurants } = require('../models');

/**
 * All business logic for restaurants.
 * The userId comes from the JWT payload (req.user.userId).
 */
class RestaurantService {
  /** Create a new restaurant – only the logged‑in host */
  static async create(data, userId) {
    return await Restaurants.create({ ...data, user_id: userId });
  }

  /** Public – list all restaurants */
  static async getAll() {
    return await Restaurants.findAll({
      include: [{ model: require('../models').Users, attributes: ['name'] }]
    });
  }

  /** Public – get one restaurant by id */
  static async getById(id) {
    return await Restaurants.findByPk(id, {
      include: [{ model: require('../models').Users, attributes: ['name'] }]
    });
  }

  /** Host‑only – update own restaurant */
  static async update(id, data, userId) {
    const restaurant = await Restaurants.findOne({
      where: { restaurant_id: id, user_id: userId }
    });
    if (!restaurant) throw new Error('Restaurant not found or not owned by you');
    return await restaurant.update(data);
  }

  /** Host‑only – delete own restaurant */
  static async delete(id, userId) {
    const restaurant = await Restaurants.findOne({
      where: { restaurant_id: id, user_id: userId }
    });
    if (!restaurant) throw new Error('Restaurant not found or not owned by you');
    await restaurant.destroy();
    return { message: 'Restaurant deleted' };
  }
}

module.exports = RestaurantService;
