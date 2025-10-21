import { db } from '../db/database.js';
import { jobAvailabilityStatus } from '../db/schema.js';

export async function seedStatuses() {
  console.log('🌱 Seeding job availability statuses...');

  const statusData = [{ statusName: 'Open' }, { statusName: 'Closed' }];

  try {
    // Check if statuses already exist
    const existingStatuses = await db.select().from(jobAvailabilityStatus);
    
    if (existingStatuses.length > 0) {
      console.log(`Job availability statuses already seeded (${existingStatuses.length} found). Skipping...`);
      return;
    }
    
    await db.insert(jobAvailabilityStatus).values(statusData);
    console.log(`✅ Successfully seeded ${statusData.length} job availability statuses`);
  } catch (error) {
    console.error('❌ Error seeding job availability statuses:', error);
    throw error;
  }
}
