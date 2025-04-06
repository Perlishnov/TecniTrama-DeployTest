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

    // Check if user is admin (user_type_id = 2)
    if (decoded.user_type_id !== 2) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    req.user = decoded;
    next();
  });
};

module.exports = {
  verifyJWTAndAdmin
};