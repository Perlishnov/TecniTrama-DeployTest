const prisma = require('../models/prismaClient');

// Get all genres
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

// Get genre by ID
const getGenreById = async (req, res) => {
  try {
    const genreId = parseInt(req.params.id);
    const genre = await prisma.genres.findUnique({
      where: { genre_id: genreId },
      select: {
        genre_id: true,
        genre: true
      }
    });

    if (!genre) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    res.json(genre);
  } catch (error) {
    console.error('Error fetching genre:', error);
    res.status(500).json({ message: 'Error fetching genre', error: error.message });
  }
};

module.exports = {
  getAllGenres,
  getGenreById
};