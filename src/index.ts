#!/usr/bin/env node
import express from 'express';
import { setupApp } from './middleware/appSetup.js';
import { jobRoutes } from './routes/JobRoutes.js';

// Initialize Express app
const app = express();
setupApp(app);

// Routes
app.use('/api', jobRoutes);
app.get('/', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
