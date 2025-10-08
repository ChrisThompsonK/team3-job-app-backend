import { and, eq } from 'drizzle-orm';
import { db } from '../db/database.js';
import { bands, capabilities, jobRoles } from '../db/schema.js';
import type { AppInfo } from '../models/AppInfo.js';
import type { HealthInfo } from '../models/HealthInfo.js';
import type { JobRole, JobRoleDetail, JobRoleWithDetails } from '../models/JobModel.js';
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

  async getAllJobs(): Promise<JobRoleWithDetails[]> {
    // Query all job roles from the database with capability and band names
    const jobs = await db
      .select({
        jobRoleId: jobRoles.jobRoleId,
        roleName: jobRoles.roleName,
        location: jobRoles.location,
        closingDate: jobRoles.closingDate,
        capabilityName: capabilities.capabilityName,
        bandName: bands.bandName,
      })
      .from(jobRoles)
      .leftJoin(capabilities, eq(jobRoles.capabilityId, capabilities.capabilityId))
      .leftJoin(bands, eq(jobRoles.bandId, bands.bandId))
      .where(eq(jobRoles.deleted, 0));
    return jobs;
  }

  async getJobByID(jobRoleID: number): Promise<JobRoleWithDetails[]> {
    const job = await db
      .select({
        jobRoleId: jobRoles.jobRoleId,
        roleName: jobRoles.roleName,
        location: jobRoles.location,
        closingDate: jobRoles.closingDate,
        capabilityName: capabilities.capabilityName,
        bandName: bands.bandName,
      })
      .from(jobRoles)
      .leftJoin(capabilities, eq(jobRoles.capabilityId, capabilities.capabilityId))
      .leftJoin(bands, eq(jobRoles.bandId, bands.bandId))
      .where(and(eq(jobRoles.jobRoleId, jobRoleID), eq(jobRoles.deleted, 0)));
    return job;
  }
  async addJobRole(jobRole: JobRole): Promise<boolean> {
    const result = await db
      .insert(jobRoles)
      .values({
        roleName: jobRole.roleName,
        location: jobRole.location,
        closingDate: jobRole.closingDate,
        capabilityId: jobRole.capabilityId,
        bandId: jobRole.bandId,
      })
      .returning();
    if (result.length === 0) {
      return false;
    }
    return true;
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

  async getJobById(id: number): Promise<JobRoleDetail | null> {
    // Query a single job role with all details
    const result = await db
      .select({
        jobRoleId: jobRoles.jobRoleId,
        roleName: jobRoles.roleName,
        location: jobRoles.location,
        capabilityName: capabilities.capabilityName,
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
      .where(eq(jobRoles.jobRoleId, id))
      .limit(1);

    return result[0] ?? null;
  }

  async updateJobRole(
    jobRoleId: number,
    updates: Partial<{
      roleName: string;
      location: string;
      capabilityId: number;
      bandId: number;
      closingDate: string;
    }>
  ): Promise<JobRoleDetail | null> {
    // First check if the job role exists
    const existingJob = await db
      .select({ jobRoleId: jobRoles.jobRoleId })
      .from(jobRoles)
      .where(eq(jobRoles.jobRoleId, jobRoleId))
      .limit(1);

    if (!existingJob[0]) {
      return null;
    }

    // Update the job role in the database
    await db.update(jobRoles).set(updates).where(eq(jobRoles.jobRoleId, jobRoleId));

    console.log(`✅ Updated job role ${jobRoleId} in database:`, updates);

    // Fetch and return the updated job role with details
    const updatedJob = await db
      .select({
        jobRoleId: jobRoles.jobRoleId,
        roleName: jobRoles.roleName,
        location: jobRoles.location,
        capabilityName: capabilities.capabilityName,
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
      .where(eq(jobRoles.jobRoleId, jobRoleId))
      .limit(1);

    return updatedJob[0] || null;
  }
}
