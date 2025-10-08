#!/usr/bin/env node

import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import { appRoutes } from './routes/appRoutes.js';

const app = express();
const PORT = process.env['PORT'] || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', appRoutes);

// Legacy greeting function (kept for backward compatibility)
const greeting = (name: string): string => {
  return `Hello, ${name}! Welcome to the Team 3 Job Application Backend.`;
};

const startServer = async (): Promise<void> => {
  try {
    console.log('🚀 Team 3 Job App Backend is starting...');

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

// Start the server
await startServer();

export { app, greeting, startServer };
