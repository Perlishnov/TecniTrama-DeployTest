const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');
const { authenticateToken } = require('../controllers/authController');

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
router.get('/', genreController.getAllGenres);

// Swagger documentation for the genres route
/**
 * @swagger
 * tags:
 *   name: Genres
 *   description: API endpoints for managing genres
 * 
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

module.exports = router;