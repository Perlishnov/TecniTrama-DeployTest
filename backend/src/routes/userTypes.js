const express = require('express');
const router = express.Router();
const userTypeController = require('../controllers/userTypeController');
const { authenticateToken } = require('../controllers/userController');

/**
 * @swagger
 * /api/user-types:
 *   get:
 *     summary: Get all user types
 *     description: Retrieve a list of all user types
 *     tags: [User Types]
 *     responses:
 *       200:
 *         description: A list of user types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_type_id:
 *                     type: integer
 *                   type:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/', userTypeController.getAllUserTypes);

/**
 * @swagger
 * /api/user-types/{id}:
 *   get:
 *     summary: Get user type by ID
 *     description: Retrieve a specific user type by ID
 *     tags: [User Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User Type ID
 *     responses:
 *       200:
 *         description: User type details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_type_id:
 *                   type: integer
 *                 type:
 *                   type: string
 *       404:
 *         description: User type not found
 *       500:
 *         description: Server error
 */
router.get('/:id', userTypeController.getUserTypeById);

/**
 * @swagger
 * /api/user-types:
 *   post:
 *     summary: Create a new user type
 *     description: Create a new user type. Requires authentication.
 *     tags: [User Types]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: User type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userType:
 *                   type: object
 *                   properties:
 *                     user_type_id:
 *                       type: integer
 *                     type:
 *                       type: string
 *       400:
 *         description: Bad request - Missing fields
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       500:
 *         description: Server error
 */
router.post('/', authenticateToken, userTypeController.createUserType);

module.exports = router;