import type { JobRole } from '../db/schema.js';
import type { AppInfo } from '../models/AppInfo.js';
import type { HealthInfo } from '../models/HealthInfo.js';
import type { AppRepository } from '../repositories/AppRepository.js';

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

  async fetchJobs(): Promise<JobRole[]> {
    return await this.appRepository.getAllJobs();
  }
}
