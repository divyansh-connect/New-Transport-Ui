const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');
const {
  getAllUsers,
  getProfile,
  updateProfile,
  updateCoordinates,
  getActivePins,
  approveUser,
  rejectUser,
  deleteUser,
  updateUserProfileAdmin
} = require('../controllers/userController');
const {
  getAllPayments,
  createPaymentRecord,
  deletePaymentRecord
} = require('../controllers/paymentController');
const {
  getAllNotifications,
  markAsRead,
  clearAll,
  createNotification
} = require('../controllers/notificationController');

const { authenticateJWT, authorizeRoles } = require('../middlewares/auth');

// ── Auth Endpoints ───────────────────────────────────────────────────────────
router.post('/auth/register', register);
router.post('/auth/login', login);

// ── Telemetry (Map Pins) - Public ─────────────────────────────────────────────
router.get('/users/pins', getActivePins);

// ── User Profile & GPS Telemetry Sync - Authorized ───────────────────────────
router.get('/users/profile', authenticateJWT, getProfile);
router.put('/users/profile', authenticateJWT, updateProfile);
router.put('/users/coordinates', authenticateJWT, updateCoordinates);

// ── Admin Operations (User Management) - Admins Only ──────────────────────────
router.get('/users', authenticateJWT, authorizeRoles('admin'), getAllUsers);
// Specific sub-paths MUST come before generic /:id to avoid Express route conflict
router.put('/users/:id/approve', authenticateJWT, authorizeRoles('admin'), approveUser);
router.put('/users/:id/reject', authenticateJWT, authorizeRoles('admin'), rejectUser);
// Generic user update (must be AFTER specific sub-paths)
router.put('/users/:id', authenticateJWT, authorizeRoles('admin'), updateUserProfileAdmin);
router.delete('/users/:id', authenticateJWT, authorizeRoles('admin'), deleteUser);

// ── Admin Operations (Payments Auditing) - Admins Only ────────────────────────
router.get('/payments', authenticateJWT, authorizeRoles('admin'), getAllPayments);
router.post('/payments', authenticateJWT, authorizeRoles('admin'), createPaymentRecord);
router.delete('/payments/:id', authenticateJWT, authorizeRoles('admin'), deletePaymentRecord);

// ── System Notifications (Admins manage all, users manage their own) ──────────
router.get('/notifications', authenticateJWT, getAllNotifications);
router.post('/notifications', authenticateJWT, authorizeRoles('admin'), createNotification);
router.put('/notifications/:id/read', authenticateJWT, markAsRead);
router.delete('/notifications', authenticateJWT, clearAll);

module.exports = router;
