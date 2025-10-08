import { eq } from 'drizzle-orm';
import { db } from '../db/database.js';
import { bands, capabilities, jobRoles } from '../db/schema.js';
import type { AppInfo } from '../models/AppInfo.js';
import type { HealthInfo } from '../models/HealthInfo.js';

export type JobRoleWithDetails = {
  jobRoleId: number;
  roleName: string;
  location: string;
  closingDate: string;
  capabilityName: string | null;
  bandName: string | null;
};

export class AppRepository {
  private static readonly APP_NAME = 'Team 3 Job Application Backend';

  async getAppInfo(): Promise<AppInfo> {
    // Simulate async data access (could be from database, config file, etc.)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: 'Hello World! 🌍',
          service: AppRepository.APP_NAME,
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
        resolve(AppRepository.APP_NAME);
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
      .leftJoin(bands, eq(jobRoles.bandId, bands.bandId));
    return jobs;
  }

  async getJobById(jobRoleId: number): Promise<JobRoleWithDetails | null> {
    // Query a single job role by ID with capability and band names
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
      .where(eq(jobRoles.jobRoleId, jobRoleId))
      .limit(1);

    return job[0] || null;
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
  ): Promise<JobRoleWithDetails | null> {
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
        closingDate: jobRoles.closingDate,
        capabilityName: capabilities.capabilityName,
        bandName: bands.bandName,
      })
      .from(jobRoles)
      .leftJoin(capabilities, eq(jobRoles.capabilityId, capabilities.capabilityId))
      .leftJoin(bands, eq(jobRoles.bandId, bands.bandId))
      .where(eq(jobRoles.jobRoleId, jobRoleId))
      .limit(1);

    return updatedJob[0] || null;
  }
}
