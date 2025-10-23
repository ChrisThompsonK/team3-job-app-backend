import type { Request, Response } from 'express';
import type { ApplicationCreate } from '../models/ApplicationModel.js';
import type { ApplicationService } from '../services/ApplicationService.js';
import { logger } from '../utils/logger.js';

export class ApplicationController {
  private applicationService: ApplicationService;

  constructor(applicationService: ApplicationService) {
    this.applicationService = applicationService;
  }

  async submitApplication(req: Request, res: Response): Promise<void> {
    try {
      const applicationData: ApplicationCreate = req.body;

      // Basic validation that required fields are present
      if (
        !applicationData.jobRoleId ||
        !applicationData.emailAddress ||
        !applicationData.phoneNumber
      ) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Missing required fields: jobRoleId, emailAddress, and phoneNumber are required',
        });
        return;
      }

      const result = await this.applicationService.submitApplication(applicationData);

      if (result.success) {
        res.status(201).json({
          success: true,
          applicationID: result.applicationID,
          message: result.message,
        });
      } else {
        res.status(400).json({
          error: 'Validation error',
          message: result.message,
        });
      }
    } catch (error) {
      logger.error('Error submitting application', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to submit application',
      });
    }
  }

  async getApplicationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Application ID is required',
        });
        return;
      }

      const applicationId = Number.parseInt(id, 10);

      if (Number.isNaN(applicationId)) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Invalid application ID',
        });
        return;
      }

      const application = await this.applicationService.getApplicationById(applicationId);

      if (!application) {
        res.status(404).json({
          error: 'Not found',
          message: 'Application not found',
        });
        return;
      }

      res.json(application);
    } catch (error) {
      logger.error('Error fetching application:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch application',
      });
    }
  }

  async getAllApplications(req: Request, res: Response): Promise<void> {
    try {
      // Extract sort parameters from query string
      const sortBy = (req.query['sortBy'] as string) || 'createdAt';
      const sortOrder = (req.query['sortOrder'] as string) || 'desc';

      const applications = await this.applicationService.getAllApplications(sortBy, sortOrder);
      res.json(applications);
    } catch (error) {
      logger.error('Error fetching applications:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch applications',
      });
    }
  }

  async getApplicationsWithJobRoles(req: Request, res: Response): Promise<void> {
    try {
      // Extract sort parameters from query string
      const sortBy = (req.query['sortBy'] as string) || 'createdAt';
      const sortOrder = (req.query['sortOrder'] as string) || 'desc';

      const applications = await this.applicationService.getApplicationsWithJobRoles(
        sortBy,
        sortOrder
      );
      res.json(applications);
    } catch (error) {
      logger.error('Error fetching applications with job roles:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch applications',
      });
    }
  }

  // Admin-only endpoint for updating application status
  async updateApplicationStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Application ID is required',
        });
        return;
      }

      if (!status) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Status is required',
        });
        return;
      }

      const applicationId = Number.parseInt(id, 10);

      if (Number.isNaN(applicationId)) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Invalid application ID',
        });
        return;
      }

      const updatedApplication = await this.applicationService.updateApplicationStatus(
        applicationId,
        status
      );

      if (!updatedApplication) {
        res.status(404).json({
          error: 'Not found',
          message: 'Application not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Application status updated successfully',
        application: updatedApplication,
      });
    } catch (error) {
      logger.error('Error updating application status:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to update application status',
      });
    }
  }

  // Get applications by email address (for logged-in user to view their own applications)
  async getApplicationsByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.query;

      if (!email || typeof email !== 'string') {
        res.status(400).json({
          error: 'Bad request',
          message: 'Email address is required as a query parameter',
        });
        return;
      }

      const applications = await this.applicationService.getApplicationsByEmail(email);
      res.json(applications);
    } catch (error) {
      logger.error('Error fetching applications by email:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch applications',
      });
    }
  }

  // Get daily application analytics
  async getApplicationAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { date } = req.query;

      // Default to today if no date provided
      let targetDate = new Date();
      if (date && typeof date === 'string') {
        targetDate = new Date(date);
        if (Number.isNaN(targetDate.getTime())) {
          res.status(400).json({
            error: 'Bad request',
            message: 'Invalid date format. Please use YYYY-MM-DD format.',
          });
          return;
        }
      }

      const analytics = await this.applicationService.getApplicationAnalytics(targetDate);

      res.json({
        success: true,
        data: analytics,
        date: targetDate.toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error fetching application analytics:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch analytics data',
      });
    }
  }

  // Get all applications for a specific job role (admin only)
  async getApplicationsByJobRole(req: Request, res: Response): Promise<void> {
    try {
      const { jobRoleId } = req.params;

      if (!jobRoleId) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Job role ID is required',
        });
        return;
      }

      const parsedJobRoleId = Number.parseInt(jobRoleId, 10);

      if (Number.isNaN(parsedJobRoleId)) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Invalid job role ID',
        });
        return;
      }

      const applications = await this.applicationService.getApplicationsByJobRole(parsedJobRoleId);
      res.json(applications);
    } catch (error) {
      logger.error('Error fetching applications by job role:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch applications',
      });
    }
  }

  // Withdraw application (delete from database)
  async withdrawApplication(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      // Accept email from either request body or query parameter (frontend compatibility)
      const email = req.body.email || (req.query['email'] as string);

      logger.info(`Withdrawal request - ID: ${id}, Body:`, req.body, 'Query:', req.query);
      logger.info(`Request headers:`, req.headers);
      logger.info(`Full URL:`, req.url);

      if (!id) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Application ID is required',
        });
        return;
      }

      // If no email is provided, we need to handle this differently
      // This is a temporary workaround - the frontend should send the user's email for security
      if (!email || typeof email !== 'string') {
        logger.warn(`Withdrawal attempt without email verification - ID: ${id}`);
        logger.warn(`SECURITY WARNING: Frontend not sending email for ownership verification`);
        logger.warn(`Request body:`, req.body, 'Query:', req.query);

        // For now, return an error requiring the email
        // The frontend MUST be fixed to send the user's email
        res.status(400).json({
          success: false,
          error: 'Bad request',
          message:
            'Email address is required for security verification. The frontend must send the user email in the request body: {"email": "user@example.com"} or as query parameter: ?email=user@example.com',
        });
        return;
      }

      const applicationId = Number.parseInt(id, 10);

      if (Number.isNaN(applicationId)) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Invalid application ID',
        });
        return;
      }

      const success = await this.applicationService.withdrawApplication(applicationId, email);

      if (!success) {
        logger.warn(
          `Withdrawal failed - application ${applicationId} not found or unauthorized for ${email}`
        );
        res.status(404).json({
          success: false,
          error: 'Not found',
          message: 'Application not found or could not be withdrawn',
        });
        return;
      }

      logger.info(`Application ${applicationId} successfully withdrawn by ${email}`);
      res.status(200).json({
        success: true,
        message: 'Application withdrawn successfully',
      });
    } catch (error) {
      logger.error('Error withdrawing application:', error);
      if (error instanceof Error) {
        // Handle specific error cases
        if (error.message.includes('not found')) {
          res.status(404).json({
            success: false,
            error: 'Not found',
            message: error.message,
          });
        } else if (error.message.includes('only withdraw your own')) {
          res.status(403).json({
            success: false,
            error: 'Forbidden',
            message: error.message,
          });
        } else {
          res.status(400).json({
            success: false,
            error: 'Bad request',
            message: error.message,
          });
        }
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
          message: 'Error processing withdraw request',
        });
      }
    }
  }
}
