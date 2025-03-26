const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'tecnitrama_jwt_secret',
    { expiresIn: '1d' }
  );
};

const verifyToken = (token, callback) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tecnitrama_jwt_secret');
    callback(null, decoded);
  } catch (error) {
    callback(error);
  }
};

module.exports = {
  generateToken,
  verifyToken
};