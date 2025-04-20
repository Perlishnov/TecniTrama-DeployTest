const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Import middleware
const { verifyJWTAndAdmin } = require('../middleware/authMiddleware');
const { authenticateToken } = require('../controllers/authController');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users. Requires authentication.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: integer
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone_num:
 *                     type: string
 *                   registration_date:
 *                     type: string
 *                     format: date-time
 *                   is_active:
 *                     type: boolean
 *                   user_type_id:
 *                     type: integer
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       500:
 *         description: Server error
 */
router.get('/', authenticateToken, userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their ID along with their profile, interests, and roles. Requires authentication.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details with profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserWithProfile'
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
// Get user by ID
router.get('/:id', authenticateToken, userController.getUserById);

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *               - user_type_id
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Must end with @est.intec.edu.do
 *               password:
 *                 type: string
 *                 format: password
 *               phone_num:
 *                 type: string
 *               user_type_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 streamToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Bad request - Missing fields or email validation failed
 *       500:
 *         description: Server error
 */
// Register new user
router.post('/register', userController.registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate a user and return a token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 streamToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Bad request - Invalid credentials or inactive account
 *       500:
 *         description: Server error
 */
// Login user
router.post('/login', userController.loginUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     description: Update user information. Requires admin or own user authentication.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone_num:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *               user_type_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     is_active:
 *                       type: boolean
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
// Update user
router.put('/:id', verifyJWTAndAdmin, userController.updateUser);


/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: Change user password
 *     description: Change the password of the authenticated user. Requires admin or own user authentication.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               old_password:
 *                 type: string
 *                 format: password
 *               new_password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *       403:
 *         description: Forbidden - Invalid password
 *       500:
 *         description: Server error
 */
// Change password
router.put('/change-password', verifyJWTAndAdmin, userController.changePassword);


/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     description: Delete a user by ID. Requires admin or own user authentication.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
// Delete user
router.delete('/:id', verifyJWTAndAdmin, userController.deleteUser);

//Swagger Schema for User
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - password
 *         - user_type_id
 *       properties:
 *         user_id:
 *           type: integer
 *           description: The auto-generated ID of the user
 *         first_name:
 *           type: string
 *           description: User's first name
 *         last_name:
 *           type: string
 *           description: User's last name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address (must end with @est.intec.edu.do)
 *         password:
 *           type: string
 *           format: password
 *           description: User's password (stored as hashed)
 *         phone_num:
 *           type: string
 *           description: User's phone number
 *         registration_date:
 *           type: string
 *           format: date-time
 *           description: Date when user was registered
 *         is_active:
 *           type: boolean
 *           description: Whether the user account is active
 *         user_type_id:
 *           type: integer
 *           description: Type of user (role)
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   tags:
 *     - name: Users
 *       description: User management API
 */

//Swagger Schema for User with Profile
/**
 * @swagger
 * components:
 *   schemas:
 *     UserWithProfile:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         email:
 *           type: string
 *         phone_num:
 *           type: string
 *         registration_date:
 *           type: string
 *           format: date-time
 *         is_active:
 *           type: boolean
 *         user_type_id:
 *           type: integer
 *         profiles:
 *           $ref: '#/components/schemas/UserProfile'
 *
 *     UserProfile:
 *       type: object
 *       properties:
 *         profile_id:
 *           type: integer
 *         experience:
 *           type: string
 *           nullable: true
 *         carreer:
 *           type: string
 *           nullable: true
 *         bio:
 *           type: string
 *           nullable: true
 *         profile_image:
 *           type: string
 *           nullable: true
 *         profile_interest:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProfileInterest'
 *         profile_roles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProfileRole'
 *
 *     ProfileInterest:
 *       type: object
 *       properties:
 *         interest_id:
 *           type: integer
 *         interests:
 *           type: object
 *           properties:
 *             interest_name:
 *               type: string
 *
 *     ProfileRole:
 *       type: object
 *       properties:
 *         role_id:
 *           type: integer
 *         roles:
 *           type: object
 *           properties:
 *             role_name:
 *               type: string
 *             responsibilities:
 *               type: string
 *             department_id:
 *               type: integer
 */


module.exports = router;