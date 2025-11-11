'use strict';
const { verifyToken } = require('../utils/jwt');
const { Users, BlacklistedTokens } = require('../models');

/**
 * Middleware: authenticate
 * Verifies JWT from headers, checks blacklist, and attaches user info to req.
 */
async function authenticate(req, res, next) {
  try {
    // 1 Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }

    // 2 Extract token value
    const token = authHeader.split(' ')[1];

    // 3 Verify token validity
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // 4 Check if token is blacklisted (e.g., user logged out)
    const blacklisted = await BlacklistedTokens.findOne({ where: { token } });
    if (blacklisted) {
      return res.status(401).json({ message: 'Token has been revoked' });
    }

    // 5 Fetch user from DB to ensure user still exists
    const user = await Users.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 6 Attach user info to request
    req.user = user;   // Full Sequelize model
    req.token = token; // For logout or tracking
    req.role = user.role; // Easier access for authorization

    next(); // Proceed to next middleware/controller
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(500).json({ message: 'Authentication failed', error: err.message });
  }
}

module.exports = { authenticate };
