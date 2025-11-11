'use strict';
const jwt = require('jsonwebtoken');

// Secret key from .env for security
const SECRET = process.env.JWT_SECRET || 'dev_secret_key';

// Token expiration time (1 hour)
const EXPIRES_IN = '1h';

// Generate JWT token for a user
function generateToken(user) {
  // Payload = minimal info we’ll store inside token
  const payload = {
    id: user.user_id,   // DB primary key
    email: user.email,
    role: user.role
  };

  // Sign and return the JWT token
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

// Verify token and return decoded data
function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null; // invalid/expired token
  }
}

module.exports = { generateToken, verifyToken };
