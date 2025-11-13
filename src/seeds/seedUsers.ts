import 'dotenv/config';
import bcrypt from 'bcrypt';
import { client, db } from '../db/database.js';
import { users } from '../db/schema.js';

const SALT_ROUNDS = 10;

export async function seedUsers() {
  console.log('🌱 Seeding users...');

  // Get admin credentials from environment or use defaults
  const adminEmail = process.env['ADMIN_SEED_EMAIL'] || 'admin@example.com';
  const adminPassword = process.env['ADMIN_SEED_PASSWORD'] || 'ChangeMe123!';

  // Create test users with hashed passwords
  const usersData = [
    {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, SALT_ROUNDS),
      role: 'admin' as const,
      isActive: true,
    },
    {
      email: 'user@kainos.com',
      passwordHash: await bcrypt.hash('UserPass123!', SALT_ROUNDS),
      role: 'user' as const,
      isActive: true,
    },
    {
      email: 'test@example.com',
      passwordHash: await bcrypt.hash('TestPass123!', SALT_ROUNDS),
      role: 'user' as const,
      isActive: true,
    },
    {
      email: 'inactive@kainos.com',
      passwordHash: await bcrypt.hash('InactivePass123!', SALT_ROUNDS),
      role: 'user' as const,
      isActive: false,
    },
  ];

  try {
    // Check if users already exist
    const existingUsers = await db.select().from(users);

    if (existingUsers.length > 0) {
      console.log(`ℹ️ Users already seeded (${existingUsers.length} found). Skipping...`);
      return;
    }

    await db.insert(users).values(usersData);
    console.log(`✅ Successfully seeded ${usersData.length} users`);
    console.log('📧 Test credentials:');
    console.log(`   Admin: ${adminEmail} / ${adminPassword}`);
    console.log('   User:  user@kainos.com / UserPass123!');
    console.log('   Test:  test@example.com / TestPass123!');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}

// Run this file directly to seed users
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await seedUsers();
  } finally {
    // Close the database connection to ensure data is persisted
    client.close();
  }
}
