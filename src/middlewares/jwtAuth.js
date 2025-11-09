const jwt = require('jsonwebtoken');
const { BlacklistedTokens } = require('../models');

module.exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  // Check blacklist
  const blacklisted = await BlacklistedTokens.findOne({ where: { token } });
  if (blacklisted) {
    return res.status(401).json({ error: 'Token revoked' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
