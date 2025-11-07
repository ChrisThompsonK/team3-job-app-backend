import cors from 'cors';
import type { Express, NextFunction, Request, Response } from 'express';
import express from 'express';
import morgan from 'morgan';
import { authMiddleware } from './adminAuth.js';

/**
 * Global error handling middleware
 * Catches any unhandled errors and returns a proper 500 response
 */
const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('❌ Unhandled Error:', err);
  console.error('Stack:', err.stack);

  res.status(500).json({
    error: 'Internal server error',
    message: err.message || 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
  });
};

export const setupApp = (app: Express): void => {
  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(morgan('dev'));

  // JWT Authentication middleware - must come after body parsing
  app.use(authMiddleware);

  // Log all incoming requests
  app.use((req, _res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    console.log('📦 Body:', JSON.stringify(req.body, null, 2));
    if (req.user) {
      console.log('👤 User:', req.user);
    }
    next();
  });

  // Global error handler - MUST be last middleware
  app.use(errorHandler);
};
