const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');

// Import middleware
const { authenticateToken } = require('../controllers/authController');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Genre:
 *       type: object
 *       properties:
 *         genre_id:
 *           type: integer
 *         genre:
 *           type: string
 *       example:
 *         genre_id: 1
 *         genre: "Drama"
 */

// Get all genres
/**
 * @swagger
 * /api/genres:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all genres
 *     description: Retrieve a list of all genres. Requires authentication.
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: A list of genres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Genre'
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       500:
 *         description: Server error
 */
router.get('/', authenticateToken, genreController.getAllGenres);

// Get genre by ID
/**
 * @swagger
 * /api/genres/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get genre by ID
 *     description: Retrieve a specific genre by its ID. Requires authentication.
 *     tags: [Genres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Genre ID
 *     responses:
 *       200:
 *         description: Genre details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       404:
 *         description: Genre not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticateToken, genreController.getGenreById);

module.exports = router;