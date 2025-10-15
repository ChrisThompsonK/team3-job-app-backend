import type { Request, Response } from 'express';
import type { ApplicationCreate } from '../models/ApplicationModel.js';
import type { ApplicationService } from '../services/ApplicationService.js';

export class ApplicationController {
  private applicationService: ApplicationService;

  constructor(applicationService: ApplicationService) {
    this.applicationService = applicationService;
  }

  // Helper method to parse and validate ID
  private parseId(id: string): number | null {
    const parsed = Number.parseInt(id, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }

  // Helper method for error responses
  private handleError(res: Response, error: unknown, message: string): void {
    console.error(message, error);
    res.status(500).json({
      error: 'Internal server error',
      message,
    });
  }

  async submitApplication(req: Request, res: Response): Promise<void> {
    try {
      const applicationData: ApplicationCreate = req.body;

      if (!applicationData.jobRoleId || !applicationData.emailAddress || !applicationData.phoneNumber) {
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
      this.handleError(res, error, 'Failed to submit application');
    }
  }

  async getApplicationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const applicationId = id ? this.parseId(id) : null;

      if (!applicationId) {
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
      this.handleError(res, error, 'Failed to fetch application');
    }
  }

  async getAllApplications(_req: Request, res: Response): Promise<void> {
    try {
      const applications = await this.applicationService.getAllApplications();
      res.json(applications);
    } catch (error) {
      this.handleError(res, error, 'Failed to fetch applications');
    }
  }

  async getApplicationsWithJobRoles(_req: Request, res: Response): Promise<void> {
    try {
      const applications = await this.applicationService.getApplicationsWithJobRoles();
      res.json(applications);
    } catch (error) {
      this.handleError(res, error, 'Failed to fetch applications');
    }
  }

  // Admin-only endpoint for updating application status
  async updateApplicationStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const applicationId = id ? this.parseId(id) : null;

      if (!applicationId || !status) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Application ID and status are required',
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
      this.handleError(res, error, 'Failed to update application status');
    }
  }
}
