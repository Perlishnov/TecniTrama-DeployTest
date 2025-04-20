const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticateToken } = require('../controllers/authController');

// Creates Application
/**
 * @swagger
 * /api/applications/:
 *   post:
 *     summary: Create a new application.
 *     description: Creates a new application with the provided data.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplicationInput'
 *     responses:
 *       200:
 *         description: Application details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, applicationController.createApplication);

// Get Application by ID
/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Retrieve a specific application by ID.
 *     description: Fetches an application by its ID.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *            type: integer
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticateToken, applicationController.getApplicationById);

// Get Application By Postulant ID
/**
 * @swagger
 * /api/applications/postulant/{id}:
 *   get:
 *     summary: Retrieve a specific application by postulant ID.
 *     description: Fetches an application by its postulant ID.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *            type: integer
 *         description: Postulant ID
 *     responses:
 *       200:
 *         description: Application details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */
router.get('/postulant/:id', authenticateToken, applicationController.getApplicationByPostulantId);

// Get Application By Postulant ID and Application Status ID
/**
 * @swagger
 * /api/applications/postulant/{postulantId}/status/{statusId}:
 *   get:
 *     summary: Retrieve applications by postulant ID and application status ID.
 *     description: Fetches applications based on the postulant ID and application status ID.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postulantId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Postulant ID
 *       - in: path
 *         name: statusId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Application status ID
 *     responses:
 *       200:
 *         description: List of applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Applications not found
 *       500:
 *         description: Internal server error
 */
router.get('/postulant/:postulantId/status/:statusId', authenticateToken, applicationController.getApplicationsByPostulantAndStatus);

// Get Application By Project ID
/**
 * @swagger
 * /api/applications/project/{id}:
 *   get:
 *     summary: Retrieve a specific application by project ID.
 *     description: Fetches an application by its project ID.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *            type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Application details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */
router.get('/project/:id', authenticateToken, applicationController.getApplicationsByProjectId);

// Get Application By Project ID and Application Status ID
/**
 * @swagger
 * /api/applications/project/{projectId}/status/{statusId}:
 *   get:
 *     summary: Retrieve applications by project ID and application status ID.
 *     description: Fetches applications based on the project ID and application status ID.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *       - in: path
 *         name: statusId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Application status ID
 *     responses:
 *       200:
 *         description: List of applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Applications not found
 *       500:
 *         description: Internal server error
 */
router.get('/project/:projectId/status/:statusId', authenticateToken, applicationController.getApplicationsByProjectAndStatus);

// Change Application Status
/**
 * @swagger
 * /api/applications/{appId}/status/{statusId}:
 *   patch:
 *     summary: Change the status of an application.
 *     description: Updates the status of an application based on its ID and the new status ID.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the application
 *       - in: path
 *         name: statusId
 *         required: true
 *         schema:
 *           type: integer
 *         description: New status ID
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application or status not found
 */
router.patch('/:appId/status/:statusId', authenticateToken, applicationController.changeApplicationStatus);


// Swagger schemas and security definitions
/**
 * @swagger
 * components:
 *   schemas:
 *     Application:
 *       type: object
 *       properties:
 *         app_id:
 *           type: integer
 *           description: The auto-generated ID of the project
 *         postulant_id:
 *           type: integer
 *           description: ID of the user who applied to the project
 *         vacancy_id:
 *           type: integer
 *           description: ID of the project vacancy.
 *         app_status_id:
 *           type: integer
 *           description: ID of the application status.
 *         motivation_letter:
 *           type: string
 *           description: Motivation letter of the application.
 *         applied_at:
 *           type: string
 *           format: date-time
 *           description: Date and time the application was applied.
 *
 *     ApplicationInput:
 *       type: object
 *       required:
 *         - postulant_id
 *         - vacancy_id
 *         - app_status_id
 *       properties:
 *         postulant_id:
 *           type: integer
 *           example: 1
 *         vacancy_id:
 *           type: integer
 *           example: 1
 *         app_status_id:
 *           type: integer
 *           example: 1
 *         motivation_letter:
 *           type: string
 *           example: "I'm deeply interested in this opportunity because it aligns perfectly with my professional goals and experience."
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   tags:
 *     - name: Applications
 *       description: API for managing applications
 */


module.exports = router;