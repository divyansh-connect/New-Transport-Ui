const prisma = require('../config/db');

// Get all system notifications (filtered for non-admins to own or global announcements)
const getAllNotifications = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;

    let filter = {};
    if (userRole !== 'admin') {
      filter = {
        OR: [
          { userId: null },
          { userId: userId }
        ]
      };
    }

    const notifications = await prisma.notification.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' }
    });
    return res.json(notifications);
  } catch (error) {
    console.error('Get Notifications Error:', error);
    return res.status(500).json({ error: 'Failed to retrieve notification records.' });
  }
};

// Mark a specific notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const notif = await prisma.notification.findUnique({
      where: { id }
    });

    if (!notif) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    if (userRole !== 'admin' && notif.userId !== userId && notif.userId !== null) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: { read: true }
    });
    return res.json({ message: 'Notification marked as read.', notification });
  } catch (error) {
    console.error('Mark Notification Error:', error);
    return res.status(500).json({ error: 'Failed to update notification status.' });
  }
};

// Clear/Delete notifications (admins clear all, non-admins clear their own)
const clearAll = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole === 'admin') {
      await prisma.notification.deleteMany();
    } else {
      await prisma.notification.deleteMany({
        where: { userId: userId }
      });
    }
    return res.json({ message: 'Notifications cleared successfully.' });
  } catch (error) {
    console.error('Clear Notifications Error:', error);
    return res.status(500).json({ error: 'Failed to clear notifications log.' });
  }
};

// Create a new notification (Admins only)
const createNotification = async (req, res) => {
  try {
    const { title, message, type, userId } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required.' });
    }

    const notification = await prisma.notification.create({
      data: {
        customId: `NOT-${Date.now()}`,
        type: type || 'system',
        title,
        message,
        userId: userId || null
      }
    });

    return res.status(201).json({ message: 'Notification created successfully.', notification });
  } catch (error) {
    console.error('Create Notification Error:', error);
    return res.status(500).json({ error: 'Failed to create notification.' });
  }
};

module.exports = {
  getAllNotifications,
  markAsRead,
  clearAll,
  createNotification
};
