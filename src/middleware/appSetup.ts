import cors from 'cors';
import type { Express } from 'express';
import express from 'express';
import morgan from 'morgan';

export const setupApp = (app: Express): void => {
  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(morgan('dev'));
};
