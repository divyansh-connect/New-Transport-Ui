const prisma = require('../config/db');

// Retrieve all users (with optional filters for admin dashboard)
const getAllUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;

    const whereClause = {
      // Always exclude internal admin and sub-admin accounts
      NOT: { role: { in: ['admin', 'coworker'] } }
    };

    if (role) {
      const category = await prisma.serviceType.findFirst({ where: { slug: role.toLowerCase().trim() } });
      if (category) {
        whereClause.OR = [
          { role: role.toLowerCase() },
          { serviceTypeId: category.id }
        ];
      } else {
        whereClause.role = role.toLowerCase();
      }
    }
    if (status) {
      whereClause.status = status;
    }
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { customId: { contains: search } },
        { email: { contains: search } },
        { mobileNo: { contains: search } }
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        customId: true,
        name: true,
        lastName: true,
        mobileNo: true,
        carPlateNumber: true,
        email: true,
        role: true,
        serviceTypeId: true,
        serviceType: {
          select: {
            id: true,
            name: true,
            slug: true,
            iconName: true,
            pinColor: true
          }
        },
        status: true,
        registrationDate: true,
        subscriptionDuration: true,
        amountPaid: true,
        paymentStatus: true,
        paymentMethod: true,
        latitude: true,
        longitude: true,
        trackLocation: true,
        rejectionReason: true,
        licenseName: true,
        licenseStatus: true,
        licenseUrl: true,
        insuranceName: true,
        insuranceStatus: true,
        insuranceUrl: true,
        backgroundCheckName: true,
        backgroundCheckStatus: true,
        backgroundCheckUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.json(users);
  } catch (error) {
    console.error('Get Users Error:', error);
    return res.status(500).json({ error: 'Internal server error occurred.' });
  }
};

// Get current user profile by JWT token
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User entity not found.' });
    }

    const { password: _, ...userWithoutPassword } = user;
    return res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
};

// Update personal user profile details & document credentials
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      lastName,
      mobileNo,
      email,
      carPlateNumber,
      licenseName,
      insuranceName,
      backgroundCheckName,
      paymentStatus,
      paymentMethod,
      amountPaid,
      trackLocation,
      latitude,
      longitude
    } = req.body;

    const finalEmail = (email !== undefined) 
      ? ((email && email.trim()) ? email.trim().toLowerCase() : null)
      : undefined;

    if (finalEmail) {
      const existingEmail = await prisma.user.findFirst({
        where: {
          email: finalEmail,
          NOT: { id: userId }
        }
      });
      if (existingEmail) {
        return res.status(400).json({ error: 'Email is already registered by another user.' });
      }
    }

    const dataToUpdate = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (lastName !== undefined) dataToUpdate.lastName = lastName;
    if (mobileNo !== undefined) dataToUpdate.mobileNo = mobileNo;
    if (finalEmail !== undefined) dataToUpdate.email = finalEmail;
    if (carPlateNumber !== undefined) dataToUpdate.carPlateNumber = carPlateNumber;
    if (licenseName !== undefined) dataToUpdate.licenseName = licenseName;
    if (insuranceName !== undefined) dataToUpdate.insuranceName = insuranceName;
    if (backgroundCheckName !== undefined) dataToUpdate.backgroundCheckName = backgroundCheckName;
    if (paymentStatus !== undefined) dataToUpdate.paymentStatus = paymentStatus;
    if (paymentMethod !== undefined) dataToUpdate.paymentMethod = paymentMethod;
    if (amountPaid !== undefined) dataToUpdate.amountPaid = amountPaid;
    if (trackLocation !== undefined) dataToUpdate.trackLocation = trackLocation;
    if (latitude !== undefined) dataToUpdate.latitude = parseFloat(latitude);
    if (longitude !== undefined) dataToUpdate.longitude = parseFloat(longitude);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate
    });

    const { password: _, ...userWithoutPassword } = updatedUser;

    return res.json({
      message: 'Profile updated successfully.',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
};

// Update live tracking GPS coordinates
const updateCoordinates = async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Latitude and Longitude are required coordinates.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      },
      select: {
        id: true,
        customId: true,
        name: true,
        latitude: true,
        longitude: true,
        trackLocation: true
      }
    });

    return res.json({
      message: 'GPS Coordinates synchronized.',
      location: updatedUser
    });
  } catch (error) {
    console.error('Update Coordinates Error:', error);
    return res.status(500).json({ error: 'Failed to update telemetry location.' });
  }
};

// Get map telemetry pins for all active/approved entities
const getActivePins = async (req, res) => {
  try {
    const pins = await prisma.user.findMany({
      where: {
        status: 'Approved',
        latitude: { not: null },
        longitude: { not: null }
      },
      select: {
        id: true,
        customId: true,
        name: true,
        role: true,
        latitude: true,
        longitude: true,
        carPlateNumber: true,
        serviceType: {
          select: {
            name: true,
            slug: true,
            iconName: true,
            pinColor: true
          }
        }
      }
    });

    const formatted = pins.map(p => ({
      id: p.id,
      customId: p.customId,
      name: p.name,
      role: p.serviceType?.slug || p.role,
      latitude: p.latitude,
      longitude: p.longitude,
      carPlateNumber: p.carPlateNumber,
      iconName: p.serviceType?.iconName || 'map-pin',
      pinColor: p.serviceType?.pinColor || '#2563EB'
    }));

    return res.json(formatted);
  } catch (error) {
    console.error('Get Active Pins Error:', error);
    return res.status(500).json({ error: 'Failed to fetch telemetry markers.' });
  }
};

// Admin operation: Approve user and verify documents
const approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ id: id }, { customId: id }]
      }
    });
    if (!user) {
      return res.status(404).json({ error: 'User entity not found.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        status: 'Approved',
        licenseStatus: 'Verified',
        insuranceStatus: 'Verified',
        backgroundCheckStatus: 'Verified',
        paymentStatus: 'Paid',
        rejectionReason: ''
      }
    });

    // Create system notification
    await prisma.notification.create({
      data: {
        customId: `NOT-${Date.now()}`,
        type: 'approval',
        title: 'Entity Approved',
        message: `${updatedUser.name} (ID: ${updatedUser.customId}) has been approved and marked active.`,
        userId: updatedUser.id
      }
    });

    // Auto create payment record if not already exists and user was previously unpaid
    if (user.paymentStatus === 'Unpaid') {
      await prisma.payment.create({
        data: {
          customId: `PAY-${Date.now()}`,
          driverId: updatedUser.id,
          name: `${updatedUser.name} ${updatedUser.lastName || ''}`.trim(),
          amount: updatedUser.amountPaid,
          gateway: 'Credit Card',
          status: 'Completed'
        }
      });
    }

    return res.json({ message: 'User approved and verified successfully.', user: updatedUser });
  } catch (error) {
    console.error('Approve User Error:', error);
    return res.status(500).json({ error: 'Failed to approve user.' });
  }
};

// Admin operation: Reject user registration request
const rejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ error: 'A rejection reason is required.' });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ id: id }, { customId: id }]
      }
    });
    if (!user) {
      return res.status(404).json({ error: 'User entity not found.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        status: 'Rejected',
        rejectionReason: reason
      }
    });

    // Create system notification
    await prisma.notification.create({
      data: {
        customId: `NOT-${Date.now()}`,
        type: 'rejection',
        title: 'Entity Rejected',
        message: `${updatedUser.name} (ID: ${updatedUser.customId}) has been rejected. Reason: ${reason}`,
        userId: updatedUser.id
      }
    });

    return res.json({ message: 'User registration request rejected.', user: updatedUser });
  } catch (error) {
    console.error('Reject User Error:', error);
    return res.status(500).json({ error: 'Failed to reject user.' });
  }
};

// Admin operation: Delete user profile
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ id: id }, { customId: id }]
      }
    });
    if (!user) {
      return res.status(404).json({ error: 'User entity not found.' });
    }

    await prisma.user.delete({ where: { id: user.id } });

    return res.json({ message: 'User profile permanently deleted.' });
  } catch (error) {
    console.error('Delete User Error:', error);
    return res.status(500).json({ error: 'Failed to delete user profile.' });
  }
};

// Admin operation: Update any user's profile details
const updateUserProfileAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      lastName,
      mobileNo,
      email,
      carPlateNumber,
      licenseName,
      insuranceName,
      paymentStatus,
      paymentMethod,
      amountPaid,
      trackLocation,
      latitude,
      longitude,
      status,
      serviceTypeId
    } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ id: id }, { customId: id }]
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User entity not found.' });
    }

    const finalEmail = (email !== undefined) 
      ? ((email && email.trim()) ? email.trim().toLowerCase() : null)
      : undefined;

    if (finalEmail) {
      const existingEmail = await prisma.user.findFirst({
        where: {
          email: finalEmail,
          NOT: { id: user.id }
        }
      });
      if (existingEmail) {
        return res.status(400).json({ error: 'Email is already registered by another user.' });
      }
    }

    const dataToUpdate = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (lastName !== undefined) dataToUpdate.lastName = lastName;
    if (mobileNo !== undefined) dataToUpdate.mobileNo = mobileNo;
    if (finalEmail !== undefined) dataToUpdate.email = finalEmail;
    if (carPlateNumber !== undefined) dataToUpdate.carPlateNumber = carPlateNumber;
    if (licenseName !== undefined) dataToUpdate.licenseName = licenseName;
    if (insuranceName !== undefined) dataToUpdate.insuranceName = insuranceName;
    if (paymentStatus !== undefined) dataToUpdate.paymentStatus = paymentStatus;
    if (paymentMethod !== undefined) dataToUpdate.paymentMethod = paymentMethod;
    if (amountPaid !== undefined) dataToUpdate.amountPaid = amountPaid;
    if (trackLocation !== undefined) dataToUpdate.trackLocation = trackLocation;
    if (latitude !== undefined) dataToUpdate.latitude = parseFloat(latitude);
    if (longitude !== undefined) dataToUpdate.longitude = parseFloat(longitude);
    if (status !== undefined) dataToUpdate.status = status;
    if (serviceTypeId !== undefined) {
      dataToUpdate.serviceTypeId = serviceTypeId;
      if (serviceTypeId) {
        const cat = await prisma.serviceType.findUnique({ where: { id: serviceTypeId } });
        if (cat) {
          const lower = cat.slug.toLowerCase();
          if (lower === 'driver') dataToUpdate.role = 'driver';
          else if (lower === 'workshop') dataToUpdate.role = 'workshop';
          else if (lower === 'oil') dataToUpdate.role = 'oil';
          else dataToUpdate.role = 'visitor';
        }
      } else {
        dataToUpdate.serviceTypeId = null;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: dataToUpdate
    });

    const { password: _, ...userWithoutPassword } = updatedUser;

    return res.json({
      message: 'User profile updated by admin successfully.',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Admin Update Profile Error:', error);
    return res.status(500).json({ error: 'Failed to update user profile.' });
  }
};

module.exports = {
  getAllUsers,
  getProfile,
  updateProfile,
  updateCoordinates,
  getActivePins,
  approveUser,
  rejectUser,
  deleteUser,
  updateUserProfileAdmin
};
