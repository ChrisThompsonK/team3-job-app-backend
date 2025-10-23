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
      // Check both statusName and statusId for backward compatibility
      const isOpen = jobRole.statusName === 'Open' || jobRole.statusId === 1;
      if (!isOpen) {
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

  async getAllApplications(sortBy = 'createdAt', sortOrder = 'desc'): Promise<Application[]> {
    return await this.applicationRepository.getAllApplications(sortBy, sortOrder);
  }

  async getApplicationsWithJobRoles(
    sortBy = 'createdAt',
    sortOrder = 'desc'
  ): Promise<ApplicationWithJobRole[]> {
    return await this.applicationRepository.getApplicationsWithJobRoles(sortBy, sortOrder);
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

  async getApplicationsByEmail(emailAddress: string): Promise<ApplicationWithJobRole[]> {
    if (!emailAddress || !this.isValidEmail(emailAddress)) {
      throw new Error('Valid email address is required');
    }

    return await this.applicationRepository.getApplicationsByEmail(emailAddress);
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

  private isValidPhoneNumber(phone: string): boolean {
    // Check if it's a valid phone number format
    // Allow digits, spaces, hyphens, parentheses, and + sign
    // Must have at least 6 digits total (international numbers can be longer)
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 6 && digitsOnly.length <= 15 && /^[\d\s\-+()]+$/.test(phone);
  }

  private isValidStatus(status: string): boolean {
    const validStatuses = ['Pending', 'Reviewed', 'Accepted', 'Rejected'];
    return validStatuses.includes(status);
  }

  async getApplicationAnalytics(targetDate: Date): Promise<{
    applicationsCreatedToday: number;
    applicationsHiredToday: number;
    applicationsRejectedToday: number;
    applicationsAcceptedToday: number;
    totalApplicationsToday: number;
  }> {
    try {
      // Set the date range for the target day (start and end of day)
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      // Get analytics data from the repository
      const analytics = await this.applicationRepository.getApplicationAnalytics(
        startOfDay.toISOString(),
        endOfDay.toISOString()
      );

      return analytics;
    } catch (error) {
      throw new Error(`Failed to get application analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
