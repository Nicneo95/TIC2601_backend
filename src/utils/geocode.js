'use strict';
const axios = require('axios');

/**
 * Convert an address into latitude and longitude using OpenStreetMap (Nominatim).
 * Returns { lat: number, lng: number } or null if not found.
 */
async function geocodeAddress(address) {
  try {
    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: address, format: 'json', limit: 1 },
      headers: { 'User-Agent': 'eatwithlocals/1.0 (+contact@example.com)' } // required by Nominatim
    });

    const data = res.data;
    if (Array.isArray(data) && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (err) {
    console.error('Geocode error:', err.message);
    return null;
  }
}

module.exports = { geocodeAddress };
