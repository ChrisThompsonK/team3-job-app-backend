#!/usr/bin/env node
import express from 'express';
import { setupApp } from './middleware/appSetup.js';
import { adminRoutes } from './routes/AdminRoutes.js';
import { applicationRoutes } from './routes/ApplicationRoutes.js';
import { jobRoutes } from './routes/JobRoutes.js';

// Initialize Express app
const app = express();
setupApp(app);

// Routes
app.use('/api', jobRoutes);
app.use('/api', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.get('/', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
