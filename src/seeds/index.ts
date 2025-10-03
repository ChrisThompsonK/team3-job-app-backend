import { seedBands } from './seedBands.js';
import { seedCapabilities } from './seedCapabilities.js';
import { seedJobRoles } from './seedJobRoles.js';

export async function runAllSeeds() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Seed in order of dependencies
    await seedCapabilities();
    await seedBands();
    await seedJobRoles();

    console.log('\n🎉 All seeds completed successfully!');
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run this file directly to seed all tables
if (import.meta.url === `file://${process.argv[1]}`) {
  await runAllSeeds();
  process.exit(0);
}
