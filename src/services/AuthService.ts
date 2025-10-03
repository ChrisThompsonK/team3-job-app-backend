import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import type { User } from '../db/schema.js';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthTokens {
  accessToken: string;
  user: Omit<User, 'passwordHash'>;
}

export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;
  private readonly SALT_ROUNDS = 12;

  constructor() {
    this.JWT_SECRET = process.env['JWT_SECRET'] || 'fallback-secret-key';
    this.JWT_EXPIRES_IN = process.env['JWT_EXPIRES_IN'] || '7d';

    if (process.env['NODE_ENV'] === 'production' && this.JWT_SECRET === 'fallback-secret-key') {
      throw new Error('JWT_SECRET must be set in production environment');
    }
  }

  /**
   * Hash a password with salt
   */
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Verify password against hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT token
   */
  generateToken(userId: number, email: string): string {
    return jwt.sign({ userId, email }, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): { userId: number; email: string } | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as {
        userId: number;
        email: string;
      };
      return decoded;
    } catch {
      return null;
    }
  }

  /**
   * Calculate token expiration date
   */
  calculateTokenExpiration(): string {
    const expirationTime = this.parseExpirationTime(this.JWT_EXPIRES_IN);
    const expirationDate = new Date(Date.now() + expirationTime);
    return expirationDate.toISOString();
  }

  /**
   * Parse expiration time string to milliseconds
   */
  private parseExpirationTime(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([dhm])$/);
    if (!match) {
      throw new Error('Invalid JWT_EXPIRES_IN format');
    }

    const value = Number.parseInt(match[1] || '0', 10);
    const unit = match[2];

    switch (unit) {
      case 'd':
        return value * 24 * 60 * 60 * 1000; // days to milliseconds
      case 'h':
        return value * 60 * 60 * 1000; // hours to milliseconds
      case 'm':
        return value * 60 * 1000; // minutes to milliseconds
      default:
        throw new Error('Invalid time unit in JWT_EXPIRES_IN');
    }
  }

  /**
   * Extract user data without sensitive information
   */
  sanitizeUser(user: User): Omit<User, 'passwordHash'> {
    const { passwordHash: _, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
