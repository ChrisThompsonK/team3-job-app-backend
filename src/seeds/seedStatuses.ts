import { db } from '../db/database.js';
import { status } from '../db/schema.js';

export async function seedStatuses() {
  console.log('🌱 Seeding statuses...');

  const statusData = [{ statusName: 'Open' }, { statusName: 'Closed' }];

  try {
    await db.insert(status).values(statusData);
    console.log(`✅ Successfully seeded ${statusData.length} statuses`);
  } catch (error) {
    console.error('❌ Error seeding statuses:', error);
    throw error;
  }
}
