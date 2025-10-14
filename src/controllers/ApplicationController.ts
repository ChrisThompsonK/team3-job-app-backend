import type { Request, Response } from 'express';
import type { ApplicationCreate } from '../models/ApplicationModel.js';
import type { ApplicationService } from '../services/ApplicationService.js';

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
      console.error('Error submitting application:', error);
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
      console.error('Error fetching application:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch application',
      });
    }
  }

  async getAllApplications(_req: Request, res: Response): Promise<void> {
    try {
      const applications = await this.applicationService.getAllApplications();
      res.json(applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch applications',
      });
    }
  }

  async getApplicationsWithJobRoles(_req: Request, res: Response): Promise<void> {
    try {
      const applications = await this.applicationService.getApplicationsWithJobRoles();
      res.json(applications);
    } catch (error) {
      console.error('Error fetching applications with job roles:', error);
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
      console.error('Error updating application status:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to update application status',
      });
    }
  }
}
