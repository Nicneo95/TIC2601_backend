/**
 * Restrict route to specific roles.
 * req.user comes from JWT middleware.
 */
module.exports.hasRole = (allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden – insufficient role' });
  }
  next();
};
