import { eq } from 'drizzle-orm';

import { db } from '../db/database.js';
import type { NewSession, NewUser, Session, User } from '../db/schema.js';
import { sessions, users } from '../db/schema.js';

export class AuthRepository {
  /**
   * Create a new user
   */
  async createUser(userData: NewUser): Promise<User> {
    const result = await db.insert(users).values(userData).returning();
    if (!result[0]) {
      throw new Error('Failed to create user');
    }
    return result[0];
  }

  /**
   * Find user by email
   */
  async findUserByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0] || null;
  }

  /**
   * Find user by ID
   */
  async findUserById(id: number): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || null;
  }



  /**
   * Create a new session
   */
  async createSession(sessionData: NewSession): Promise<Session> {
    const result = await db.insert(sessions).values(sessionData).returning();
    if (!result[0]) {
      throw new Error('Failed to create session');
    }
    return result[0];
  }

  /**
   * Find session by token
   */
  async findSessionByToken(token: string): Promise<Session | null> {
    const result = await db.select().from(sessions).where(eq(sessions.token, token));
    return result[0] || null;
  }

  /**
   * Delete session (logout)
   */
  async deleteSession(token: string): Promise<boolean> {
    const result = await db.delete(sessions).where(eq(sessions.token, token));
    return result.rowsAffected > 0;
  }

  /**
   * Delete all sessions for a user
   */
  async deleteAllUserSessions(userId: number): Promise<void> {
    await db.delete(sessions).where(eq(sessions.userId, userId));
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<void> {
    const now = new Date().toISOString();
    await db.delete(sessions).where(eq(sessions.expiresAt, now));
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const result = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
    return result.length > 0;
  }
}