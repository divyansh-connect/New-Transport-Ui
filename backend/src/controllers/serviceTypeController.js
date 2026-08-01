const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all service categories sorted by display order
const getAllServiceTypes = async (req, res) => {
  try {
    const services = await prisma.serviceType.findMany({
      orderBy: { displayOrder: 'asc' }
    });
    return res.json(services);
  } catch (error) {
    console.error('Get service types error:', error);
    return res.status(500).json({ error: 'Failed to retrieve service categories.' });
  }
};

// Create a new dynamic service category (Admin only)
const createServiceType = async (req, res) => {
  try {
    const { name, iconName, pinColor, isActive, displayOrder } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required.' });
    }
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const existing = await prisma.serviceType.findFirst({ where: { slug } });
    if (existing) {
      return res.status(400).json({ error: 'A service category with a similar name already exists.' });
    }

    const service = await prisma.serviceType.create({
      data: {
        name,
        slug,
        iconName: iconName || 'map-pin',
        pinColor: pinColor || '#2563EB',
        isActive: isActive !== undefined ? isActive : true,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : 0
      }
    });
    return res.status(201).json(service);
  } catch (error) {
    console.error('Create service type error:', error);
    return res.status(500).json({ error: 'Failed to create service category.' });
  }
};

// Update an existing category (Admin only)
const updateServiceType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, iconName, pinColor, isActive, displayOrder } = req.body;
    
    const service = await prisma.serviceType.findUnique({ where: { id } });
    if (!service) {
      return res.status(404).json({ error: 'Service category not found.' });
    }

    let slug = service.slug;
    if (name && name.trim() !== service.name) {
      slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const existing = await prisma.serviceType.findFirst({
        where: { slug, id: { not: id } }
      });
      if (existing) {
        return res.status(400).json({ error: 'A service category with a similar name already exists.' });
      }
    }

    const updated = await prisma.serviceType.update({
      where: { id },
      data: {
        name: name || undefined,
        slug,
        iconName: iconName || undefined,
        pinColor: pinColor || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : undefined
      }
    });
    return res.json(updated);
  } catch (error) {
    console.error('Update service type error:', error);
    return res.status(500).json({ error: 'Failed to update service category.' });
  }
};

// Delete a category (Admin only) with Delete Safety checks
const deleteServiceType = async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await prisma.serviceType.findFirst({
      where: { OR: [{ id }, { slug: id }] }
    });
    if (!service) {
      return res.status(404).json({ error: 'Service category not found.' });
    }

    // Delete Safety: Check if users are registered in this category
    const userCount = await prisma.user.count({
      where: { serviceTypeId: service.id }
    });

    if (userCount > 0) {
      return res.status(400).json({
        error: `Delete blocked. There are ${userCount} users registered under the "${service.name}" category.`
      });
    }

    await prisma.serviceType.delete({ where: { id: service.id } });
    return res.json({ message: 'Service category deleted successfully.' });
  } catch (error) {
    console.error('Delete service type error:', error);
    return res.status(500).json({ error: 'Failed to delete service category.' });
  }
};

module.exports = {
  getAllServiceTypes,
  createServiceType,
  updateServiceType,
  deleteServiceType
};
