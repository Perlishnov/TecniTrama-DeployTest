const prisma = require("../models/prismaClient");

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
  
module.exports = {
    getAllClasses
};
  