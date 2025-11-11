'use strict';
const { Restaurants } = require('../models');
const restaurantService = require('../services/restaurant.service');
const { geocodeAddress } = require('../utils/geocode');

// Controller: Create a new restaurant
// async function create(req, res) {
//   try {
//     const { name, address, phone, cuisine_type, description } = req.body;

//     // ✅ Basic validation
//     if (!name || !address || !phone) {
//       return res.status(400).json({ message: 'All required fields must be provided' });
//     }

//     // 🗺️ Fetch coordinates from OpenStreetMap (Nominatim)
//     console.log('📍 Fetching coordinates for address:', address);

//     const geoResponse = await fetch(
//       `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
//     );

//     if (!geoResponse.ok) {
//       throw new Error(`OpenStreetMap API returned ${geoResponse.status}`);
//     }

//     const geoData = await geoResponse.json();
//     console.log('🌍 GeoData from OSM:', geoData);

//     if (!geoData || geoData.length === 0) {
//       return res.status(400).json({
//         message: 'Unable to find coordinates for this address. Please try a more specific address.'
//       });
//     }

//     // Extract coordinates
//     const latitude = parseFloat(geoData[0].lat);
//     const longitude = parseFloat(geoData[0].lon);

//     console.log(`✅ Coordinates found → Latitude: ${latitude}, Longitude: ${longitude}`);

//     // ✅ Create the restaurant entry (owned by the logged-in user)
//     const restaurant = await Restaurants.create({
//       user_id: req.user.user_id, // user_id comes from the authenticated JWT
//       name,
//       address,
//       phone,
//       cuisine_type,
//       latitude,
//       longitude,
//       description
//     });

//     // ✅ Return success response
//     return res.status(201).json({
//       message: 'Restaurant created successfully',
//       restaurant
//     });

//   } catch (error) {
//     console.error('❌ Error creating restaurant:', error);
//     return res.status(500).json({ message: 'Server error', error: error.message });
//   }
// }
// // UPDATE restaurant (only host/admin)
// async function update(req, res) {
//   try {
//     const { id } = req.params;
//     const { name, address, phone, cuisine_type, description } = req.body;

//     // Find the restaurant
//     const restaurant = await Restaurants.findByPk(id);
//     if (!restaurant) {
//       return res.status(404).json({ message: 'Restaurant not found' });
//     }

//     // Only owner (host) or admin can update
//     if (req.user.role !== 'admin' && restaurant.user_id !== req.user.user_id) {
//       return res.status(403).json({ message: 'You are not authorized to update this restaurant' });
//     }

//     // If address is updated, fetch new coordinates
//     let latitude = restaurant.latitude;
//     let longitude = restaurant.longitude;

//     if (address && address !== restaurant.address) {
//       console.log('📍 Fetching new coordinates for:', address);
//       const geoResponse = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
//       );

//       const geoData = await geoResponse.json();
//       if (geoData.length > 0) {
//         latitude = parseFloat(geoData[0].lat);
//         longitude = parseFloat(geoData[0].lon);
//       } else {
//         return res.status(400).json({ message: 'Unable to find coordinates for the new address' });
//       }
//     }

//     // Update fields (only provided ones)
//     restaurant.name = name || restaurant.name;
//     restaurant.address = address || restaurant.address;
//     restaurant.phone = phone || restaurant.phone;
//     restaurant.cuisine_type = cuisine_type || restaurant.cuisine_type;
//     restaurant.description = description || restaurant.description;
//     restaurant.latitude = latitude;
//     restaurant.longitude = longitude;

//     await restaurant.save();

//     return res.status(200).json({
//       message: 'Restaurant updated successfully',
//       restaurant
//     });
//   } catch (error) {
//     console.error('❌ Error updating restaurant:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// }

// CREATE restaurant (host/admin); supports optional image upload
async function create(req, res) {
  console.log('BODY:', req.body);
  console.log('FILE:', req.file);
  try {
    const { name, address, phone, cuisine_type, latitude, longitude, description } = req.body;

    if (!name || !address || !phone) {
      return res.status(400).json({ message: 'Name, address and phone are required' });
    }

    // Auto-geocode if coordinates not provided
    let lat = latitude;
    let lng = longitude;
    if ((!lat || !lng) && address) {
      const coords = await geocodeAddress(address);
      if (coords) {
        lat = coords.lat;
        lng = coords.lng;
      }
    }

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const restaurant = await Restaurants.create({
      user_id: req.user.user_id,
      name,
      address,
      phone,
      cuisine_type,
      latitude: lat,
      longitude: lng,
      description,
      image_url,
    });

    res.status(201).json({
      message: 'Restaurant created successfully',
      restaurant,
    });
  } catch (err) {
    console.error('Error creating restaurant:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// UPDATE restaurant image (host owns it, or admin)
async function update(req, res) {
  try {
    const { id } = req.params;

    // Find the restaurant
    const restaurant = await Restaurants.findByPk(id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Restrict host to only their restaurant
    if (req.user.role === 'host' && restaurant.user_id !== req.user.user_id) {
      return res.status(403).json({
        message: 'You can only update your own restaurant'
      });
    }

    // Allow optional image upload
    if (req.file) {
      restaurant.image_url = `/uploads/${req.file.filename}`;
    }

    // Update fields from req.body safely
    if (req.body.name) restaurant.name = req.body.name;
    if (req.body.address) restaurant.address = req.body.address;
    if (req.body.phone) restaurant.phone = req.body.phone;
    if (req.body.cuisine_type) restaurant.cuisine_type = req.body.cuisine_type;
    if (req.body.description) restaurant.description = req.body.description;

    await restaurant.save();

    res.status(200).json({
      message: 'Restaurant updated successfully',
      restaurant
    });

  } catch (err) {
    console.error('Error updating restaurant:', err);
    res.status(err.status || 500).json({
      message: err.message || 'Server error',
      details: err.details || null
    });
  }
}

// GET all restaurants (public)
async function getAll(req, res) {
  try {
    const restaurants = await restaurantService.getAllRestaurants(req.query);
    return res.json(restaurants);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch restaurants', error: err.message });
  }
}

// GET one restaurant (public)
async function getOne(req, res) {
  try {
    const { id } = req.params;
    const restaurant = await Restaurants.findByPk(id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    return res.json(restaurant);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching restaurant', error: err.message });
  }
}

// DELETE restaurant (admin only)
async function remove(req, res) {
  try {
    const { id } = req.params;

    // Only admin can delete restaurants
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only superadmins can delete restaurants' });
    }

    const restaurant = await Restaurants.findByPk(id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    await restaurant.destroy();
    return res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting restaurant:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = { create, update, getAll, getOne, remove };
