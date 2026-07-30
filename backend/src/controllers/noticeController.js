const prisma = require('../config/db');

const DEFAULT_NOTICES = [
  {
    id: 'seed-1',
    customId: 'NOT-SEED-001',
    title: 'High-Demand Cargo Routes Available',
    type: 'Freight',
    priority: 'High',
    location: 'Northern Ports',
    date: '24 Jul 2026',
    description: 'Long-haul freight opportunities open for heavy truck drivers connecting northern ports. Premium rates applied for weekend dispatch.',
    isVisible: true
  },
  {
    id: 'seed-2',
    customId: 'NOT-SEED-002',
    title: 'Partner Workshop Expansion Notice',
    type: 'Partnership',
    priority: 'Normal',
    location: 'All Zones',
    date: '21 Jul 2026',
    description: 'Register oil change centers & workshops for automatic dispatch requests. New API endpoints available for third-party systems.',
    isVisible: true
  },
  {
    id: 'seed-3',
    customId: 'NOT-SEED-003',
    title: 'Monsoon Safety Guidelines',
    type: 'Safety',
    priority: 'Critical',
    location: 'System Wide',
    date: '18 Jul 2026',
    description: 'Mandatory speed limits enforced across all active tracking nodes due to heavy rainfall warnings.',
    isVisible: true
  }
];

async function seedInitialNoticesIfNeeded() {
  try {
    const rows = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM notices`);
    const count = Number(rows[0]?.count || 0);
    if (count === 0) {
      for (const notice of DEFAULT_NOTICES) {
        const id = require('crypto').randomUUID();
        await prisma.$executeRawUnsafe(
          `INSERT INTO notices (id, custom_id, title, type, priority, location, description, date, is_visible, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          id, notice.customId, notice.title, notice.type, notice.priority, notice.location, notice.description, notice.date, 1
        );
      }
    }
  } catch (err) {
    console.error('Error seeding initial notices:', err);
  }
}

// ── GET /api/notices — Fetch active and visible notices for app startup & drivers ──
const getActiveNotices = async (req, res) => {
  try {
    await seedInitialNoticesIfNeeded();
    const rows = await prisma.$queryRawUnsafe(
      `SELECT id, custom_id as customId, title, type, priority, location, description, date, is_visible as isVisible, created_at as createdAt, updated_at as updatedAt FROM notices WHERE is_visible = 1 ORDER BY created_at DESC`
    );
    const notices = rows.map(r => ({ ...r, isVisible: Boolean(r.isVisible) }));
    return res.json(notices);
  } catch (error) {
    console.error('Get Active Notices Error:', error);
    return res.json(DEFAULT_NOTICES.filter(n => n.isVisible));
  }
};

// ── GET /api/notices/all — Fetch all notices (visible & hidden) for Admin dashboard ──
const getAllNotices = async (req, res) => {
  try {
    await seedInitialNoticesIfNeeded();
    const rows = await prisma.$queryRawUnsafe(
      `SELECT id, custom_id as customId, title, type, priority, location, description, date, is_visible as isVisible, created_at as createdAt, updated_at as updatedAt FROM notices ORDER BY created_at DESC`
    );
    const notices = rows.map(r => ({ ...r, isVisible: Boolean(r.isVisible) }));
    return res.json(notices);
  } catch (error) {
    console.error('Get All Notices Error:', error);
    return res.json(DEFAULT_NOTICES);
  }
};

// ── POST /api/notices — Create new notice ──
const createNotice = async (req, res) => {
  try {
    const { title, type, priority, location, description, date } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }

    const id = require('crypto').randomUUID();
    const customId = `NOT-${Date.now()}`;
    const today = new Date();
    const formattedDate = date || `${today.getDate()} ${today.toLocaleString('en', { month: 'short' })} ${today.getFullYear()}`;

    await prisma.$executeRawUnsafe(
      `INSERT INTO notices (id, custom_id, title, type, priority, location, description, date, is_visible, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      id,
      customId,
      title.trim(),
      type || 'Freight',
      priority || 'Normal',
      (location && location.trim()) || 'All Zones',
      description.trim(),
      formattedDate,
      1
    );

    const newNotice = {
      id,
      customId,
      title: title.trim(),
      type: type || 'Freight',
      priority: priority || 'Normal',
      location: (location && location.trim()) || 'All Zones',
      description: description.trim(),
      date: formattedDate,
      isVisible: true
    };

    return res.status(201).json({ message: 'Notice created successfully.', notice: newNotice });
  } catch (error) {
    console.error('Create Notice Error:', error);
    return res.status(500).json({ error: 'Failed to create notice record.' });
  }
};

// ── PUT /api/notices/:id — Update existing notice ──
const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, priority, location, description, isVisible } = req.body;

    const rows = await prisma.$queryRawUnsafe(`SELECT * FROM notices WHERE id = ?`, id);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Notice not found.' });
    }
    const existing = rows[0];

    const newTitle = title !== undefined ? title.trim() : existing.title;
    const newType = type !== undefined ? type : existing.type;
    const newPriority = priority !== undefined ? priority : existing.priority;
    const newLocation = location !== undefined ? location.trim() : existing.location;
    const newDesc = description !== undefined ? description.trim() : existing.description;
    const newVisible = isVisible !== undefined ? (isVisible ? 1 : 0) : existing.is_visible;

    await prisma.$executeRawUnsafe(
      `UPDATE notices SET title = ?, type = ?, priority = ?, location = ?, description = ?, is_visible = ?, updated_at = NOW() WHERE id = ?`,
      newTitle, newType, newPriority, newLocation, newDesc, newVisible, id
    );

    return res.json({
      message: 'Notice updated successfully.',
      notice: {
        id,
        customId: existing.custom_id,
        title: newTitle,
        type: newType,
        priority: newPriority,
        location: newLocation,
        description: newDesc,
        date: existing.date,
        isVisible: Boolean(newVisible)
      }
    });
  } catch (error) {
    console.error('Update Notice Error:', error);
    return res.status(500).json({ error: 'Failed to update notice.' });
  }
};

// ── PUT /api/notices/:id/toggle-visibility — Toggle visibility (hide/show) ──
const toggleNoticeVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await prisma.$queryRawUnsafe(`SELECT * FROM notices WHERE id = ?`, id);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Notice not found.' });
    }
    const existing = rows[0];
    const newVisible = existing.is_visible ? 0 : 1;

    await prisma.$executeRawUnsafe(`UPDATE notices SET is_visible = ?, updated_at = NOW() WHERE id = ?`, newVisible, id);

    return res.json({
      message: `Notice ${newVisible ? 'published' : 'hidden'} successfully.`,
      notice: {
        id,
        customId: existing.custom_id,
        title: existing.title,
        type: existing.type,
        priority: existing.priority,
        location: existing.location,
        description: existing.description,
        date: existing.date,
        isVisible: Boolean(newVisible)
      }
    });
  } catch (error) {
    console.error('Toggle Notice Visibility Error:', error);
    return res.status(500).json({ error: 'Failed to toggle notice visibility.' });
  }
};

// ── DELETE /api/notices/:id — Delete notice ──
const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.$executeRawUnsafe(`DELETE FROM notices WHERE id = ?`, id);
    return res.json({ message: 'Notice deleted successfully.' });
  } catch (error) {
    console.error('Delete Notice Error:', error);
    return res.status(500).json({ error: 'Failed to delete notice.' });
  }
};

module.exports = {
  getActiveNotices,
  getAllNotices,
  createNotice,
  updateNotice,
  toggleNoticeVisibility,
  deleteNotice
};
