const prisma = require("../models/prismaClient");

// Create Notification
const createNotification = async ({ userId, projectId, content }, client = prisma) => {
    const createdNotification = await client.notifications.create({
      data: {
        content,
        is_read: false,
      },
    });
  
    await client.user_notification.create({
      data: {
        user_id: userId,
        project_id: projectId,
        notif_id: createdNotification.notif_id,
        is_read: false,
      },
    });
  
    return createdNotification;
};

// Create Notification For Multiple Users
const createNotificationForMultipleUsers = async ({ userIds, projectId, content }, tx) => {
    const createdNotification = await tx.notifications.create({
      data: {
        content,
        is_read: false,
      },
    });
  
    const userNotifications = userIds.map(userId => ({
      user_id: userId,
      project_id: projectId,
      notif_id: createdNotification.notif_id,
      is_read: false,
    }));
  
    await tx.user_notification.createMany({
      data: userNotifications,
      skipDuplicates: true,
    });
  
    return createdNotification;
  };
  

// Get Notifications By User ID
const getNotificationsByUserId = async (user_id) => {
    return await prisma.user_notification.findMany({
        where: { user_id: parseInt(user_id) },
        include: { notifications: true },
      });
}

// Toggle Notification Read Status
const toggleNotificationReadStatus = async (notificationId, userId) => {
  return await prisma.user_notification.updateMany({
    where: {
      notif_id: notificationId,
      user_id: userId,
    },
    data: {
      is_read: true,
    },
  });
};

module.exports = {
  createNotification,
  createNotificationForMultipleUsers,
  getNotificationsByUserId,
  toggleNotificationReadStatus,
};
