const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

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
 *     Class:
 *       type: object
 *       properties:
 *         class_id:
 *           type: string
 *         class_name:
 *           type: string
 *       example:
 *         class_id: "CLS001"
 *         class_name: "Film Production"
 */

// Get all classes
/**
 * @swagger
 * /api/classes:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all classes
 *     description: Retrieve a list of all classes. Requires authentication.
 *     tags: [Classes]
 *     responses:
 *       200:
 *         description: A list of classes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Class'
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       500:
 *         description: Server error
 */
router.get('/', authenticateToken, classController.getAllClasses);

// Get class by ID
/**
 * @swagger
 * /api/classes/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get class by ID
 *     description: Retrieve a specific class by its ID. Requires authentication.
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class ID
 *     responses:
 *       200:
 *         description: Class details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       404:
 *         description: Class not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticateToken, classController.getClassById);

module.exports = router;