import { eq } from 'drizzle-orm';
import { db } from '../db/database.js';
import { bands, capabilities, jobRoles } from '../db/schema.js';
import type { AppInfo } from '../models/AppInfo.js';
import type { HealthInfo } from '../models/HealthInfo.js';
import  type {JobRole}  from '../models/JobModel.js';

export type JobRoleWithDetails = {
  jobRoleId: number;
  roleName: string;
  location: string;
  closingDate: string;
  capabilityName: string | null;
  bandName: string | null;
};

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
      .where(eq(jobRoles.jobRoleId, jobRoleID));
    return job;
  }
  async addJobRole(jobRole:JobRole):Promise<boolean>{
    const result = await db.insert(jobRoles).values({
      roleName:jobRole.roleName,
      location:jobRole.location,
      closingDate:jobRole.closingDate,
      capabilityId:jobRole.capabilityId,
      bandId:jobRole.bandId
    }).returning();
    if(result.length===0){
      return false;
    }
    return true;
  }

  async deleteJob(jobRoleId:number):Promise<boolean>{
    const result = await db.update(jobRoles).set({deleted:1}).where(eq(jobRoles.jobRoleId,jobRoleId)).returning();
    if(result.length===0){
      return false;
    }
    return true;
  }
}
