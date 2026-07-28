const prisma = require('../config/db');

// Get all system notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
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

// Clear/Delete all notifications
const clearAll = async (req, res) => {
  try {
    await prisma.notification.deleteMany();
    return res.json({ message: 'All notifications cleared successfully.' });
  } catch (error) {
    console.error('Clear Notifications Error:', error);
    return res.status(500).json({ error: 'Failed to clear notifications log.' });
  }
};

module.exports = {
  getAllNotifications,
  markAsRead,
  clearAll
};
