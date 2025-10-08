import type { AppInfo } from '../models/AppInfo.js';
import type { HealthInfo } from '../models/HealthInfo.js';
import type { JobRole } from '../models/JobModel.js';
import type { JobRepository, JobRoleWithDetails } from '../repositories/JobRepository.js';
export class JobService {
  private jobRepository: JobRepository;

  constructor(jobRepository: JobRepository) {
    this.jobRepository = jobRepository;
  }

  async getApplicationInfo(): Promise<AppInfo> {
    return await this.jobRepository.getAppInfo();
  }

  async getHealthStatus(): Promise<HealthInfo> {
    const healthInfo = await this.jobRepository.getHealthInfo();

    // Business logic: Add additional health checks here
    if (healthInfo.uptime > 86400) {
      // More than 24 hours
      healthInfo.status = 'healthy - long running';
    }

    return healthInfo;
  }

  async generateGreeting(name: string): Promise<string> {
    const serverName = await this.jobRepository.getServerName();

    // Business logic: Generate personalized greeting
    if (!name || name.trim() === '') {
      return `Hello, Guest! Welcome to the ${serverName}.`;
    }

    const cleanName = name.trim();
    return `Hello, ${cleanName}! Welcome to the ${serverName}.`;
  }

  async fetchJobs(): Promise<JobRoleWithDetails[]> {
    return await this.jobRepository.getAllJobs();
  }

  async getJobById(jobID: number): Promise<JobRoleWithDetails[]> {
    const jobs = await this.jobRepository.getJobByID(jobID);
    return jobs;
  }

  async addJob(jobData: JobRole): Promise<boolean> {
    const response = await this.jobRepository.addJobRole(jobData);
    if (response) {
      return true;
    }
    return false;
  }
  async deleteJob(jobRoleId: number): Promise<boolean> {
    const response = await this.jobRepository.deleteJob(jobRoleId);
    if (response) {
      return true;
    }
    return false;
  }
}
