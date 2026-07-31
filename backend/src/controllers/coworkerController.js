const bcrypt = require('bcryptjs');
const prisma = require('../config/db');

// List of all 7 core modules in Transport & Logistics Platform
const modulesList = [
  'Dashboard',
  'Users',
  'Payments',
  'Notices',
  'Inquiries',
  'Settings',
  'Notifications'
];

// Helper to generate custom human-readable ID for coworkers (e.g. CWK-101)
const generateCoworkerCustomId = async () => {
  const prefix = 'CWK';
  const startNumber = 101;

  const latestCoworker = await prisma.user.findFirst({
    where: { role: 'coworker' },
    orderBy: { createdAt: 'desc' }
  });

  if (!latestCoworker || !latestCoworker.customId) {
    return `${prefix}-${startNumber}`;
  }

  const parts = latestCoworker.customId.split('-');
  const lastNum = parseInt(parts[parts.length - 1], 10);

  if (isNaN(lastNum)) {
    return `${prefix}-${startNumber}`;
  }

  return `${prefix}-${lastNum + 1}`;
};

// Retrieve all coworker staff accounts and auto-heal missing module permissions
const getCoworkers = async (req, res) => {
  try {
    let coworkers = await prisma.user.findMany({
      where: { role: 'coworker' },
      include: { permissions: true },
      orderBy: { createdAt: 'desc' }
    });

    // Healing logic: add missing modules and remove extra modules
    for (const coworker of coworkers) {
      const existingModules = coworker.permissions.map(p => p.moduleName);
      const missingModules = modulesList.filter(m => !existingModules.includes(m));
      const extraModules = existingModules.filter(m => !modulesList.includes(m));

      if (missingModules.length > 0) {
        await prisma.permission.createMany({
          data: missingModules.map(m => ({
            userId: coworker.id,
            moduleName: m,
            canView: false,
            canAdd: false,
            canEdit: false,
            canDelete: false
          }))
        });
      }

      if (extraModules.length > 0) {
        await prisma.permission.deleteMany({
          where: {
            userId: coworker.id,
            moduleName: { in: extraModules }
          }
        });
      }
    }

    // Re-fetch to return healed data without passwords
    coworkers = await prisma.user.findMany({
      where: { role: 'coworker' },
      include: { permissions: true },
      orderBy: { createdAt: 'desc' }
    });

    const sanitizedCoworkers = coworkers.map(coworker => {
      const { password, ...userWithoutPassword } = coworker;
      return userWithoutPassword;
    });

    return res.json(sanitizedCoworkers);
  } catch (error) {
    console.error('Get Coworkers Error:', error);
    return res.status(500).json({ error: 'Failed to retrieve coworker accounts.' });
  }
};

// Create a new coworker staff member with module permissions
const createCoworker = async (req, res) => {
  try {
    const {
      name,
      lastName,
      mobileNo,
      email,
      password,
      permissions
    } = req.body;

    if (!name || !mobileNo || !password) {
      return res.status(400).json({ error: 'Name, Mobile Number, and Password are required fields.' });
    }

    const finalEmail = (email && email.trim()) ? email.trim().toLowerCase() : null;

    // Check duplicate mobileNo
    const existingMobile = await prisma.user.findUnique({
      where: { mobileNo }
    });
    if (existingMobile) {
      return res.status(400).json({ error: 'Mobile number is already registered.' });
    }

    // Check duplicate email
    if (finalEmail) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: finalEmail }
      });
      if (existingEmail) {
        return res.status(400).json({ error: 'Email address is already registered.' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const customId = await generateCoworkerCustomId();

    // Prepare module permissions
    const permissionCreations = modulesList.map(module => {
      const customPerm = Array.isArray(permissions)
        ? permissions.find(p => p.moduleName === module)
        : null;
      return {
        moduleName: module,
        canView: customPerm ? Boolean(customPerm.canView) : false,
        canAdd: customPerm ? Boolean(customPerm.canAdd) : false,
        canEdit: customPerm ? Boolean(customPerm.canEdit) : false,
        canDelete: customPerm ? Boolean(customPerm.canDelete) : false
      };
    });

    // Create Coworker User
    const newCoworker = await prisma.user.create({
      data: {
        customId,
        name,
        lastName: lastName || null,
        mobileNo,
        email: finalEmail,
        password: hashedPassword,
        role: 'coworker',
        status: 'Approved',
        subscriptionDuration: 'Staff Access',
        amountPaid: '$0.00',
        paymentStatus: 'Paid',
        paymentMethod: 'Staff Bypass',
        permissions: {
          create: permissionCreations
        }
      },
      include: { permissions: true }
    });

    const { password: _, ...coworkerWithoutPassword } = newCoworker;

    return res.status(201).json({
      message: 'Coworker staff account created successfully.',
      coworker: coworkerWithoutPassword
    });
  } catch (error) {
    console.error('Create Coworker Error:', error);
    return res.status(500).json({ error: 'Failed to create coworker staff account.' });
  }
};

// Update an existing coworker's profile & permission matrix
const updateCoworker = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, lastName, mobileNo, email, password, status, permissions } = req.body;

    const coworker = await prisma.user.findFirst({
      where: {
        OR: [{ id: id }, { customId: id }],
        role: 'coworker'
      }
    });

    if (!coworker) {
      return res.status(404).json({ error: 'Coworker entity not found.' });
    }

    const dataToUpdate = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (lastName !== undefined) dataToUpdate.lastName = lastName;
    if (mobileNo !== undefined) dataToUpdate.mobileNo = mobileNo;
    if (status !== undefined) dataToUpdate.status = status;

    if (email !== undefined) {
      const finalEmail = (email && email.trim()) ? email.trim().toLowerCase() : null;
      if (finalEmail) {
        const existingEmail = await prisma.user.findFirst({
          where: { email: finalEmail, NOT: { id: coworker.id } }
        });
        if (existingEmail) {
          return res.status(400).json({ error: 'Email is already used by another account.' });
        }
      }
      dataToUpdate.email = finalEmail;
    }

    if (password && password.trim()) {
      const salt = await bcrypt.genSalt(10);
      dataToUpdate.password = await bcrypt.hash(password, salt);
    }

    // Update User Profile
    const updatedUser = await prisma.user.update({
      where: { id: coworker.id },
      data: dataToUpdate
    });

    // Update Permissions if provided
    if (Array.isArray(permissions) && permissions.length > 0) {
      for (const p of permissions) {
        const moduleName = p.moduleName;
        if (!moduleName || !modulesList.includes(moduleName)) continue;

        await prisma.permission.upsert({
          where: {
            userId_moduleName: {
              userId: coworker.id,
              moduleName: moduleName
            }
          },
          update: {
            canView: Boolean(p.canView),
            canAdd: Boolean(p.canAdd),
            canEdit: Boolean(p.canEdit),
            canDelete: Boolean(p.canDelete)
          },
          create: {
            userId: coworker.id,
            moduleName: moduleName,
            canView: Boolean(p.canView),
            canAdd: Boolean(p.canAdd),
            canEdit: Boolean(p.canEdit),
            canDelete: Boolean(p.canDelete)
          }
        });
      }
    }

    // Fetch updated user with permissions
    const finalCoworker = await prisma.user.findUnique({
      where: { id: coworker.id },
      include: { permissions: true }
    });

    const { password: _, ...sanitizedCoworker } = finalCoworker;

    return res.json({
      message: 'Coworker details & permissions updated successfully.',
      coworker: sanitizedCoworker
    });
  } catch (error) {
    console.error('Update Coworker Error:', error);
    return res.status(500).json({ error: 'Failed to update coworker.' });
  }
};

// Permanently delete a coworker account
const deleteCoworker = async (req, res) => {
  try {
    const { id } = req.params;

    const coworker = await prisma.user.findFirst({
      where: {
        OR: [{ id: id }, { customId: id }],
        role: 'coworker'
      }
    });

    if (!coworker) {
      return res.status(404).json({ error: 'Coworker entity not found.' });
    }

    await prisma.user.delete({ where: { id: coworker.id } });

    return res.json({ message: 'Coworker account deleted successfully.' });
  } catch (error) {
    console.error('Delete Coworker Error:', error);
    return res.status(500).json({ error: 'Failed to delete coworker account.' });
  }
};

// Get current logged-in user's granted module permissions
const getMyPermissions = async (req, res) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized user.' });
    }

    // Admin role has full access to all modules
    if (userRole === 'admin') {
      const fullPermissions = modulesList.map(moduleName => ({
        moduleName,
        canView: true,
        canAdd: true,
        canEdit: true,
        canDelete: true
      }));
      return res.json({ role: userRole, permissions: fullPermissions });
    }

    const permissions = await prisma.permission.findMany({
      where: { userId }
    });

    return res.json({ role: userRole, permissions });
  } catch (error) {
    console.error('Get My Permissions Error:', error);
    return res.status(500).json({ error: 'Failed to fetch user permissions.' });
  }
};

module.exports = {
  modulesList,
  getCoworkers,
  createCoworker,
  updateCoworker,
  deleteCoworker,
  getMyPermissions
};
