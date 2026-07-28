require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api');
const prisma = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming JSON payloads
app.use(express.json());

// Mount central routing system
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Basic database query connectivity verification
    await prisma.$queryRaw`SELECT 1`;
    return res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date()
    });
  } catch (error) {
    return res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  return res.status(500).json({
    error: 'Internal server error occurred.'
  });
});

// Start listening for requests
app.listen(PORT, () => {
  console.log(`🚀 Secure Transport Telemetry Backend listening on http://localhost:${PORT}`);
});
