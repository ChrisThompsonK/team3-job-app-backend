import { client, db } from '../db/database.js';
import { jobRoles } from '../db/schema.js';

export async function seedJobRoles() {
  console.log('🌱 Seeding job roles...');

  const jobRolesData = [
    {
      roleName: 'Software Engineer',
      location: 'Belfast',
      capabilityId: 1, // Engineering
      bandId: 2, // Associate
      closingDate: '2025-10-31',
    },
    {
      roleName: 'Software Engineer',
      location: 'Birmingham',
      capabilityId: 1, // Engineering
      bandId: 4, // Senior Consultant
      closingDate: '2025-11-15',
    },
    {
      roleName: 'Data Engineer',
      location: 'London',
      capabilityId: 2, // Data & AI
      bandId: 3, // Consultant
      closingDate: '2025-10-25',
    },
    {
      roleName: 'Data Scientist',
      location: 'Manchester',
      capabilityId: 2, // Data & AI
      bandId: 5, // Principal Consultant
      closingDate: '2025-11-30',
    },
    {
      roleName: 'DevOps Engineer',
      location: 'Belfast',
      capabilityId: 6, // DevOps
      bandId: 3, // Consultant
      closingDate: '2025-10-20',
    },
    {
      roleName: 'Test Analyst',
      location: 'Glasgow',
      capabilityId: 5, // Testing
      bandId: 4, // Senior Consultant
      closingDate: '2025-11-10',
    },
    {
      roleName: 'Cyber Security Consultant',
      location: 'London',
      capabilityId: 7, // Cyber Security
      bandId: 3, // Consultant
      closingDate: '2025-12-01',
    },
    {
      roleName: 'Business Analyst',
      location: 'Birmingham',
      capabilityId: 8, // Business Analysis
      bandId: 2, // Associate
      closingDate: '2025-10-28',
    },
    {
      roleName: 'UX Designer',
      location: 'Belfast',
      capabilityId: 11, // UX/UI Design
      bandId: 4, // Senior Consultant
      closingDate: '2025-11-05',
    },
    {
      roleName: 'Cloud Solutions Architect',
      location: 'London',
      capabilityId: 14, // Cloud Solutions
      bandId: 5, // Principal Consultant
      closingDate: '2025-11-20',
    },
    {
      roleName: 'Workday Technical Consultant',
      location: 'Manchester',
      capabilityId: 4, // Workday
      bandId: 3, // Consultant
      closingDate: '2025-10-15',
    },
    {
      roleName: 'Software Engineer',
      location: 'Belfast',
      capabilityId: 1, // Engineering
      bandId: 1, // Trainee
      closingDate: '2025-12-15',
    },
    {
      roleName: 'Project Manager',
      location: 'Birmingham',
      capabilityId: 9, // Project Management
      bandId: 4, // Senior Consultant
      closingDate: '2025-11-25',
    },
    {
      roleName: 'Platform Engineer',
      location: 'London',
      capabilityId: 12, // Platform Engineering
      bandId: 3, // Consultant
      closingDate: '2025-10-30',
    },
    {
      roleName: 'ServiceNow Developer',
      location: 'Glasgow',
      capabilityId: 15, // ServiceNow
      bandId: 2, // Associate
      closingDate: '2025-11-12',
    },
  ];

  try {
    await db.insert(jobRoles).values(jobRolesData);
    console.log(`✅ Successfully seeded ${jobRolesData.length} job roles`);
  } catch (error) {
    console.error('❌ Error seeding job roles:', error);
    throw error;
  }
}

// Run this file directly to seed job roles
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await seedJobRoles();
  } finally {
    // Close the database connection to ensure data is persisted
    client.close();
  }
}
