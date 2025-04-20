const express = require('express');
const router = express.Router();
const vacancyController = require('../controllers/vacancyController');

// Import middleware
const { authenticateToken } = require('../controllers/authController');

/**
 * @swagger
 * /api/vacancies:
 *   get:
 *     summary: Get all vacancies
 *     description: Returns a list of all available vacancies.
 *     tags: [Vacancies]
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of vacancies.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VacancyResponse'
 *       404:
 *         description: No vacancies found.
 *       500:
 *         description: Internal server error.
 */
router.get('/', vacancyController.getAllVacancies);

/**
 * @swagger
 * /api/vacancies/project/{project_id}:
 *   get:
 *     summary: Get vacancies by project ID
 *     description: Returns a list of vacancies associated with a specific project.
 *     tags: [Vacancies]
 *     parameters:
 *       - in: path
 *         name: project_id
 *         required: true
 *         description: ID of the project.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of vacancies for the project.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VacancyResponse'
 *       404:
 *         description: Project not found or no vacancies available for the project.
 *       500:
 *         description: Internal server error.
 */
router.get('/project/:project_id', vacancyController.getVacanciesByProjectId);

/**
 * @swagger
 * /api/vacancies/{id}:
 *   get:
 *     summary: Get a vacancy by ID
 *     description: Returns the details of a specific vacancy.
 *     tags: [Vacancies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the vacancy.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the vacancy.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VacancyResponse'
 *       404:
 *         description: Vacancy not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:id', vacancyController.getVacancyById);

/**
 * @swagger
 * /api/vacancies:
 *   post:
 *     summary: Create a new vacancy
 *     description: Adds a new vacancy to the database.
 *     tags: [Vacancies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VacancyInput'
 *     responses:
 *       201:
 *         description: Successfully created the vacancy.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VacancyResponse'
 *       400:
 *         description: Invalid data.
 *       500:
 *         description: Internal server error.
 */
router.post('/', authenticateToken, vacancyController.createVacancy);

/**
 * @swagger
 * /api/vacancies/{id}:
 *   put:
 *     summary: Update a vacancy by ID
 *     description: Modifies the details of a specific vacancy.
 *     tags: [Vacancies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the vacancy.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VacancyInput'
 *     responses:
 *       200:
 *         description: Successfully updated the vacancy.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VacancyResponse'
 *       400:
 *         description: Invalid data.
 *       404:
 *         description: Vacancy not found.
 *       500:
 *         description: Internal server error.
 */
router.put('/:id', authenticateToken, vacancyController.updateVacancy);

/**
 * @swagger
 * /api/vacancies/{id}:
 *   delete:
 *     summary: Delete a vacancy by ID
 *     description: Removes a specific vacancy from the database.
 *     tags: [Vacancies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Vacancy ID.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Vacancy deleted successfully.
 *       404:
 *         description: Vacancy not found.
 *       500:
 *         description: Internal server error.
 */
router.delete('/:id', authenticateToken, vacancyController.deleteVacancy);


// Swagger schemas and security definitions
/**
 * @swagger
 * components:
 *   schemas:
 *     VacancyInput:
 *       type: object
 *       required:
 *         - project_id
 *         - role_id
 *         - description
 *         - requirements
 *         - is_filled
 *         - is_visible
 *       properties:
 *         project_id:
 *           type: integer
 *           example: 1
 *         role_id:
 *           type: integer
 *           example: 2
 *         description:
 *           type: string
 *           example: "Buscamos un director con experiencia en cine independiente."
 *         requirements:
 *           type: string
 *           example: "Experiencia mínima de 2 años en dirección cinematográfica."
 *         is_filled:
 *           type: boolean
 *           example: false
 *         is_visible:
 *           type: boolean
 *           example: true
 *
 *     VacancyResponse:
 *       type: object
 *       properties:
 *         vacancy_id:
 *           type: integer
 *           example: 10
 *         project_id:
 *           type: integer
 *           example: 1
 *         role_id:
 *           type: integer
 *           example: 2
 *         description:
 *           type: string
 *           example: "Buscamos un director con experiencia en cine independiente."
 *         requirements:
 *           type: string
 *           example: "Experiencia mínima de 2 años en dirección cinematográfica."
 *         is_filled:
 *           type: boolean
 *           example: false
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-04-18T15:30:00Z"
 *         is_visible:
 *           type: boolean
 *           example: true
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   tags:
 *     - name: Vacancies
 *       description: API for managing vacancies
 */

module.exports = router;