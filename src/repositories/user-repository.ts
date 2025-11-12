import { eq } from 'drizzle-orm';
import { db } from '../db/database.js';
import { type InsertUser, type User, users } from '../db/schema.js';

export class UserRepository {
  async findByEmail(email: string): Promise<User | undefined> {
    return db.select().from(users).where(eq(users.email, email.toLowerCase())).get();
  }

  async findById(id: string): Promise<User | undefined> {
    return db.select().from(users).where(eq(users.id, id)).get();
  }

  async create(userData: InsertUser): Promise<User> {
    const newUser: InsertUser = {
      ...userData,
      email: userData.email.toLowerCase(),
    };

    return db.insert(users).values(newUser).returning().get();
  }

  async updateLastLogin(id: string): Promise<void> {
    await db
      .update(users)
      .set({
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }

  async updateRole(id: string, role: 'admin' | 'user'): Promise<void> {
    await db
      .update(users)
      .set({
        role,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }

  async update(id: string, userData: Partial<InsertUser>): Promise<User> {
    return db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning()
      .get();
  }
}

export const userRepository = new UserRepository();
