import type {
  Application,
  ApplicationCreate,
  ApplicationResponse,
  ApplicationWithJobRole,
} from '../models/ApplicationModel.js';
import type { ApplicationRepository } from '../repositories/ApplicationRepository.js';
import type { JobRepository } from '../repositories/JobRepository.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

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

  async getApplicationByIdWithJobRole(
    applicationID: number
  ): Promise<ApplicationWithJobRole | null> {
    if (!applicationID || applicationID <= 0) {
      throw new Error('Invalid application ID');
    }

    return await this.applicationRepository.getApplicationByIdWithJobRole(applicationID);
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

  async getApplicationsByJobRole(jobRoleId: number): Promise<Application[]> {
    if (!jobRoleId || jobRoleId <= 0) {
      throw new Error('Valid job role ID is required');
    }

    return await this.applicationRepository.getApplicationsByJobRole(jobRoleId);
  }

  async withdrawApplication(applicationID: number): Promise<boolean> {
    logger.info(`Attempting to withdraw application ${applicationID}`);

    if (!applicationID || applicationID <= 0) {
      logger.warn(`Invalid application ID: ${applicationID}`);
      throw new BadRequestError('Invalid application ID');
    }

    // Verify that the application exists
    const application = await this.applicationRepository.getApplicationById(applicationID);
    if (!application) {
      logger.warn(`Application ${applicationID} not found`);
      throw new NotFoundError('Application not found');
    }

    logger.info(`Found application ${applicationID}, proceeding with withdrawal`);

    const deleted = await this.applicationRepository.deleteApplication(applicationID);

    if (deleted) {
      logger.info(`Successfully deleted application ${applicationID}`);
    } else {
      logger.error(`Failed to delete application ${applicationID} from database`);
    }

    return deleted;
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

  /**
   * Hire an applicant - updates application status to 'Hired' and decrements openPositions
   * @param applicationID - The application ID to hire
   * @returns The updated application or null if not found
   */
  async hireApplicant(applicationID: number): Promise<Application | null> {
    if (!applicationID || applicationID <= 0) {
      throw new Error('Invalid application ID');
    }

    // Get the application to find the associated job role
    const application = await this.applicationRepository.getApplicationById(applicationID);

    if (!application) {
      throw new NotFoundError('Application not found');
    }

    // Check if the job role has open positions available
    const jobRole = await this.jobRepository.getJobById(application.jobRoleId);

    if (!jobRole) {
      throw new NotFoundError('Job role not found');
    }

    if (!jobRole.openPositions || jobRole.openPositions <= 0) {
      throw new ForbiddenError(
        'Cannot hire applicant: No open positions available for this job role'
      );
    }

    // Update the application status to 'Hired'
    const updatedApplication = await this.applicationRepository.updateApplicationStatus(
      applicationID,
      'Hired'
    );

    if (!updatedApplication) {
      throw new Error('Failed to update application status');
    }

    // Decrement the openPositions for the job role
    try {
      await this.jobRepository.decrementOpenPositions(application.jobRoleId);
      logger.info(
        `Successfully hired applicant ${applicationID} and decremented openPositions for job ${application.jobRoleId}`
      );
    } catch (error) {
      logger.error(`Failed to decrement openPositions for job ${application.jobRoleId}:`, error);
      // We still return the updated application even if decrement fails
      // The position decrement is not critical to the hire process
    }

    return updatedApplication;
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
      throw new Error(
        `Failed to get application analytics: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
