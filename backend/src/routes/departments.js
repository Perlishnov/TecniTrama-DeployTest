const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { authenticateToken } = require('../controllers/authController');

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Get all departments
 *     description: Retrieve a list of all departments.
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: A list of departments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Department'
 *       500:
 *         description: Server error
 */
router.get('/', authenticateToken, departmentController.getAllDepartments);

/**
 * @swagger
 * /api/departments/{id}/roles:
 *   get:
 *     summary: Get roles by department ID
 *     description: Retrieve all roles associated with a specific department.
 *     tags: [Departments, Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Department ID
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
router.get('/:id/roles', authenticateToken, departmentController.getRolesByDepartmentId);

module.exports = router;