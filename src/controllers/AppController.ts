import type { Request, Response } from 'express';
import type { AppService } from '../services/AppService.js';

export class AppController {
  private appService: AppService;

  constructor(appService: AppService) {
    this.appService = appService;
  }

  async getRoot(_req: Request, res: Response): Promise<void> {
    try {
      const appInfo = await this.appService.getApplicationInfo();
      res.json(appInfo);
    } catch (error) {
      console.error('Error getting app info:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to get application information',
      });
    }
  }

  async getHealth(_req: Request, res: Response): Promise<void> {
    try {
      const healthInfo = await this.appService.getHealthStatus();
      res.json(healthInfo);
    } catch (error) {
      console.error('Error getting health status:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to get health status',
      });
    }
  }

  async getGreeting(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.query;
      const greeting = await this.appService.generateGreeting((name as string) || 'Developer');

      res.json({
        greeting,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error generating greeting:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to generate greeting',
      });
    }
  }

  async getJobs(_req: Request, res: Response): Promise<void> {
    try {
      const jobs = await this.appService.fetchJobs();
      res.json(jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch jobs',
      });
    }
  }

  async getJobById(req: Request, res: Response): Promise<void> {
    try {
      const jobRoleId = Number.parseInt(req.params['id'] || '', 10);

      if (Number.isNaN(jobRoleId)) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Invalid job role ID',
        });
        return;
      }

      const job = await this.appService.fetchJobById(jobRoleId);

      if (!job) {
        res.status(404).json({
          error: 'Not found',
          message: `Job role with ID ${jobRoleId} not found`,
        });
        return;
      }

      res.json(job);
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch job';
      const statusCode = errorMessage.includes('Invalid') ? 400 : 500;

      res.status(statusCode).json({
        error: statusCode === 400 ? 'Bad request' : 'Internal server error',
        message: errorMessage,
      });
    }
  }

  async updateJobRole(req: Request, res: Response): Promise<void> {
    try {
      const jobRoleId = Number.parseInt(req.params['id'] || '', 10);

      if (Number.isNaN(jobRoleId)) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Invalid job role ID',
        });
        return;
      }

      const { roleName, location, capabilityId, bandId, closingDate } = req.body;

      const updates: {
        roleName?: string;
        location?: string;
        capabilityId?: number;
        bandId?: number;
        closingDate?: string;
      } = {};

      if (roleName !== undefined) updates.roleName = roleName;
      if (location !== undefined) updates.location = location;
      if (capabilityId !== undefined) updates.capabilityId = capabilityId;
      if (bandId !== undefined) updates.bandId = bandId;
      if (closingDate !== undefined) updates.closingDate = closingDate;

      const updatedJob = await this.appService.updateJobRole(jobRoleId, updates);

      if (!updatedJob) {
        res.status(404).json({
          error: 'Not found',
          message: 'Job role not found',
        });
        return;
      }

      res.json(updatedJob);
    } catch (error) {
      console.error('Error updating job role:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update job role';
      const statusCode = errorMessage.includes('Invalid') || errorMessage.includes('No updates') ? 400 : 500;

      res.status(statusCode).json({
        error: statusCode === 400 ? 'Bad request' : 'Internal server error',
        message: errorMessage,
      });
    }
  }
}
