const { verifyToken } = require('../services/authService');

const verifyJWTAndAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  verifyToken(token, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Get the target user ID from the request parameters
    const targetUserId = parseInt(req.params.id);

    // If the user is modifying their own data, allow it
    if (targetUserId === decoded.id) {
      req.user = decoded;
      return next();
    }

    // If modifying another user's data, check for admin privileges
    if (decoded.user_type_id !== 2) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required to modify other users.' });
    }

    req.user = decoded;
    next();
  });
};

module.exports = {
  verifyJWTAndAdmin
};