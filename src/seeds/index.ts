import { client } from '../db/database.js';
import { seedBands } from './seedBands.js';
import { seedCapabilities } from './seedCapabilities.js';
import { seedJobRoles } from './seedJobRoles.js';
import { seedStatuses } from './seedStatuses.js';
import { seedUsers } from './seedUsers.js';

export async function runAllSeeds() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Seed users first (for authentication)
    await seedUsers();

    // Seed in order of dependencies
    await seedCapabilities();
    await seedBands();
    await seedStatuses(); // Add this BEFORE seedJobRoles
    await seedJobRoles();

    console.log('\n🎉 All seeds completed successfully!');
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    throw error;
  }
}

// Run this file directly to seed all tables
try {
  await runAllSeeds();
} finally {
  // Close the database connection to ensure data is persisted
  client.close();
}
