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

export type JobRoleDetail = {
  jobRoleId: number;
  roleName: string;
  location: string;
  capabilityName: string | null;
  bandName: string | null;
  closingDate: string;
  description: string | null;
  responsibilities: string | null;
  jobSpecUrl: string | null;
  status: string;
  openPositions: number;
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
}
