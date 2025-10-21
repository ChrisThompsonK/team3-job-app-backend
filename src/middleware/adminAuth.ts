import type { NextFunction, Request, Response } from 'express';

/**
 * Middleware to check if the user has admin privileges
 * Expects an 'x-user-role' header with value 'admin'
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const userRole = req.headers['x-user-role'];

  if (userRole !== 'admin') {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required. You do not have permission to access this resource.',
    });
    return;
  }

  next();
};
