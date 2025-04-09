const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
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
 *     Profile:
 *       type: object
 *       properties:
 *         profile_id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         experience:
 *           type: string
 *         carreer:
 *           type: string
 *         bio:
 *           type: string
 *         profile_image:
 *           type: string
 *       example:
 *         profile_id: 1
 *         user_id: 123
 *         experience: "5 years in film production"
 *         carreer: "Film Director"
 *         bio: "Passionate filmmaker with experience in short films"
 *         profile_image: "https://example.com/images/profile.jpg"
 */

// Get all profiles
/**
 * @swagger
 * /api/profiles:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all profiles
 *     description: Retrieve a list of all user profiles
 *     tags: [Profiles]
 *     responses:
 *       200:
 *         description: Successfully retrieved profiles list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized - No token provided
 *       500:
 *         description: Server error
 */
router.get('/', authenticateToken, profileController.getAllProfiles);

// Get single profile by ID
/**
 * @swagger
 * /api/profiles/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get profile by ID
 *     description: Retrieve detailed information about a specific profile
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the profile to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Bad request - Missing or invalid parameters
 *       401:
 *         description: Unauthorized - No token provided
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticateToken, profileController.getProfileById);

// Get profile by user ID
/**
 * @swagger
 * /profiles/user/{id}:
 *   get:
 *     summary: Get profile by user ID
 *     description: Retrieve a profile based on the user's ID. Includes associated user information.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user whose profile you want to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal server error
 */
router.get('/user/:id', authenticateToken, profileController.getProfileByUserId);

// Update existing profile
/**
 * @swagger
 * /api/profiles/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a profile
 *     description: Update existing profile information
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the profile to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               experience:
 *                 type: string
 *               carreer:
 *                 type: string
 *               bio:
 *                 type: string
 *               profile_image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Bad request - Missing or invalid parameters
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - User not authorized
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticateToken, profileController.updateProfile);

// Delete profile
/**
 * @swagger
 * /api/profiles/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a profile
 *     description: Permanently remove a user profile
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the profile to delete
 *     responses:
 *       204:
 *         description: Profile deleted successfully
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - User not authorized
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticateToken, profileController.deleteProfile);

module.exports = router;