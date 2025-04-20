const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../controllers/authController');

// Get Notifications By User ID
/**
 * @swagger
 * /api/notifications/{user_id}:
 *   get:
 *     summary: Get notifications by user ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: The ID of the user.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of notifications for the specified user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       400:
 *         description: User ID is required.
 *       404:
 *         description: User not found or no notifications found for this user.
 *       500:
 *         description: Internal server error.
 */
router.get('/:user_id', authenticateToken, notificationController.getNotificationsByUserId);

// Toggle Notification Read Status
/**
 * @swagger
 * /api/notifications/{notificationId}/{userId}:
 *   patch:
 *     summary: Toggle the read status of a notification for a specific user
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         description: The ID of the notification to toggle.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user associated with the notification.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully toggled the notification read status.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Invalid parameters provided.
 *       404:
 *         description: Notification or user not found.
 *       500:
 *         description: Internal server error.
 */
router.patch('/:notificationId/:userId', authenticateToken, notificationController.toggleNotificationReadStatus);

// Swagger Schemas
/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *           description: The ID of the user.
 *         project_id:
 *           type: integer
 *           description: The ID of the project.
 *         notif_id:
 *           type: integer
 *           description: The ID of the notification.
 *         is_read:
 *           type: boolean
 *           description: Indicates if the notification has been read.
 */

module.exports = router;