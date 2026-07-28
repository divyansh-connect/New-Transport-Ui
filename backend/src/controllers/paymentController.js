const prisma = require('../config/db');

// Get all payment transactions
const getAllPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            mobileNo: true,
            email: true
          }
        }
      }
    });
    return res.json(payments);
  } catch (error) {
    console.error('Get Payments Error:', error);
    return res.status(500).json({ error: 'Failed to retrieve payment records.' });
  }
};

// Create a new manual payment audit log (Admin utility)
const createPaymentRecord = async (req, res) => {
  try {
    const { driverId, amount, gateway, status } = req.body;

    if (!driverId || !amount) {
      return res.status(400).json({ error: 'driverId and amount are required.' });
    }

    const user = await prisma.user.findUnique({ where: { id: driverId } });
    if (!user) {
      return res.status(404).json({ error: 'Associated user account not found.' });
    }

    const payment = await prisma.payment.create({
      data: {
        customId: `PAY-${Date.now()}`,
        driverId,
        name: `${user.name} ${user.lastName || ''}`.trim(),
        amount,
        gateway: gateway || 'Credit Card',
        status: status || 'Completed'
      }
    });

    // Notify administrators
    await prisma.notification.create({
      data: {
        customId: `NOT-${Date.now()}`,
        type: 'payment',
        title: 'Registration Fee Paid',
        message: `Payment of ${amount} confirmed for ${user.name}.`,
        userId: user.id
      }
    });

    return res.status(201).json({ message: 'Payment record logged successfully.', payment });
  } catch (error) {
    console.error('Create Payment Error:', error);
    return res.status(500).json({ error: 'Failed to log transaction.' });
  }
};

// Delete transaction audit log
const deletePaymentRecord = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.payment.delete({ where: { id } });
    return res.json({ message: 'Payment audit record deleted.' });
  } catch (error) {
    console.error('Delete Payment Error:', error);
    return res.status(500).json({ error: 'Failed to delete transaction record.' });
  }
};

module.exports = {
  getAllPayments,
  createPaymentRecord,
  deletePaymentRecord
};
