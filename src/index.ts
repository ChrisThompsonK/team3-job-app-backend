#!/usr/bin/env node
import express from 'express';
import { appRoutes } from './routes/appRoutes.js';
import { setupApp } from './middleware/appSetup.js';

// Initialize Express app
const app = express();
setupApp(app);

// Routes
app.use('/', appRoutes);
app.get('/health', (_req, res) =>{
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;


