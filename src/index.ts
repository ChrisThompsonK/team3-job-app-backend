#!/usr/bin/env node

import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import { appRoutes } from './routes/appRoutes.js';
import { authRoutes } from './routes/authRoutes.js';

const app = express();
const PORT = process.env['PORT'] || 3000;

// Middleware
app.use(cors({
  origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', appRoutes);
app.use('/auth', authRoutes);

// Legacy greeting function (kept for backward compatibility)
const greeting = (name: string): string => {
  return `Hello, ${name}! Welcome to the Team 3 Job Application Backend.`;
};

const startServer = async (): Promise<void> => {
  try {
    console.log('🚀 Team 3 Job App Frontend is starting...');

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check available at http://localhost:${PORT}/health`);
      console.log(greeting('Developer'));
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

// Only run server if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await startServer();
}

export { app, greeting, startServer };
