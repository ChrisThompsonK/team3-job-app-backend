import bcrypt from 'bcrypt';
import type { InsertUser, User } from '../db/schema.js';
import { userRepository } from '../repositories/user-repository.js';

const SALT_ROUNDS = 10;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
}

export class AuthService {
  async register(registerData: RegisterData): Promise<User> {
    const { email, password, confirmPassword } = registerData;

    // Sanitize input
    const sanitizedEmail = email?.trim().toLowerCase();

    // Validation
    if (!sanitizedEmail || !password || !confirmPassword) {
      throw new Error('All fields are required');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      throw new Error('Please enter a valid email address');
    }

    // Password confirmation check
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Validate password strength
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Check if email already exists
    const existingUser = await userRepository.findByEmail(sanitizedEmail);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const newUser: InsertUser = {
      email: sanitizedEmail,
      passwordHash,
      role: 'user',
      isActive: true,
    };

    return userRepository.create(newUser);
  }

  async login(credentials: LoginCredentials): Promise<User> {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = await userRepository.findByEmail(email.toLowerCase());
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    await userRepository.updateLastLogin(user.id);

    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return userRepository.findById(id);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export const authService = new AuthService();
