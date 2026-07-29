const prisma = require('../config/db');

// In-memory fallback store
let inMemoryTickets = [];

const getAllTickets = async (req, res) => {
  try {
    let dbTickets = [];
    try {
      dbTickets = await prisma.ticket.findMany({
        orderBy: { createdAt: 'desc' }
      });
    } catch (e) {
      // Prisma table might not exist yet; use fallback store
      dbTickets = inMemoryTickets;
    }

    // Merge in-memory and DB tickets without duplicates
    const all = [...dbTickets];
    inMemoryTickets.forEach(memItem => {
      if (!all.some(item => item.customId === memItem.customId || item.id === memItem.id)) {
        all.push(memItem);
      }
    });

    const formatted = all.map(t => ({
      id: t.customId || t.id,
      realId: t.id,
      subject: t.subject,
      details: t.details,
      user: t.user,
      phone: t.mobileNo || '—',
      mobileNo: t.mobileNo || '—',
      status: t.status || 'Open',
      date: t.date ? new Date(t.date).toLocaleDateString() : new Date().toLocaleDateString(),
      time: t.createdAt ? new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
      role: 'Mobile User'
    }));

    return res.json(formatted);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return res.status(500).json({ error: 'Failed to fetch support tickets.' });
  }
};

const createTicket = async (req, res) => {
  try {
    const { subject, details, user, mobileNo, customId } = req.body;

    if (!subject || !details) {
      return res.status(400).json({ error: 'Subject and details are required.' });
    }

    const ticketCustomId = customId || `TK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicketObj = {
      id: ticketCustomId,
      customId: ticketCustomId,
      subject,
      details,
      user: user || 'Guest Visitor',
      mobileNo: mobileNo || 'N/A',
      status: 'Open',
      date: new Date(),
      createdAt: new Date()
    };

    try {
      const created = await prisma.ticket.create({
        data: {
          customId: ticketCustomId,
          subject,
          details,
          user: user || 'Guest Visitor',
          mobileNo: mobileNo || 'N/A',
          status: 'Open'
        }
      });
      inMemoryTickets.unshift(created);
      return res.status(201).json({ message: 'Ticket created successfully', ticket: created });
    } catch (dbErr) {
      console.log('Prisma ticket save fallback to in-memory:', dbErr.message);
      inMemoryTickets.unshift(newTicketObj);
      return res.status(201).json({ message: 'Ticket created successfully', ticket: newTicketObj });
    }
  } catch (error) {
    console.error('Error creating ticket:', error);
    return res.status(500).json({ error: 'Failed to create support ticket.' });
  }
};

const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let updated = null;
    try {
      updated = await prisma.ticket.update({
        where: { id },
        data: { status }
      });
    } catch (e) {
      // Find in-memory
      const idx = inMemoryTickets.findIndex(t => t.id === id || t.customId === id);
      if (idx !== -1) {
        inMemoryTickets[idx].status = status;
        updated = inMemoryTickets[idx];
      }
    }

    return res.json({ message: 'Ticket updated successfully', ticket: updated });
  } catch (error) {
    console.error('Error updating ticket:', error);
    return res.status(500).json({ error: 'Failed to update ticket.' });
  }
};

module.exports = {
  getAllTickets,
  createTicket,
  updateTicketStatus
};
