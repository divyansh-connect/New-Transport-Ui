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
const {
  getAllTickets,
  createTicket,
  updateTicketStatus
} = require('../controllers/ticketController');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const {
  getActiveNotices,
  getAllNotices,
  createNotice,
  updateNotice,
  toggleNoticeVisibility,
  deleteNotice
} = require('../controllers/noticeController');
const {
  getCoworkers,
  createCoworker,
  updateCoworker,
  deleteCoworker,
  getMyPermissions
} = require('../controllers/coworkerController');

const { authenticateJWT, authorizeRoles } = require('../middlewares/auth');
const { checkPermission } = require('../middlewares/permission');

// ── Auth Endpoints ───────────────────────────────────────────────────────────
router.post('/auth/register', register);
router.post('/auth/login', login);

// ── Telemetry (Map Pins) - Public ─────────────────────────────────────────────
router.get('/users/pins', getActivePins);

// ── Opportunity & Broadcast Notices ──────────────────────────────────────────
router.get('/notices', getActiveNotices);
router.get('/notices/all', authenticateJWT, authorizeRoles('admin', 'coworker'), checkPermission('Notices', 'view'), getAllNotices);
router.post('/notices', authenticateJWT, authorizeRoles('admin', 'coworker'), checkPermission('Notices', 'add'), createNotice);
router.put('/notices/:id/toggle-visibility', authenticateJWT, authorizeRoles('admin', 'coworker'), checkPermission('Notices', 'edit'), toggleNoticeVisibility);
router.put('/notices/:id', authenticateJWT, authorizeRoles('admin', 'coworker'), checkPermission('Notices', 'edit'), updateNotice);
router.delete('/notices/:id', authenticateJWT, authorizeRoles('admin', 'coworker'), checkPermission('Notices', 'delete'), deleteNotice);

// ── Support Inquiries / Tickets ───────────────────────────────────────────────
router.get('/inquiries', authenticateJWT, authorizeRoles('admin', 'coworker'), checkPermission('Inquiries', 'view'), getAllTickets);
router.post('/inquiries', createTicket);
router.put('/inquiries/:id', authenticateJWT, authorizeRoles('admin', 'coworker'), checkPermission('Inquiries', 'edit'), updateTicketStatus);

// ── User Profile & GPS Telemetry Sync - Authorized ───────────────────────────
router.get('/users/profile', authenticateJWT, getProfile);
router.put('/users/profile', authenticateJWT, updateProfile);
router.put('/users/coordinates', authenticateJWT, updateCoordinates);

// ── Admin & Staff Operations (User Management) ─────────────────────────────────
router.get('/users', authenticateJWT, authorizeRoles('admin', 'coworker'), checkPermission('Users', 'view'), getAllUsers);
router.put('/users/:id/approve', authenticateJWT, authorizeRoles('admin', 'coworker'), checkPermission('Users', 'edit'), approveUser);
router.put('/users/:id/reject', authenticateJWT, authorizeRoles('admin', 'coworker'), checkPermission('Users', 'edit'), rejectUser);
router.put('/users/:id', authenticateJWT, authorizeRoles('admin', 'coworker'), checkPermission('Users', 'edit'), updateUserProfileAdmin);
router.delete('/users/:id', authenticateJWT, authorizeRoles('admin', 'coworker'), checkPermission('Users', 'delete'), deleteUser);

// ── Admin & Staff Operations (Payments Auditing) ──────────────────────────────
router.get('/payments', authenticateJWT, authorizeRoles('admin', 'coworker'), checkPermission('Payments', 'view'), getAllPayments);
router.post('/payments', authenticateJWT, authorizeRoles('admin', 'coworker'), checkPermission('Payments', 'add'), createPaymentRecord);
router.delete('/payments/:id', authenticateJWT, authorizeRoles('admin', 'coworker'), checkPermission('Payments', 'delete'), deletePaymentRecord);

// ── System Notifications ──────────────────────────────────────────────────────
router.get('/notifications', authenticateJWT, authorizeRoles('admin', 'coworker'), checkPermission('Notifications', 'view'), getAllNotifications);
router.post('/notifications', authenticateJWT, authorizeRoles('admin', 'coworker'), checkPermission('Notifications', 'add'), createNotification);
router.put('/notifications/:id/read', authenticateJWT, markAsRead);
router.delete('/notifications', authenticateJWT, clearAll);

// ── Platform Settings ─────────────────────────────────────────────────────────
router.get('/settings', getSettings);
router.put('/settings', authenticateJWT, authorizeRoles('admin', 'coworker'), checkPermission('Settings', 'edit'), updateSettings);

// ── Coworkers & Granular Permissions Management ───────────────────────────────
router.get('/coworkers', authenticateJWT, authorizeRoles('admin', 'coworker'), getCoworkers);
router.post('/coworkers', authenticateJWT, authorizeRoles('admin'), createCoworker);
router.put('/coworkers/:id', authenticateJWT, authorizeRoles('admin'), updateCoworker);
router.delete('/coworkers/:id', authenticateJWT, authorizeRoles('admin'), deleteCoworker);
router.get('/permissions/me', authenticateJWT, getMyPermissions);

module.exports = router;
