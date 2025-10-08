import type { AppInfo } from '../models/AppInfo.js';
import type { HealthInfo } from '../models/HealthInfo.js';
import type { AppRepository, JobRoleWithDetails } from '../repositories/AppRepository.js';

export class AppService {
  private appRepository: AppRepository;

  constructor(appRepository: AppRepository) {
    this.appRepository = appRepository;
  }

  async getApplicationInfo(): Promise<AppInfo> {
    return await this.appRepository.getAppInfo();
  }

  async getHealthStatus(): Promise<HealthInfo> {
    const healthInfo = await this.appRepository.getHealthInfo();

    // Business logic: Add additional health checks here
    if (healthInfo.uptime > 86400) {
      // More than 24 hours
      healthInfo.status = 'healthy - long running';
    }

    return healthInfo;
  }

  async generateGreeting(name: string): Promise<string> {
    const serverName = await this.appRepository.getServerName();

    // Business logic: Generate personalized greeting
    if (!name || name.trim() === '') {
      return `Hello, Guest! Welcome to the ${serverName}.`;
    }

    const cleanName = name.trim();
    return `Hello, ${cleanName}! Welcome to the ${serverName}.`;
  }

  async fetchJobs(): Promise<JobRoleWithDetails[]> {
    return await this.appRepository.getAllJobs();
  }

  async fetchJobById(jobRoleId: number): Promise<JobRoleWithDetails | null> {
    // Business logic: Validate the job role ID
    if (!jobRoleId || jobRoleId <= 0) {
      throw new Error('Invalid job role ID');
    }

    return await this.appRepository.getJobById(jobRoleId);
  }

  async updateJobRole(
    jobRoleId: number,
    updates: {
      roleName?: string;
      location?: string;
      capabilityId?: number;
      bandId?: number;
      closingDate?: string;
    }
  ): Promise<JobRoleWithDetails | null> {
    // Business logic: Validate the job role ID
    if (!jobRoleId || jobRoleId <= 0) {
      throw new Error('Invalid job role ID');
    }

    // Business logic: Ensure at least one field is being updated
    if (Object.keys(updates).length === 0) {
      throw new Error('No updates provided');
    }

    // Business logic: Validate closing date format if provided
    if (updates.closingDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(updates.closingDate)) {
        throw new Error('Invalid closing date format. Use YYYY-MM-DD');
      }
    }

    return await this.appRepository.updateJobRole(jobRoleId, updates);
  }
}
