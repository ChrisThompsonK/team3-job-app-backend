import type {
  Band,
  Capability,
  JobRole,
  JobRoleCreate,
  JobRoleDetails,
  JobRoleUpdate,
  Status,
} from '../models/JobModel.js';
import type { JobRepository } from '../repositories/JobRepository.js';
export class JobService {
  private jobRepository: JobRepository;

  constructor(jobRepository: JobRepository) {
    this.jobRepository = jobRepository;
  }

  async updateJobRole(
    jobRoleId: number,
    requestBody: Record<string, unknown>
  ): Promise<JobRoleDetails | null> {
    // Business logic: Validate the job role ID
    if (!jobRoleId || jobRoleId <= 0) {
      throw new Error('Invalid job role ID');
    }

    // Business logic: Extract and validate updates from request body - standardized names
    const updates: JobRoleUpdate = {};

    if (requestBody['name'] !== undefined) updates.name = String(requestBody['name']);
    if (requestBody['location'] !== undefined) updates.location = String(requestBody['location']);
    if (requestBody['capabilityId'] !== undefined)
      updates.capabilityId = Number(requestBody['capabilityId']);
    if (requestBody['bandId'] !== undefined) updates.bandId = Number(requestBody['bandId']);
    if (requestBody['closingDate'] !== undefined)
      updates.closingDate = String(requestBody['closingDate']);
    if (requestBody['description'] !== undefined)
      updates.description = requestBody['description'] ? String(requestBody['description']) : null;
    if (requestBody['responsibilities'] !== undefined)
      updates.responsibilities = requestBody['responsibilities']
        ? String(requestBody['responsibilities'])
        : null;
    if (requestBody['jobSpecUrl'] !== undefined)
      updates.jobSpecUrl = requestBody['jobSpecUrl'] ? String(requestBody['jobSpecUrl']) : null;
    if (requestBody['statusId'] !== undefined) updates.statusId = Number(requestBody['statusId']);
    if (requestBody['openPositions'] !== undefined)
      updates.openPositions = Number(requestBody['openPositions']);

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

  async fetchJobs(sortBy = 'name', sortOrder = 'asc'): Promise<JobRole[]> {
    console.log('JobService.fetchJobs: Starting database query...');
    const startTime = Date.now();
    const result = await this.jobRepository.getAllJobs(sortBy, sortOrder);
    const endTime = Date.now();
    console.log(`JobService.fetchJobs: Database query completed in ${endTime - startTime}ms`);
    return result;
  }

  async getJobById(jobID: number): Promise<JobRoleDetails | null> {
    const job = await this.jobRepository.getJobById(jobID);
    return job;
  }

  async addJob(jobData: JobRoleCreate): Promise<JobRoleDetails | null> {
    // Business logic: Validate required fields - standardized names
    if (!jobData.name || jobData.name.trim() === '') {
      throw new Error('Role name is required');
    }

    if (!jobData.location || jobData.location.trim() === '') {
      throw new Error('Location is required');
    }

    if (!jobData.capabilityId || jobData.capabilityId <= 0) {
      throw new Error('Valid capability ID is required');
    }

    if (!jobData.bandId || jobData.bandId <= 0) {
      throw new Error('Valid band ID is required');
    }

    if (!jobData.closingDate) {
      throw new Error('Closing date is required');
    }

    // Business logic: Validate closing date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(jobData.closingDate)) {
      throw new Error('Invalid closing date format. Use YYYY-MM-DD');
    }

    // Business logic: Validate closing date is in the future
    const closingDate = new Date(jobData.closingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (closingDate < today) {
      throw new Error('Closing date must be in the future');
    }

    // Business logic: Validate openPositions if provided
    if (jobData.openPositions !== undefined && jobData.openPositions <= 0) {
      throw new Error('Open positions must be greater than 0');
    }

    try {
      const createdJob = await this.jobRepository.addJobRole(jobData);
      return createdJob;
    } catch (error) {
      // Handle database constraint errors
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check for foreign key constraint violations
      if (errorMessage.includes('FOREIGN KEY constraint failed')) {
        throw new Error('Invalid capability ID or band ID. Please select valid options from the dropdown.');
      }
      
      // Re-throw other errors
      throw error;
    }
  }

  async deleteJob(jobRoleId: number): Promise<boolean> {
    const response = await this.jobRepository.deleteJob(jobRoleId);
    if (response) {
      return true;
    }
    return false;
  }

  async getCapabilities(): Promise<Capability[]> {
    return await this.jobRepository.getAllCapabilities();
  }

  async getBands(): Promise<Band[]> {
    return await this.jobRepository.getAllBands();
  }

  async getStatuses(): Promise<Status[]> {
    return await this.jobRepository.getAllStatuses();
  }

  /**
   * Auto-close job roles that have expired (past closing date or no positions)
   * @returns Object with count of closed jobs and details
   */
  async autoCloseExpiredJobRoles(): Promise<{ closedCount: number; message: string }> {
    console.log('JobService.autoCloseExpiredJobRoles: Starting auto-close process...');
    const closedCount = await this.jobRepository.autoCloseExpiredJobRoles();

    const message =
      closedCount > 0
        ? `Successfully auto-closed ${closedCount} job role(s)`
        : 'No job roles needed to be closed';

    console.log(`JobService.autoCloseExpiredJobRoles: ${message}`);
    return { closedCount, message };
  }
}
