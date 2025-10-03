import { db } from '../db/database.js';
import { capabilities } from '../db/schema.js';

export async function seedCapabilities() {
  console.log('🌱 Seeding capabilities...');

  const capabilitiesData = [
    { capabilityName: 'Engineering' },
    { capabilityName: 'Data & AI' },
    { capabilityName: 'Digital Services' },
    { capabilityName: 'Workday' },
    { capabilityName: 'Testing' },
    { capabilityName: 'DevOps' },
    { capabilityName: 'Cyber Security' },
    { capabilityName: 'Business Analysis' },
    { capabilityName: 'Project Management' },
    { capabilityName: 'Architecture' },
    { capabilityName: 'UX/UI Design' },
    { capabilityName: 'Platform Engineering' },
    { capabilityName: 'Quality Assurance' },
    { capabilityName: 'Cloud Solutions' },
    { capabilityName: 'ServiceNow' },
  ];

  try {
    await db.insert(capabilities).values(capabilitiesData);
    console.log(`✅ Successfully seeded ${capabilitiesData.length} capabilities`);
  } catch (error) {
    console.error('❌ Error seeding capabilities:', error);
    throw error;
  }
}

// Run this file directly to seed capabilities
if (import.meta.url === `file://${process.argv[1]}`) {
  await seedCapabilities();
  process.exit(0);
}
