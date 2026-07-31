const prisma = require('../config/db');

/**
 * Middleware to check granular module permission for staff/coworker users.
 * @param {string} moduleName - Name of module (e.g. 'Users', 'Payments', 'Notices', etc.)
 * @param {string} action - 'view' | 'add' | 'edit' | 'delete'
 */
const checkPermission = (moduleName, action) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: Access token missing.' });
      }

      // System Admin gets full access (bypass)
      if (userRole === 'admin') {
        return next();
      }

      // Only coworker role is evaluated against granular module permissions
      if (userRole !== 'coworker') {
        return res.status(403).json({ error: `Access denied. ${userRole} role is not authorized.` });
      }

      // Find permission record for this user and module
      const permission = await prisma.permission.findUnique({
        where: {
          userId_moduleName: {
            userId: userId,
            moduleName: moduleName
          }
        }
      });

      if (!permission) {
        return res.status(403).json({
          error: `Access denied. You do not have permissions for the ${moduleName} module.`
        });
      }

      let hasAccess = false;
      const act = action.toLowerCase();
      if (act === 'view') hasAccess = permission.canView;
      else if (act === 'add') hasAccess = permission.canAdd;
      else if (act === 'edit') hasAccess = permission.canEdit;
      else if (act === 'delete') hasAccess = permission.canDelete;

      if (!hasAccess) {
        return res.status(403).json({
          error: `Permission denied. You are not authorized to ${act} in the ${moduleName} module.`
        });
      }

      next();
    } catch (error) {
      console.error('Check Permission Middleware Error:', error);
      return res.status(500).json({ error: 'Internal server error checking module permissions.' });
    }
  };
};

module.exports = {
  checkPermission
};
