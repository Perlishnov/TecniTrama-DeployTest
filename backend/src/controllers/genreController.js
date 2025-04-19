const prisma = require("../models/prismaClient");

// Get all genres
// GET /genres
const getAllGenres = async (req, res) => {
    try {
      const genres = await prisma.genres.findMany({
        select: {
          genre_id: true,
          genre: true
        }
      });
      res.json(genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
      res.status(500).json({ message: 'Error fetching genres', error: error.message });
    }
  };

  module.exports = {
    getAllGenres
  };