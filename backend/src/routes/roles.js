const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { authenticateToken } = require('../controllers/authController');

/**
 * @swagger
 * /api/roles/{id}/department:
 *   get:
 *     summary: Get department by role ID
 *     description: Retrieve the department associated with a specific role.
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Department found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       404:
 *         description: Department not found for this role
 *       500:
 *         description: Server error
 */
router.get('/:id/department', authenticateToken, roleController.getDepartmentByRoleId);

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     description: Retrieve a list of all roles.
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: A list of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       500:
 *         description: Server error
 */
router.get('/', authenticateToken, roleController.getAllRoles);

module.exports = router;