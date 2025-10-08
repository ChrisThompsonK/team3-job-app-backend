import type { JobRole, JobRoleDetail, JobRoleWithDetails } from '../models/JobModel.js';
import type { JobRepository } from '../repositories/JobRepository.js';
export class JobService {
  private jobRepository: JobRepository;

  constructor(jobRepository: JobRepository) {
    this.jobRepository = jobRepository;
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

    return await this.jobRepository.updateJobRole(jobRoleId, updates);
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
