# Status Table Implementation - Backend Changes

This document outlines all the backend changes required to implement a separate `status` table with `statusId` and `statusName` fields, replacing the current text-based status field in the job roles table.

## Overview

- **Goal**: Replace text-based status field with a proper status table
- **Statuses**: Only "Open" and "Closed" (any "Closing Soon" should be converted to "Open")
- **Table Name**: `status` (not `statuses`)
- **Foreign Key**: `statusId` in `job_roles` table references `status.statusId`

## 1. Database Schema Changes

### 1.1 Update Database Schema (`src/db/schema.ts`)

Add the new status table and update the job_roles table:

```typescript
// Add this new table BEFORE the jobRoles table
export const status = sqliteTable('status', {
  statusId: integer('statusId').primaryKey({ autoIncrement: true }),
  statusName: text('statusName').notNull(),
});

// Update the existing jobRoles table
export const jobRoles = sqliteTable('job_roles', {
  jobRoleId: integer('jobRoleId').primaryKey({ autoIncrement: true }),
  roleName: text('roleName').notNull(),
  location: text('location').notNull(),
  capabilityId: integer('capabilityId').references(() => capabilities.capabilityId),
  bandId: integer('bandId').references(() => bands.bandId),
  statusId: integer('statusId').references(() => status.statusId), // Changed from status text
  closingDate: text('closingDate').notNull(),
  description: text('description'),
  responsibilities: text('responsibilities'),
  jobSpecUrl: text('jobSpecUrl'),
  openPositions: integer('openPositions').notNull().default(1),
  deleted: integer('deleted').default(0).notNull(),
});

// Add these type exports at the bottom of the file
export type Status = typeof status.$inferSelect;
export type NewStatus = typeof status.$inferInsert;
```

### 1.2 Create Migration Script

Create `drizzle/migrations/0005_Add_status_table.sql`:

```sql
-- Create status table
CREATE TABLE 'status'(
  'statusId' integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  'statusName' text NOT NULL
);

-- Insert default statuses (Open=1, Closed=2)
INSERT INTO 'status' ('statusName') VALUES ('Open');
INSERT INTO 'status' ('statusName') VALUES ('Closed');

-- Add statusId column to job_roles table
ALTER TABLE 'job_roles' ADD COLUMN 'statusId' integer REFERENCES 'status'('statusId');

-- Update existing records to use statusId
-- Convert 'Open' and 'Closing Soon' to 'Open' (statusId = 1)
-- Convert 'Closed' to 'Closed' (statusId = 2)
UPDATE 'job_roles' SET 'statusId' = 1 WHERE 'status' = 'Open' OR 'status' = 'Closing Soon' OR 'status' IS NULL;
UPDATE 'job_roles' SET 'statusId' = 2 WHERE 'status' = 'Closed';

-- Drop the old status column
-- Note: SQLite doesn't support DROP COLUMN directly, so this might need to be done differently
-- For now, you can leave the old column and ignore it, or recreate the table
```

## 2. Model Updates

### 2.1 Update Job Models (`src/models/JobModel.ts`)

```typescript
// Update the base JobRole interface
export interface JobRole {
  id: number;
  name: string;
  location: string;
  closingDate: string;
  capabilityId: number | null;
  capabilityName: string | null;
  bandId: number | null;
  bandName: string | null;
  statusId: number | null; // Changed from status
  statusName: string | null; // Added statusName
}

// Update JobRoleDetails (extends JobRole)
export interface JobRoleDetails extends JobRole {
  description: string | null;
  responsibilities: string | null;
  jobSpecUrl: string | null;
  openPositions: number;
}

// Update JobRoleCreate
export interface JobRoleCreate {
  name: string;
  location: string;
  closingDate: string;
  capabilityId: number;
  bandId: number;
  statusId?: number; // Changed from status, optional (defaults to 1 - Open)
  description?: string | null;
  responsibilities?: string | null;
  jobSpecUrl?: string | null;
  openPositions?: number;
}

// Update JobRoleUpdate
export interface JobRoleUpdate {
  name?: string;
  location?: string;
  closingDate?: string;
  capabilityId?: number;
  bandId?: number;
  statusId?: number; // Changed from status
  description?: string | null;
  responsibilities?: string | null;
  jobSpecUrl?: string | null;
  openPositions?: number;
}

// Add Status interface
export interface Status {
  id: number;
  name: string;
}
```

## 3. Repository Updates

### 3.1 Update Job Repository (`src/repositories/JobRepository.ts`)

Update imports:
```typescript
import { and, eq } from 'drizzle-orm';
import { db } from '../db/database.js';
import { bands, capabilities, jobRoles, status } from '../db/schema.js'; // Add status
```

Update `getAllJobs()` method:
```typescript
async getAllJobs(): Promise<JobRole[]> {
  const jobs = await db
    .select({
      id: jobRoles.jobRoleId,
      name: jobRoles.roleName,
      location: jobRoles.location,
      closingDate: jobRoles.closingDate,
      capabilityId: jobRoles.capabilityId,
      capabilityName: capabilities.capabilityName,
      bandId: jobRoles.bandId,
      bandName: bands.bandName,
      statusId: jobRoles.statusId, // Added
      statusName: status.statusName, // Added
    })
    .from(jobRoles)
    .leftJoin(capabilities, eq(jobRoles.capabilityId, capabilities.capabilityId))
    .leftJoin(bands, eq(jobRoles.bandId, bands.bandId))
    .leftJoin(status, eq(jobRoles.statusId, status.statusId)) // Added
    .where(eq(jobRoles.deleted, 0));
  return jobs;
}
```

Update `getJobById()` method:
```typescript
async getJobById(id: number): Promise<JobRoleDetails | null> {
  const result = await db
    .select({
      id: jobRoles.jobRoleId,
      name: jobRoles.roleName,
      location: jobRoles.location,
      capabilityId: jobRoles.capabilityId,
      capabilityName: capabilities.capabilityName,
      bandId: jobRoles.bandId,
      bandName: bands.bandName,
      statusId: jobRoles.statusId, // Added
      statusName: status.statusName, // Added
      closingDate: jobRoles.closingDate,
      description: jobRoles.description,
      responsibilities: jobRoles.responsibilities,
      jobSpecUrl: jobRoles.jobSpecUrl,
      openPositions: jobRoles.openPositions,
    })
    .from(jobRoles)
    .leftJoin(capabilities, eq(jobRoles.capabilityId, capabilities.capabilityId))
    .leftJoin(bands, eq(jobRoles.bandId, bands.bandId))
    .leftJoin(status, eq(jobRoles.statusId, status.statusId)) // Added
    .where(and(eq(jobRoles.jobRoleId, id), eq(jobRoles.deleted, 0)))
    .limit(1);

  return result[0] || null;
}
```

Update `addJobRole()` method:
```typescript
async addJobRole(jobRole: JobRoleCreate): Promise<JobRoleDetails | null> {
  try {
    const [result] = await db
      .insert(jobRoles)
      .values({
        roleName: jobRole.name,
        location: jobRole.location,
        closingDate: jobRole.closingDate,
        capabilityId: jobRole.capabilityId,
        bandId: jobRole.bandId,
        statusId: jobRole.statusId || 1, // Default to 'Open' (ID 1)
        description: jobRole.description || null,
        responsibilities: jobRole.responsibilities || null,
        jobSpecUrl: jobRole.jobSpecUrl || null,
        openPositions: jobRole.openPositions || 1,
        deleted: 0,
      })
      .returning();

    if (!result) return null;

    // Get the complete job with joined data
    const [completeJob] = await db
      .select({
        id: jobRoles.jobRoleId,
        name: jobRoles.roleName,
        location: jobRoles.location,
        capabilityId: jobRoles.capabilityId,
        capabilityName: capabilities.capabilityName,
        bandId: jobRoles.bandId,
        bandName: bands.bandName,
        statusId: jobRoles.statusId, // Added
        statusName: status.statusName, // Added
        closingDate: jobRoles.closingDate,
        description: jobRoles.description,
        responsibilities: jobRoles.responsibilities,
        jobSpecUrl: jobRoles.jobSpecUrl,
        openPositions: jobRoles.openPositions,
      })
      .from(jobRoles)
      .leftJoin(capabilities, eq(jobRoles.capabilityId, capabilities.capabilityId))
      .leftJoin(bands, eq(jobRoles.bandId, bands.bandId))
      .leftJoin(status, eq(jobRoles.statusId, status.statusId)) // Added
      .where(eq(jobRoles.jobRoleId, result.jobRoleId))
      .limit(1);

    return completeJob || null;
  } catch (error) {
    console.error('Error adding job role:', error);
    return null;
  }
}
```

Update `updateJobRole()` method:
```typescript
async updateJobRole(jobRoleId: number, updates: JobRoleUpdate): Promise<JobRoleDetails | null> {
  // ... existing validation code ...

  const dbUpdates: Partial<{
    roleName: string;
    location: string;
    capabilityId: number;
    bandId: number;
    statusId: number; // Changed from status
    closingDate: string;
    description: string | null;
    responsibilities: string | null;
    jobSpecUrl: string | null;
    openPositions: number;
  }> = {};

  if (updates.name !== undefined) dbUpdates.roleName = updates.name;
  if (updates.location !== undefined) dbUpdates.location = updates.location;
  if (updates.capabilityId !== undefined) dbUpdates.capabilityId = updates.capabilityId;
  if (updates.bandId !== undefined) dbUpdates.bandId = updates.bandId;
  if (updates.statusId !== undefined) dbUpdates.statusId = updates.statusId; // Changed
  if (updates.closingDate !== undefined) dbUpdates.closingDate = updates.closingDate;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.responsibilities !== undefined) dbUpdates.responsibilities = updates.responsibilities;
  if (updates.jobSpecUrl !== undefined) dbUpdates.jobSpecUrl = updates.jobSpecUrl;
  if (updates.openPositions !== undefined) dbUpdates.openPositions = updates.openPositions;

  await db
    .update(jobRoles)
    .set(dbUpdates)
    .where(and(eq(jobRoles.jobRoleId, jobRoleId), eq(jobRoles.deleted, 0)));

  // Get updated job with joined data
  const updatedJob = await db
    .select({
      id: jobRoles.jobRoleId,
      name: jobRoles.roleName,
      location: jobRoles.location,
      capabilityId: jobRoles.capabilityId,
      capabilityName: capabilities.capabilityName,
      bandId: jobRoles.bandId,
      bandName: bands.bandName,
      statusId: jobRoles.statusId, // Added
      statusName: status.statusName, // Added
      closingDate: jobRoles.closingDate,
      description: jobRoles.description,
      responsibilities: jobRoles.responsibilities,
      jobSpecUrl: jobRoles.jobSpecUrl,
      openPositions: jobRoles.openPositions,
    })
    .from(jobRoles)
    .leftJoin(capabilities, eq(jobRoles.capabilityId, capabilities.capabilityId))
    .leftJoin(bands, eq(jobRoles.bandId, bands.bandId))
    .leftJoin(status, eq(jobRoles.statusId, status.statusId)) // Added
    .where(and(eq(jobRoles.jobRoleId, jobRoleId), eq(jobRoles.deleted, 0)))
    .limit(1);

  return updatedJob[0] || null;
}
```

Add new method for getting all statuses:
```typescript
// Add method to get all statuses
async getAllStatuses(): Promise<Status[]> {
  const result = await db
    .select({
      id: status.statusId,
      name: status.statusName,
    })
    .from(status)
    .orderBy(status.statusName);

  return result;
}
```

## 4. Service Updates

### 4.1 Update Job Service (`src/services/JobService.ts`)

Update the `updateJobRole()` method to handle statusId:
```typescript
async updateJobRole(
  jobRoleId: number,
  requestBody: Record<string, unknown>
): Promise<JobRoleDetails | null> {
  // ... existing validation code ...

  const updates: JobRoleUpdate = {};

  if (requestBody['name'] !== undefined) updates.name = String(requestBody['name']);
  if (requestBody['location'] !== undefined) updates.location = String(requestBody['location']);
  if (requestBody['capabilityId'] !== undefined) updates.capabilityId = Number(requestBody['capabilityId']);
  if (requestBody['bandId'] !== undefined) updates.bandId = Number(requestBody['bandId']);
  if (requestBody['statusId'] !== undefined) updates.statusId = Number(requestBody['statusId']); // Changed
  if (requestBody['closingDate'] !== undefined) updates.closingDate = String(requestBody['closingDate']);
  if (requestBody['description'] !== undefined) updates.description = requestBody['description'] ? String(requestBody['description']) : null;
  if (requestBody['responsibilities'] !== undefined) updates.responsibilities = requestBody['responsibilities'] ? String(requestBody['responsibilities']) : null;
  if (requestBody['jobSpecUrl'] !== undefined) updates.jobSpecUrl = requestBody['jobSpecUrl'] ? String(requestBody['jobSpecUrl']) : null;
  if (requestBody['openPositions'] !== undefined) updates.openPositions = Number(requestBody['openPositions']);

  // ... rest of method remains the same ...
}
```

Add new method for getting statuses:
```typescript
// Add method to get statuses
async getStatuses(): Promise<Status[]> {
  return this.jobRepository.getAllStatuses();
}
```

## 5. Controller Updates

### 5.1 Update Job Controller (`src/controllers/JobController.ts`)

Add new method for getting statuses:
```typescript
async getStatuses(_req: Request, res: Response): Promise<void> {
  try {
    const statuses = await this.jobService.getStatuses();
    res.status(200).json(statuses);
  } catch (error) {
    console.error('Error fetching statuses:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Failed to fetch statuses',
    });
  }
}
```

## 6. Routes Updates

### 6.1 Update Job Routes (`src/routes/JobRoutes.ts`)

Add the new statuses endpoint:
```typescript
// Add this route
router.get('/statuses', async (req, res) => jobController.getStatuses(req, res));
```

## 7. Seeds Updates

### 7.1 Create Status Seeds (`src/seeds/seedStatuses.ts`)

Create new file:
```typescript
import { db } from '../db/database.js';
import { status } from '../db/schema.js';

export async function seedStatuses() {
  console.log('🌱 Seeding statuses...');

  const statusData = [
    { statusName: 'Open' },
    { statusName: 'Closed' },
  ];

  try {
    await db.insert(status).values(statusData);
    console.log(`✅ Successfully seeded ${statusData.length} statuses`);
  } catch (error) {
    console.error('❌ Error seeding statuses:', error);
    throw error;
  }
}
```

### 7.2 Update Seeds Index (`src/seeds/index.ts`)

Update the main seeds file:
```typescript
import { client } from '../db/database.js';
import { seedBands } from './seedBands.js';
import { seedCapabilities } from './seedCapabilities.js';
import { seedJobRoles } from './seedJobRoles.js';
import { seedStatuses } from './seedStatuses.js'; // Add this

export async function runAllSeeds() {
  console.log('🌱 Starting database seeding...\n');

  try {
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

// ... rest of file remains the same ...
```

## 8. Implementation Steps

1. **Update Database Schema**: Modify `src/db/schema.ts`
2. **Create Migration**: Add migration script in `drizzle/migrations/`
3. **Update Models**: Modify interfaces in `src/models/JobModel.ts`
4. **Update Repository**: Modify `src/repositories/JobRepository.ts`
5. **Update Service**: Modify `src/services/JobService.ts`
6. **Update Controller**: Modify `src/controllers/JobController.ts`
7. **Update Routes**: Modify `src/routes/JobRoutes.ts`
8. **Create Seeds**: Add status seeds
9. **Run Migration**: `npm run migrate`
10. **Run Seeds**: `npm run seed`

## 9. Testing

After implementation:
1. Verify `/api/statuses` endpoint returns `[{id: 1, name: "Open"}, {id: 2, name: "Closed"}]`
2. Test job creation with `statusId`
3. Test job updates with `statusId`
4. Verify all job endpoints return `statusName` in responses
5. Test that jobs without `statusId` default to "Open"

## 10. Notes

- **Default Status**: New jobs without a specified `statusId` should default to 1 (Open)
- **Migration**: Existing "Closing Soon" statuses should be converted to "Open"
- **Frontend Compatibility**: The frontend expects `statusName` in API responses
- **Table Name**: Use `status` (singular) not `statuses`
- **Foreign Key**: `statusId` in `job_roles` references `status.statusId`