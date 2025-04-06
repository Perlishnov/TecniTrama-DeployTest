const prisma = require('../models/prismaClient');

// Get all classes
const getAllClasses = async (req, res) => {
  try {
    const classes = await prisma.classes.findMany({
      select: {
        class_id: true,
        class_name: true
      }
    });
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ message: 'Error fetching classes', error: error.message });
  }
};

// Get class by ID
const getClassById = async (req, res) => {
  try {
    const classId = req.params.id;
    const classData = await prisma.classes.findUnique({
      where: { class_id: classId },
      select: {
        class_id: true,
        class_name: true
      }
    });

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(classData);
  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({ message: 'Error fetching class', error: error.message });
  }
};

module.exports = {
  getAllClasses,
  getClassById
};