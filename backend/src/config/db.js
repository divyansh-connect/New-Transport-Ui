const { PrismaClient } = require('@prisma/client');

// Initialize Prisma client
const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

module.exports = prisma;
