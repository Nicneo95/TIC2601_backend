'use strict';

// Middleware: authorize roles
function authorize(...allowedRoles) {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;
      if (!userRole) return res.status(403).json({ message: 'Access denied. No role found.' });

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
      }

      next();
    } catch (err) {
      return res.status(500).json({ message: 'Authorization failed', error: err.message });
    }
  };
}

module.exports = { authorize };
