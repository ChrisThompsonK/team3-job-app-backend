import type { AppInfo } from '../models/AppInfo.js';
import type { HealthInfo } from '../models/HealthInfo.js';
import type {
  AppRepository,
  JobRoleDetail,
  JobRoleWithDetails,
} from '../repositories/AppRepository.js';

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

  async fetchJobById(id: number): Promise<JobRoleDetail | null> {
    // Business logic: Validate the job role ID
    if (!id || id <= 0) {
      throw new Error('Invalid job role ID');
    }

    return await this.appRepository.getJobById(id);
  }

  async updateJobRole(
    jobRoleId: number,
    requestBody: Record<string, unknown>
  ): Promise<JobRoleDetail | null> {
    // Business logic: Validate the job role ID
    if (!jobRoleId || jobRoleId <= 0) {
      throw new Error('Invalid job role ID');
    }

    // Business logic: Extract and validate updates from request body
    const updates: {
      roleName?: string;
      location?: string;
      capabilityId?: number;
      bandId?: number;
      closingDate?: string;
    } = {};

    if (requestBody['roleName'] !== undefined) updates.roleName = String(requestBody['roleName']);
    if (requestBody['location'] !== undefined) updates.location = String(requestBody['location']);
    if (requestBody['capabilityId'] !== undefined)
      updates.capabilityId = Number(requestBody['capabilityId']);
    if (requestBody['bandId'] !== undefined) updates.bandId = Number(requestBody['bandId']);
    if (requestBody['closingDate'] !== undefined)
      updates.closingDate = String(requestBody['closingDate']);

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
