import type { Request, Response } from 'express';
import type { JobRole } from '../models/JobModel.js';
import type { JobService } from '../services/JobService.js';

export class JobController {
  private jobService: JobService;

  constructor(jobService: JobService) {
    this.jobService = jobService;
  }

  async getRoot(_req: Request, res: Response): Promise<void> {
    try {
      const appInfo = await this.jobService.getApplicationInfo();
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
      const healthInfo = await this.jobService.getHealthStatus();
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
      const greeting = await this.jobService.generateGreeting((name as string) || 'Developer');

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
      const jobs = await this.jobService.fetchJobs();
      res.json(jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch jobs',
      });
    }
  }

  async getJobByID(_req: Request<{ id: string }>, _res: Response): Promise<void> {
    try {
      if (!_req.params.id) {
        _res.status(400).json({
          error: 'Bad Request',
          message: 'Job ID is required',
        });
        return;
      }
      const jobID = parseInt(_req.params.id, 10);
      if (Number.isNaN(jobID)) {
        _res.status(400).json({
          error: 'Bad Request',
          message: 'Job ID must be a valid number',
        });
        return;
      }
      const job = await this.jobService.getJobById(jobID);
      _res.status(200).json({
        job: job[0],
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      _res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch job by ID',
      });
    }
  }

  async addJobRole(_req: Request, _res: Response): Promise<void> {
    try {
      const jobData: JobRole = _req.body;
      const response = await this.jobService.addJob(jobData);
      if (response) {
        _res.status(201).json({
          success: true,
          message: 'Job role added successfully',
        });
      } else {
        _res.status(400).json({
          success: false,
          message: 'Failed to add job role',
        });
      }
    } catch (error) {
      console.error('Error adding job role:', error);
      _res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to add job role',
      });
    }
  }
  async deleteJobRole(_req: Request<{ id: string }>, _res: Response): Promise<void> {
    try {
      if (!_req.params.id) {
        _res.status(400).json({
          error: 'Bad Request',
          message: 'Job ID is required',
        });
        return;
      }
      const jobRoleId = parseInt(_req.params.id, 10);
      if (Number.isNaN(jobRoleId)) {
        _res.status(400).json({
          error: 'Bad Request',
          message: 'Job ID must be a valid number',
        });
        return;
      }
      const response = await this.jobService.deleteJob(jobRoleId);
      if (response) {
        _res.status(200).json({
          success: true,
          message: 'Job role deleted successfully',
        });
      } else {
        _res.status(400).json({
          success: false,
          message: 'Failed to delete job role',
        });
      }
    } catch (error) {
      console.error('Error deleting job role:', error);
      _res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to delete job role',
      });
    }
  }
}
