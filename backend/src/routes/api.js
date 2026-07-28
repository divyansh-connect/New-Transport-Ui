const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');
const {
  getAllUsers,
  updateProfile,
  updateCoordinates,
  getActivePins,
  approveUser,
  rejectUser,
  deleteUser
} = require('../controllers/userController');
const {
  getAllPayments,
  createPaymentRecord,
  deletePaymentRecord
} = require('../controllers/paymentController');
const {
  getAllNotifications,
  markAsRead,
  clearAll
} = require('../controllers/notificationController');

const { authenticateJWT, authorizeRoles } = require('../middlewares/auth');

// ── Auth Endpoints ───────────────────────────────────────────────────────────
router.post('/auth/register', register);
router.post('/auth/login', login);

// ── Telemetry (Map Pins) - Public ─────────────────────────────────────────────
router.get('/users/pins', getActivePins);

// ── User Profile & GPS Telemetry Sync - Authorized ───────────────────────────
router.put('/users/profile', authenticateJWT, updateProfile);
router.put('/users/coordinates', authenticateJWT, updateCoordinates);

// ── Admin Operations (User Management) - Admins Only ──────────────────────────
router.get('/users', authenticateJWT, authorizeRoles('admin'), getAllUsers);
router.put('/users/:id/approve', authenticateJWT, authorizeRoles('admin'), approveUser);
router.put('/users/:id/reject', authenticateJWT, authorizeRoles('admin'), rejectUser);
router.delete('/users/:id', authenticateJWT, authorizeRoles('admin'), deleteUser);

// ── Admin Operations (Payments Auditing) - Admins Only ────────────────────────
router.get('/payments', authenticateJWT, authorizeRoles('admin'), getAllPayments);
router.post('/payments', authenticateJWT, authorizeRoles('admin'), createPaymentRecord);
router.delete('/payments/:id', authenticateJWT, authorizeRoles('admin'), deletePaymentRecord);

// ── Admin Operations (System Notifications) - Admins Only ─────────────────────
router.get('/notifications', authenticateJWT, authorizeRoles('admin'), getAllNotifications);
router.put('/notifications/:id/read', authenticateJWT, authorizeRoles('admin'), markAsRead);
router.delete('/notifications', authenticateJWT, authorizeRoles('admin'), clearAll);

module.exports = router;
