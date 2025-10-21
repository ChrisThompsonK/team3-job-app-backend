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
    // Check if bands already exist
    const existingBands = await db.select().from(bands);
    
    if (existingBands.length > 0) {
      console.log(`Bands already seeded (${existingBands.length} found). Skipping...`);
      return;
    }
    
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
