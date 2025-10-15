import type {
  Application,
  ApplicationCreate,
  ApplicationResponse,
  ApplicationWithJobRole,
} from '../models/ApplicationModel.js';
import type { ApplicationRepository } from '../repositories/ApplicationRepository.js';
import type { JobRepository } from '../repositories/JobRepository.js';

export class ApplicationService {
  private applicationRepository: ApplicationRepository;
  private jobRepository: JobRepository;

  constructor(applicationRepository: ApplicationRepository, jobRepository: JobRepository) {
    this.applicationRepository = applicationRepository;
    this.jobRepository = jobRepository;
  }

  async submitApplication(applicationData: ApplicationCreate): Promise<ApplicationResponse> {
    try {
      // Validate required fields
      this.validateApplicationData(applicationData);

      // Check if job role exists and has open positions
      if (!applicationData.jobRoleId || applicationData.jobRoleId <= 0) {
        return {
          success: false,
          message: 'Invalid job role ID',
        };
      }

      const jobRole = await this.jobRepository.getJobById(applicationData.jobRoleId);

      if (!jobRole) {
        return {
          success: false,
          message: 'Job role not found',
        };
      }

      // Check if job role is open for applications
      if (jobRole.status !== 'Open') {
        return {
          success: false,
          message: 'This job role is no longer accepting applications',
        };
      }

      // Check if there are open positions available
      if (!jobRole.openPositions || jobRole.openPositions <= 0) {
        return {
          success: false,
          message: 'No open positions available for this job role',
        };
      }

      // Create the application
      const newApplication = await this.applicationRepository.createApplication(applicationData);

      return {
        success: true,
        applicationID: newApplication.applicationID,
        message: 'Application submitted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit application',
      };
    }
  }

  async getApplicationById(applicationID: number): Promise<Application | null> {
    if (!applicationID || applicationID <= 0) {
      throw new Error('Invalid application ID');
    }

    return await this.applicationRepository.getApplicationById(applicationID);
  }

  async getAllApplications(): Promise<Application[]> {
    return await this.applicationRepository.getAllApplications();
  }

  async getApplicationsWithJobRoles(): Promise<ApplicationWithJobRole[]> {
    return await this.applicationRepository.getApplicationsWithJobRoles();
  }

  async updateApplicationStatus(
    applicationID: number,
    status: string
  ): Promise<Application | null> {
    if (!applicationID || applicationID <= 0) {
      throw new Error('Invalid application ID');
    }

    if (!this.isValidStatus(status)) {
      throw new Error('Invalid status. Must be one of: Pending, Reviewed, Accepted, Rejected');
    }

    return await this.applicationRepository.updateApplicationStatus(applicationID, status);
  }

  private validateApplicationData(data: ApplicationCreate): void {
    // Validate email format
    if (!data.emailAddress || !this.isValidEmail(data.emailAddress)) {
      throw new Error('Invalid email address format');
    }

    // Validate phone number
    if (!data.phoneNumber || !this.isValidPhoneNumber(data.phoneNumber)) {
      throw new Error('Invalid phone number. Must be a valid number');
    }

    // Validate job role ID
    if (!data.jobRoleId || data.jobRoleId <= 0) {
      throw new Error('Valid job role ID is required');
    }

    // Validate cover letter length if provided
    if (data.coverLetter && data.coverLetter.length > 2000) {
      throw new Error('Cover letter must be less than 2000 characters');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhoneNumber(phone: number): boolean {
    // Check if it's a positive number and has reasonable length (6-15 digits)
    const phoneStr = phone.toString();
    return phoneStr.length >= 6 && phoneStr.length <= 15 && /^\d+$/.test(phoneStr);
  }

  private isValidStatus(status: string): boolean {
    const validStatuses = ['Pending', 'Reviewed', 'Accepted', 'Rejected'];
    return validStatuses.includes(status);
  }
}
