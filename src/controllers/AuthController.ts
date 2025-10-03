import type { Request, Response } from 'express';
import { AuthRepository } from '../repositories/AuthRepository.js';
import { AuthService, type LoginCredentials, type RegisterData } from '../services/AuthService.js';

export class AuthController {
  private authService: AuthService;
  private authRepository: AuthRepository;

  constructor() {
    this.authService = new AuthService();
    this.authRepository = new AuthRepository();
  }

  /**
   * Register a new user
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName }: RegisterData = req.body;

      // Validate input
      if (!email || !password || !firstName || !lastName) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Email, password, first name, and last name are required',
        });
        return;
      }

      // Check if user already exists
      const existingUser = await this.authRepository.findUserByEmail(email);
      if (existingUser) {
        res.status(409).json({
          error: 'Conflict',
          message: 'User with this email already exists',
        });
        return;
      }

      // Hash password
      const passwordHash = await this.authService.hashPassword(password);

      // Create user
      const user = await this.authRepository.createUser({
        email,
        passwordHash,
        firstName,
        lastName,
      });

      // Generate JWT token
      const token = this.authService.generateToken(user.id, user.email);

      // Create session
      await this.authRepository.createSession({
        userId: user.id,
        token,
        expiresAt: this.authService.calculateTokenExpiration(),
      });

      // Return success response
      res.status(201).json({
        message: 'User registered successfully',
        user: this.authService.sanitizeUser(user),
        token,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to register user',
      });
    }
  }

  /**
   * Login user
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginCredentials = req.body;

      // Validate input
      if (!email || !password) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Email and password are required',
        });
        return;
      }

      // Find user by email
      const user = await this.authRepository.findUserByEmail(email);
      if (!user) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid email or password',
        });
        return;
      }

      // Verify password
      const isPasswordValid = await this.authService.verifyPassword(password, user.passwordHash);
      if (!isPasswordValid) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid email or password',
        });
        return;
      }

      // Generate JWT token
      const token = this.authService.generateToken(user.id, user.email);

      // Create session
      await this.authRepository.createSession({
        userId: user.id,
        token,
        expiresAt: this.authService.calculateTokenExpiration(),
      });

      // Return success response
      res.json({
        message: 'Login successful',
        user: this.authService.sanitizeUser(user),
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to login',
      });
    }
  }

  /**
   * Logout user
   */
  async logout(req: Request, res: Response): Promise<void> {
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

      // Delete session
      const deleted = await this.authRepository.deleteSession(token);

      if (deleted) {
        res.json({
          message: 'Logout successful',
        });
      } else {
        res.status(404).json({
          error: 'Not found',
          message: 'Session not found',
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to logout',
      });
    }
  }

  /**
   * Get current user profile
   */
  async profile(req: Request, res: Response): Promise<void> {
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

      // Find user
      const user = await this.authRepository.findUserById(decoded.userId);
      if (!user) {
        res.status(404).json({
          error: 'Not found',
          message: 'User not found',
        });
        return;
      }

      // Return user profile
      res.json({
        user: this.authService.sanitizeUser(user),
      });
    } catch (error) {
      console.error('Profile error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to get profile',
      });
    }
  }
}
