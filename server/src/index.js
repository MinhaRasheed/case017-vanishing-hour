const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/saves', require('./routes/saves'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/cases', require('./routes/cases'));
app.use('/api/verify', require('./routes/verify'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    game: 'CASE: 017 — The Vanishing Hour',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve frontend in production build if client/dist exists
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(clientDistPath, 'index.html'));
    }
    next();
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  CASE: 017 — The Vanishing Hour [Investigation Server]`);
  console.log(`  Running on http://localhost:${PORT}`);
  console.log(`  Database: SQLite (WAL mode active)`);
  console.log(`=======================================================`);
});
