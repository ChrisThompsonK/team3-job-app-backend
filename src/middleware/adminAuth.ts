import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// JWT payload interface to match frontend token structure
interface AccessTokenPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
  ver: number;
}

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware to verify JWT and extract user information
 */
export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token provided, continue as anonymous user
    next();
    return;
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    // Use the same JWT secret as frontend (you may need to configure this)
    const JWT_SECRET = process.env['JWT_ACCESS_SECRET'] || 'your-jwt-secret';
    const payload = jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
    
    // Attach user info to request
    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch (error) {
    // Invalid token, continue as anonymous user
    console.log('Invalid JWT token:', error instanceof Error ? error.message : 'Unknown error');
    next();
  }
};

/**
 * Middleware to check if the user has admin privileges
 * Expects a valid JWT token with admin role
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required. Please provide a valid JWT token.',
    });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required. You do not have permission to access this resource.',
    });
    return;
  }

  next();
};
