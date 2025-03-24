const jwt = require('jsonwebtoken');
const prisma = require('../models/prismaClient');
const { hashPassword, comparePassword } = require('../utils/hash');

const SECRET_KEY = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

// Registrar usuario
const registerUser = async ({ name, email, password }) => {
  // Verificar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('El correo ya está registrado');

  // Hashear la contraseña y crear usuario
  const hashedPassword = await hashPassword(password);
  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return newUser;
};

// Iniciar sesión
const loginUser = async ({ email, password }) => {
  // Buscar usuario por email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Usuario no encontrado');

  // Comparar contraseñas
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error('Contraseña incorrecta');

  // Generar token JWT
  const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: JWT_EXPIRATION,
  });

  return { token, user };
};

module.exports = { registerUser, loginUser };
