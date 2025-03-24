const { registerUser, loginUser } = require('../services/authService');

const register = async (req, res) => {
  try {
    const newUser = await registerUser(req.body);
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { token, user } = await loginUser(req.body);
    res.json({ message: 'Inicio de sesión exitoso', token, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { register, login };
