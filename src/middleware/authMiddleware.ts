import type { NextFunction, Request, Response } from 'express';
import { AuthRepository } from '../repositories/AuthRepository.js';
import { AuthService } from '../services/AuthService.js';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
      };
    }
  }
}

export class AuthMiddleware {
  private authService: AuthService;
  private authRepository: AuthRepository;

  constructor() {
    this.authService = new AuthService();
    this.authRepository = new AuthRepository();
  }

  /**
   * Middleware to require authentication
   */
  requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

      if (!token) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'No token provided',
        });
        return;
      }

      // Verify token
      const decoded = this.authService.verifyToken(token);
      if (!decoded) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid token',
        });
        return;
      }

      // Check if session exists
      const session = await this.authRepository.findSessionByToken(token);
      if (!session) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'Session not found',
        });
        return;
      }

      // Check if session is expired
      const now = new Date();
      const expiresAt = new Date(session.expiresAt);
      if (now > expiresAt) {
        // Clean up expired session
        await this.authRepository.deleteSession(token);
        res.status(401).json({
          error: 'Unauthorized',
          message: 'Token expired',
        });
        return;
      }

      // Find user
      const user = await this.authRepository.findUserById(decoded.userId);
      if (!user) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'User not found',
        });
        return;
      }



      // Add user to request object
      req.user = this.authService.sanitizeUser(user);
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Authentication failed',
      });
    }
  };

  /**
   * Middleware for optional authentication
   */
  optionalAuth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

      if (!token) {
        next();
        return;
      }

      // Verify token
      const decoded = this.authService.verifyToken(token);
      if (!decoded) {
        next();
        return;
      }

      // Find user
      const user = await this.authRepository.findUserById(decoded.userId);
      if (user) {
        req.user = this.authService.sanitizeUser(user);
      }

      next();
    } catch (error) {
      console.error('Optional auth middleware error:', error);
      next();
    }
  };
}

// Export middleware instance
export const authMiddleware = new AuthMiddleware();