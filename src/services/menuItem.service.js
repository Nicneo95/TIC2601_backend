const { MenuItems, Restaurants } = require('../models');

/**
 * All business logic for MenuItems.
 * Only the owner of the restaurant can manage its items.
 */
class MenuItemService {
  /**
   * Create a new menu item.
   * @param {Object} data - { name, description, price }
   * @param {number} restaurantId - From URL param
   * @param {number} userId - From JWT
   */
  static async create(data, restaurantId, userId) {
    // Verify the restaurant belongs to the user
    const restaurant = await Restaurants.findOne({
      where: { restaurant_id: restaurantId, user_id: userId }
    });
    if (!restaurant) {
      throw new Error('Restaurant not found or not owned by you');
    }

    return await MenuItems.create({
      ...data,
      restaurant_id: restaurantId
    });
  }

  /**
   * Get all menu items for a restaurant.
   */
  static async getByRestaurantId(restaurantId) {
    return await MenuItems.findAll({
      where: { restaurant_id: restaurantId }
    });
  }

  /**
   * Get a single menu item.
   */
  static async getById(id) {
    return await MenuItems.findByPk(id);
  }

  /**
   * Update a menu item (host only).
   */
  static async update(id, data, userId) {
    const item = await MenuItems.findOne({
      where: { menu_item_id: id },
      include: [{
        model: Restaurants,
        where: { user_id: userId }
      }]
    });

    if (!item) {
      throw new Error('Menu item not found or not owned by you');
    }

    return await item.update(data);
  }

  /**
   * Delete a menu item (host only).
   */
  static async delete(id, userId) {
    const item = await MenuItems.findOne({
      where: { menu_item_id: id },
      include: [{
        model: Restaurants,
        where: { user_id: userId }
      }]
    });

    if (!item) {
      throw new Error('Menu item not found or not owned by you');
    }

    await item.destroy();
    return { message: 'Menu item deleted' };
  }
}

module.exports = MenuItemService;
