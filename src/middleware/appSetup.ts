import cors from 'cors';
import type { Express } from 'express';
import express from 'express';
import morgan from 'morgan';
import { authMiddleware } from './adminAuth.js';

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
};
