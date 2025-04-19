const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { authenticateToken } = require('../controllers/authController');

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
router.get('/', classController.getAllClasses);

// Swagger documentation for the classes route
/**
 * @swagger
 * tags:
 *   name: Classes
 *   description: API endpoints for managing classes
 * 
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

module.exports = router;