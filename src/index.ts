#!/usr/bin/env node
import express from 'express';
import { setupApp } from './middleware/appSetup.js';
import { applicationRoutes } from './routes/ApplicationRoutes.js';
import authRoutes from './routes/auth-routes.js';
import { jobRoutes } from './routes/JobRoutes.js';

// Initialize Express app
const app = express();
setupApp(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', jobRoutes);
app.use('/api', applicationRoutes);

// Health check endpoint
app.get('/', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler - must come after all routes
app.use((req, res) => {
  console.warn(`⚠️ 404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString(),
  });
});

export default app;
