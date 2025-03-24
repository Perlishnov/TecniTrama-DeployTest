const prisma = require('../models/prismaClient');

// Get all user types
const getAllUserTypes = async (req, res) => {
  try {
    const userTypes = await prisma.user_types.findMany();
    res.json(userTypes);
  } catch (error) {
    console.error('Error fetching user types:', error);
    res.status(500).json({ message: 'Error fetching user types', error: error.message });
  }
};

// Get user type by ID
const getUserTypeById = async (req, res) => {
  try {
    const userTypeId = parseInt(req.params.id);
    const userType = await prisma.user_types.findUnique({
      where: { user_type_id: userTypeId }
    });

    if (!userType) {
      return res.status(404).json({ message: 'User type not found' });
    }

    res.json(userType);
  } catch (error) {
    console.error('Error fetching user type:', error);
    res.status(500).json({ message: 'Error fetching user type', error: error.message });
  }
};

// Create user type
const createUserType = async (req, res) => {
  try {
    const { type } = req.body;

    if (!type) {
      return res.status(400).json({ message: 'Type is required' });
    }

    const newUserType = await prisma.user_types.create({
      data: { type }
    });

    res.status(201).json({
      message: 'User type created successfully',
      userType: newUserType
    });
  } catch (error) {
    console.error('Error creating user type:', error);
    res.status(500).json({ message: 'Error creating user type', error: error.message });
  }
};

module.exports = {
  getAllUserTypes,
  getUserTypeById,
  createUserType
};