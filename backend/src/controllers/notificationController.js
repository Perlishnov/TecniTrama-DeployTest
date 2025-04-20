const notificationService = require('../services/notificationService');
const prismaClient = require('../models/prismaClient'); 

// Get Notifications By User ID
const getNotificationsByUserId = async (req, res) => {
  const { user_id } = req.params;
  try {
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await prismaClient.users.findUnique({
      where: { user_id: parseInt(user_id) },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch notifications for the user
    const notifications = await notificationService.getNotificationsByUserId(user_id);

    // Check if notifications exist
    if (!notifications) {
      return res.status(404).json({ message: 'No notifications found for this user' });
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Toggle Notification Read Status
const toggleNotificationReadStatus = async (req, res) => {
  const { notificationId, userId } = req.params;
  try {
    const updatedNotification = await notificationService.toggleNotificationReadStatus(notificationId, userId);
    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getNotificationsByUserId,
  toggleNotificationReadStatus,
};