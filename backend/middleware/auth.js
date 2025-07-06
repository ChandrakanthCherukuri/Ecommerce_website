// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

// Middleware function to verify JWT and attach user info to req
// This part remains the same as before, authenticating the token
const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Attach user payload (id, email, role) to request
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Middleware factory for role-based authorization
const authorizeRoles = (...roles) => { // Takes an array of allowed roles
  return (req, res, next) => {
    // Ensure auth middleware has run and req.user exists
    if (!req.user || !req.user.role) {
      return res.status(403).json({ msg: 'Access denied: User role not found' });
    }

    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: `Access denied: Role '${req.user.role}' is not authorized for this action.` });
    }
    next(); // User has the required role, proceed
  };
};

// Export both the main auth middleware and the authorizeRoles factory
module.exports = { auth, authorizeRoles };