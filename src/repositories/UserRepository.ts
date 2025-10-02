import type { User } from '../models/User.js';

export class UserRepository {
  private users: User[] = [];

  async createUser(name: string, age: number): Promise<User> {
    const user: User = {
      id: this.generateId(),
      name,
      age,
      isAdult: age >= 18,
    };

    this.users.push(user);
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    return user || null;
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }

  async updateUser(id: string, updates: Partial<Pick<User, 'name' | 'age'>>): Promise<User | null> {
    const currentUser = this.users.find((u) => u.id === id);
    if (!currentUser) return null;

    const newAge = updates.age !== undefined ? updates.age : currentUser.age;
    const updatedUser: User = {
      id: currentUser.id,
      name: updates.name !== undefined ? updates.name : currentUser.name,
      age: newAge,
      isAdult: newAge >= 18,
    };

    const userIndex = this.users.findIndex((u) => u.id === id);
    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
