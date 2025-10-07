import { db } from '../db/database.js';
import { jobRoles } from '../db/schema.js';
import type { AppInfo } from '../models/AppInfo.js';
import type { HealthInfo } from '../models/HealthInfo.js';

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

  async getAllJobs(): Promise<any[]> {
    // Query all job roles from the database
    const jobs = await db.select().from(jobRoles);
    return jobs;
  }
}
