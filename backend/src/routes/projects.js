const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateToken } = require('../controllers/authController');

// Get all project formats
/**
 * @swagger
 * /api/projects/formats:
 *   get:
 *     summary: Get all project formats
 *     description: Retrieve a list of all available project formats.
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: A list of project formats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   format_id:
 *                     type: integer
 *                   format_name:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/formats', projectController.getAllFormats);


// Get all projects
/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     description: Retrieve a list of all projects. Public endpoint.
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: A list of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       500:
 *         description: Server error
 */
router.get('/', projectController.getAllProjects);


// Get project by ID
/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     description: Retrieve a specific project by its ID. Public endpoint.
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.get('/:id', projectController.getProjectById);


// Get projects by creator ID
/**
 * @swagger
 * /api/projects/creator/{id}:
 *   get:
 *     summary: Get projects by creator ID
 *     description: Retrieve a list of all projects by its creator Id. Public endpoint.
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Creator ID
 *     responses:
 *       200:
 *         description: A list of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       404:
 *         description: No projects found for this user 
 *       500:
 *         description: Server error
 */
router.get('/creator/:id', projectController.getProjectsByCreatorId);


// Create a new project
/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     description: Create a new project. Requires authentication.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Bad request - Missing required fields
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       500:
 *         description: Server error
 */
router.post('/', /*authenticateToken,*/ projectController.createProject);


// Update project
/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update project
 *     description: Update project information. Requires authentication.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token or not project owner
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticateToken, projectController.updateProject);


// Delete project
/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete project
 *     description: Delete a project by ID. Requires authentication.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       204:
 *         description: Project deleted successfully
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token or not project owner
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticateToken, projectController.deleteProject);


// Toggle project status
/**
 * @swagger
 * /api/projects/{id}/status:
 *   patch:
 *     summary: Toggle project status
 *     description: Toggle project active/inactive status. Requires authentication.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_active:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Project status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token or not project owner
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/status', authenticateToken, projectController.toggleProjectStatus);

// Toggle project publish status
/**
 * @swagger
 * /api/projects/{id}/publish:
 *   patch:
 *     summary: Toggle project publish status
 *     description: Toggle project publish/unpublish status. Requires authentication.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project publish status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token or not project owner
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/publish', authenticateToken, projectController.toggleProjectPublishStatus);

// Get project genres
/**
 * @swagger
 * /api/projects/{id}/genres:
 *   get:
 *     summary: Get project genres
 *     description: Retrieve all genres associated with a specific project. Requires authentication.
 *     tags: [Projects, Genres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: List of project genres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   genre_id:
 *                     type: integer
 *                   genre:
 *                     type: string
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.get('/:id/genres', authenticateToken, projectController.getProjectGenres);

// Get project classes
/**
 * @swagger
 * /api/projects/{id}/classes:
 *   get:
 *     summary: Get project classes
 *     description: Retrieve all classes associated with a specific project. Requires authentication.
 *     tags: [Projects, Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: List of project classes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   class_id:
 *                     type: string
 *                   class_name:
 *                     type: string
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.get('/:id/classes', authenticateToken, projectController.getProjectClasses);

// Check if user is project owner
/**
 * @swagger
 * /api/projects/{id}/isOwner:
 *   get:
 *     summary: Check if user is project owner
 *     description: Verify if the authenticated user is the owner of a specific project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Ownership verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isOwner:
 *                   type: boolean
 *                   description: True if user is the owner, false otherwise
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.get('/:id/isOwner', authenticateToken, projectController.isOwner);

// Get all project formats
/**
 * @swagger
 * /api/projects/formats:
 *   get:
 *     summary: Get all project formats
 *     description: Retrieve a list of all available project formats.
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: A list of project formats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   format_id:
 *                     type: integer
 *                   format_name:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/formats', projectController.getAllFormats);

// Get crew by project ID
/**
 * @swagger
 * /api/projects/{id}/crew:
 *   get:
 *     summary: Get crew by project ID
 *     description: Retrieve all crew members associated with a specific project. Requires authentication.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: List of project crew members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   crew_id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   role:
 *                     type: string
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.get('/:id/crew', authenticateToken, projectController.getCrewByProjectId);

// Delete crew by project ID
/**
 * @swagger
 * /api/projects/{id}/crew:
 *   delete:
 *     summary: Delete specific crew members by project ID
 *     description: Delete specific crew members associated with a project based on user IDs. Requires authentication.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userIds
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of user IDs to remove from the crew
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Crew members deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Crew members removed successfully"
 *       400:
 *         description: Bad request - Missing or invalid userIds
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.delete('/:id/crew', authenticateToken, projectController.deleteCrewByProjectId);

// Update project format
/**
 * @swagger
 * /api/projects/{id}/format:
 *   patch:
 *     summary: Update project format
 *     description: Update the format of a specific project. Requires authentication.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - format_id
 *             properties:
 *               format_id:
 *                 type: integer
 *                 description: ID of the new format
 *                 example: 2
 *     responses:
 *       200:
 *         description: Project format updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Bad request - Missing format_id
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/format', authenticateToken, projectController.updateProjectFormat);

// Update project genres
/**
 * @swagger
 * /api/projects/{id}/genres:
 *   put:
 *     summary: Update project genres
 *     description: Update the genres associated with a specific project. Requires authentication.
 *     tags: [Projects, Genres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - genre_ids
 *             properties:
 *               genre_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of genre IDs to associate with the project
 *                 example: [1, 3, 5]
 *     responses:
 *       200:
 *         description: Project genres updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Genre'
 *       400:
 *         description: Bad request - Missing or invalid genre_ids
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.put('/:id/genres', authenticateToken, projectController.updateProjectGenres);

// Update project classes
/**
 * @swagger
 * /api/projects/{id}/classes:
 *   put:
 *     summary: Update project classes
 *     description: Update the classes associated with a specific project. Requires authentication.
 *     tags: [Projects, Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - class_ids
 *             properties:
 *               class_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of class IDs to associate with the project
 *                 example: ["LCC332", "LCC334"]
 *     responses:
 *       200:
 *         description: Project classes updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Class'
 *       400:
 *         description: Bad request - Missing or invalid class_ids
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.put('/:id/classes', authenticateToken, projectController.updateProjectClasses);

// Get projects where user is part of crew
/**
 * @swagger
 * /api/projects/user/{user_id}/crew:
 *   get:
 *     summary: Get projects where user is part of crew
 *     description: Retrieve all projects where the specified user is part of the crew. Requires authentication.
 *     tags: [Projects, Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of projects where the user is part of the crew
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Project'
 *                   - type: object
 *                     properties:
 *                       role:
 *                         type: string
 *                         description: The user's role in the project
 *                       genres:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Genre'
 *                       formats:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Format'
 *       400:
 *         description: Bad request - Missing user_id
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       404:
 *         description: No projects found where this user is part of the crew
 *       500:
 *         description: Server error
 */
router.get('/user/:user_id/crew', authenticateToken, projectController.getProjectsByCrewMemberId);

// Swagger schemas definitions
/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         project_id:
 *           type: integer
 *           description: The auto-generated ID of the project
 *         creator_id:
 *           type: integer
 *           description: ID of the user who created the project
 *         title:
 *           type: string
 *           description: Title of the project
 *         banner:
 *           type: string
 *           description: URL of the project banner image
 *         description:
 *           type: string
 *           description: Detailed description of the project
 *         attachmenturl:
 *           type: string
 *           description: URL of any attachment
 *         publication_date:
 *           type: string
 *           format: date-time
 *           description: Date when project was published
 *         budget:
 *           type: number
 *           format: float
 *           description: Project budget
 *         sponsors:
 *           type: string
 *           description: Project sponsors
 *         estimated_start:
 *           type: string
 *           format: date-time
 *           description: Estimated start date
 *         estimated_end:
 *           type: string
 *           format: date-time
 *           description: Estimated end date
 *         is_active:
 *           type: boolean
 *           description: Whether the project is active
 *         is_published:
 *           type: boolean
 *           description: Whether the project is published
 *         format_id:
 *           type: integer
 *           description: ID of the project format
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date when project was created
 * 
 *     ProjectInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - creator_id
 *       properties:
 *         title:
 *           type: string
 *           example: "My Awesome Project"
 *         description:
 *           type: string
 *           example: "Detailed description of my project"
 *         creator_id:
 *           type: integer
 *           example: 1
 *         banner:
 *           type: string
 *           example: "https://example.com/banner.jpg"
 *         attachmenturl:
 *           type: string
 *           example: "https://example.com/attachment.pdf"
 *         budget:
 *           type: number
 *           example: 5000.50
 *         sponsors:
 *           type: string
 *           example: "Company A, Company B"
 *         estimated_start:
 *           type: string
 *           format: date-time
 *           example: "2023-12-01T00:00:00Z"
 *         estimated_end:
 *           type: string
 *           format: date-time
 *           example: "2024-06-01T00:00:00Z"
 *         is_published:
 *           type: boolean
 *           example: true
 *         format_id:
 *           type: integer
 *           example: 1
 *         genre_ids:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1, 3, 5]
 *         class_ids:
 *           type: array
 *           items:
 *             type: string
 *           example: ["LCS202", "LCS203"]
 * 
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
 *
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