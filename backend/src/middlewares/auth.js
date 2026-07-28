const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

// Middleware to verify JWT token
const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secure_jwt_token_secret_key_antigravity_12345');
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });

      if (!user) {
        return res.status(401).json({ error: 'Authentication failed. User no longer exists.' });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(403).json({ error: 'Access token is invalid or has expired.' });
    }
  } else {
    return res.status(401).json({ error: 'Authorization header is missing or malformed.' });
  }
};

// Middleware to restrict access by role
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = {
  authenticateJWT,
  authorizeRoles
};
