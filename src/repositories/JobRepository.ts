import { and, eq } from 'drizzle-orm';
import { db } from '../db/database.js';
import { bands, capabilities, jobRoles } from '../db/schema.js';
import type { AppInfo } from '../models/AppInfo.js';
import type { HealthInfo } from '../models/HealthInfo.js';
import type {
  Band,
  Capability,
  JobRole,
  JobRoleCreate,
  JobRoleDetails,
  JobRoleUpdate,
} from '../models/JobModel.js';
export class JobRepository {
  private static readonly APP_NAME = 'Team 3 Job Application Backend';

  async getAppInfo(): Promise<AppInfo> {
    // Simulate async data access (could be from database, config file, etc.)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: 'Hello World! 🌍',
          service: JobRepository.APP_NAME,
          timestamp: new Date().toISOString(),
        });
      }, 10);
    });
  }

  async getHealthInfo(): Promise<HealthInfo> {
    // Simulate async health check (could check database connectivity, external services, etc.)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'healthy',
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
        });
      }, 5);
    });
  }

  async getServerName(): Promise<string> {
    // Simulate retrieving server/app name from data source
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(JobRepository.APP_NAME);
      }, 5);
    });
  }

  async getAllJobs(): Promise<JobRole[]> {
    // Query all job roles from the database with capability and band names - standardized property names
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
      })
      .from(jobRoles)
      .leftJoin(capabilities, eq(jobRoles.capabilityId, capabilities.capabilityId))
      .leftJoin(bands, eq(jobRoles.bandId, bands.bandId))
      .where(eq(jobRoles.deleted, 0));
    return jobs;
  }

  async getJobByID(jobRoleID: number): Promise<JobRole[]> {
    const job = await db
      .select({
        id: jobRoles.jobRoleId,
        name: jobRoles.roleName,
        location: jobRoles.location,
        closingDate: jobRoles.closingDate,
        capabilityId: jobRoles.capabilityId,
        capabilityName: capabilities.capabilityName,
        bandId: jobRoles.bandId,
        bandName: bands.bandName,
      })
      .from(jobRoles)
      .leftJoin(capabilities, eq(jobRoles.capabilityId, capabilities.capabilityId))
      .leftJoin(bands, eq(jobRoles.bandId, bands.bandId))
      .where(and(eq(jobRoles.jobRoleId, jobRoleID), eq(jobRoles.deleted, 0)));
    return job;
  }
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
          description: jobRole.description || null,
          responsibilities: jobRole.responsibilities || null,
          jobSpecUrl: jobRole.jobSpecUrl || null,
          status: jobRole.status || 'Open',
          openPositions: jobRole.openPositions || 1,
          deleted: 0,
        })
        .returning();

      if (!result) {
        return null;
      }

      // Fetch the complete job with all details including joined capability and band names - standardized names
      const [completeJob] = await db
        .select({
          id: jobRoles.jobRoleId,
          name: jobRoles.roleName,
          location: jobRoles.location,
          capabilityId: jobRoles.capabilityId,
          capabilityName: capabilities.capabilityName,
          bandId: jobRoles.bandId,
          bandName: bands.bandName,
          closingDate: jobRoles.closingDate,
          description: jobRoles.description,
          responsibilities: jobRoles.responsibilities,
          jobSpecUrl: jobRoles.jobSpecUrl,
          status: jobRoles.status,
          openPositions: jobRoles.openPositions,
        })
        .from(jobRoles)
        .leftJoin(capabilities, eq(jobRoles.capabilityId, capabilities.capabilityId))
        .leftJoin(bands, eq(jobRoles.bandId, bands.bandId))
        .where(eq(jobRoles.jobRoleId, result.jobRoleId))
        .limit(1);

      return completeJob || null;
    } catch (error) {
      console.error('Error adding job role:', error);
      return null;
    }
  }

  async deleteJob(jobRoleId: number): Promise<boolean> {
    const result = await db
      .update(jobRoles)
      .set({ deleted: 1 })
      .where(eq(jobRoles.jobRoleId, jobRoleId))
      .returning();
    if (result.length === 0) {
      return false;
    }
    return true;
  }

  async getJobById(id: number): Promise<JobRoleDetails | null> {
    // Query a single job role with all details - standardized property names
    const result = await db
      .select({
        id: jobRoles.jobRoleId,
        name: jobRoles.roleName,
        location: jobRoles.location,
        capabilityId: jobRoles.capabilityId,
        capabilityName: capabilities.capabilityName,
        bandId: jobRoles.bandId,
        bandName: bands.bandName,
        closingDate: jobRoles.closingDate,
        description: jobRoles.description,
        responsibilities: jobRoles.responsibilities,
        jobSpecUrl: jobRoles.jobSpecUrl,
        status: jobRoles.status,
        openPositions: jobRoles.openPositions,
      })
      .from(jobRoles)
      .leftJoin(capabilities, eq(jobRoles.capabilityId, capabilities.capabilityId))
      .leftJoin(bands, eq(jobRoles.bandId, bands.bandId))
      .where(and(eq(jobRoles.jobRoleId, id), eq(jobRoles.deleted, 0)))
      .limit(1);

    return result[0] ?? null;
  }

  async updateJobRole(
    jobRoleId: number,
    updates: JobRoleUpdate
  ): Promise<JobRoleDetails | null> {
    // First check if the job role exists and is not deleted
    const existingJob = await db
      .select({ jobRoleId: jobRoles.jobRoleId })
      .from(jobRoles)
      .where(and(eq(jobRoles.jobRoleId, jobRoleId), eq(jobRoles.deleted, 0)))
      .limit(1);

    if (!existingJob[0]) {
      return null;
    }

    // Map standardized field names to database column names
    const dbUpdates: Partial<{
      roleName: string;
      location: string;
      capabilityId: number;
      bandId: number;
      closingDate: string;
      description: string | null;
      responsibilities: string | null;
      jobSpecUrl: string | null;
      status: string;
      openPositions: number;
    }> = {};

    if (updates.name !== undefined) dbUpdates.roleName = updates.name;
    if (updates.location !== undefined) dbUpdates.location = updates.location;
    if (updates.capabilityId !== undefined) dbUpdates.capabilityId = updates.capabilityId;
    if (updates.bandId !== undefined) dbUpdates.bandId = updates.bandId;
    if (updates.closingDate !== undefined) dbUpdates.closingDate = updates.closingDate;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.responsibilities !== undefined) dbUpdates.responsibilities = updates.responsibilities;
    if (updates.jobSpecUrl !== undefined) dbUpdates.jobSpecUrl = updates.jobSpecUrl;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.openPositions !== undefined) dbUpdates.openPositions = updates.openPositions;

    // Update the job role in the database
    await db
      .update(jobRoles)
      .set(dbUpdates)
      .where(and(eq(jobRoles.jobRoleId, jobRoleId), eq(jobRoles.deleted, 0)));

    console.log(`✅ Updated job role ${jobRoleId} in database:`, dbUpdates);

    // Fetch and return the updated job role with details - standardized names
    const updatedJob = await db
      .select({
        id: jobRoles.jobRoleId,
        name: jobRoles.roleName,
        location: jobRoles.location,
        capabilityId: jobRoles.capabilityId,
        capabilityName: capabilities.capabilityName,
        bandId: jobRoles.bandId,
        bandName: bands.bandName,
        closingDate: jobRoles.closingDate,
        description: jobRoles.description,
        responsibilities: jobRoles.responsibilities,
        jobSpecUrl: jobRoles.jobSpecUrl,
        status: jobRoles.status,
        openPositions: jobRoles.openPositions,
      })
      .from(jobRoles)
      .leftJoin(capabilities, eq(jobRoles.capabilityId, capabilities.capabilityId))
      .leftJoin(bands, eq(jobRoles.bandId, bands.bandId))
      .where(and(eq(jobRoles.jobRoleId, jobRoleId), eq(jobRoles.deleted, 0)))
      .limit(1);

    return updatedJob[0] || null;
  }

  async getAllCapabilities(): Promise<Capability[]> {
    const result = await db
      .select({
        id: capabilities.capabilityId,
        name: capabilities.capabilityName,
      })
      .from(capabilities)
      .orderBy(capabilities.capabilityName);

    return result;
  }

  async getAllBands(): Promise<Band[]> {
    const result = await db
      .select({
        id: bands.bandId,
        name: bands.bandName,
      })
      .from(bands)
      .orderBy(bands.bandName);

    return result;
  }
}
