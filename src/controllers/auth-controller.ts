import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authService, type LoginCredentials, type RegisterData } from '../services/auth-service.js';

export class AuthController {
  // POST /api/auth/register - Register a new user
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, confirmPassword } = req.body as RegisterData;

      const user = await authService.register({
        email,
        password,
        confirmPassword,
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  };

  // POST /api/auth/login - Login user
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body as LoginCredentials;

      const user = await authService.login({
        email,
        password,
      });

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env['JWT_SECRET'] || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      res.status(401).json({
        success: false,
        error: message,
      });
    }
  };

  // GET /api/auth/user/:id - Get user by ID
  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'User ID is required',
        });
        return;
      }

      const user = await authService.getUserById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get user';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  };
}

export const authController = new AuthController();
