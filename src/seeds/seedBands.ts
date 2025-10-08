import { client, db } from '../db/database.js';
import { bands } from '../db/schema.js';

export async function seedBands() {
  console.log('🌱 Seeding bands...');

  const bandsData = [
    { bandName: 'Trainee' },
    { bandName: 'Associate' },
    { bandName: 'Consultant' },
    { bandName: 'Senior Consultant' },
    { bandName: 'Principal Consultant' },
    { bandName: 'Managing Consultant' },
    { bandName: 'Senior Manager' },
    { bandName: 'Principal' },
    { bandName: 'Director' },
  ];

  try {
    await db.insert(bands).values(bandsData);
    console.log(`✅ Successfully seeded ${bandsData.length} bands`);
  } catch (error) {
    console.error('❌ Error seeding bands:', error);
    throw error;
  }
}

// Run this file directly to seed bands
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await seedBands();
  } finally {
    // Close the database connection to ensure data is persisted
    client.close();
  }
}
