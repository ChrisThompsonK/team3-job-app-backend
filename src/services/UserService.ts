import type { User } from '../models/User.js';

import { UserRepository } from '../repositories/UserRepository.js';
import { isAdult } from '../utils.js';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(name: string, age: number): Promise<User> {
    // Business logic: Validate input
    if (!name || name.trim() === '') {
      throw new Error('Name is required and cannot be empty');
    }

    if (age < 0 || age > 150) {
      throw new Error('Age must be between 0 and 150');
    }

    const cleanName = name.trim();
    return await this.userRepository.createUser(cleanName, age);
  }

  async getUserById(id: string): Promise<User | null> {
    if (!id || id.trim() === '') {
      throw new Error('User ID is required');
    }

    return await this.userRepository.getUserById(id);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.getAllUsers();
  }

  async updateUser(id: string, updates: { name?: string; age?: number }): Promise<User | null> {
    if (!id || id.trim() === '') {
      throw new Error('User ID is required');
    }

    // Business logic: Validate updates
    if (updates.name !== undefined && updates.name.trim() === '') {
      throw new Error('Name cannot be empty');
    }

    if (updates.age !== undefined && (updates.age < 0 || updates.age > 150)) {
      throw new Error('Age must be between 0 and 150');
    }

    const cleanUpdates: { name?: string; age?: number } = {};

    if (updates.name !== undefined) {
      cleanUpdates.name = updates.name.trim();
    }

    if (updates.age !== undefined) {
      cleanUpdates.age = updates.age;
    }

    return await this.userRepository.updateUser(id, cleanUpdates);
  }

  async deleteUser(id: string): Promise<boolean> {
    if (!id || id.trim() === '') {
      throw new Error('User ID is required');
    }

    return await this.userRepository.deleteUser(id);
  }

  async getAdultUsers(): Promise<User[]> {
    const allUsers = await this.userRepository.getAllUsers();
    return allUsers.filter((user) => isAdult(user.age));
  }

  async getUserStatistics(): Promise<{ total: number; adults: number; minors: number }> {
    const allUsers = await this.userRepository.getAllUsers();
    const adults = allUsers.filter((user) => isAdult(user.age));

    return {
      total: allUsers.length,
      adults: adults.length,
      minors: allUsers.length - adults.length,
    };
  }
}
