import type { Request, Response } from 'express';
import type { JobRole } from '../models/JobModel.js';
import type { JobService } from '../services/JobService.js';

export class JobController {
  private jobService: JobService;

  constructor(jobService: JobService) {
    this.jobService = jobService;
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

  async getJobById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Job ID is required',
        });
        return;
      }

      const jobId = Number.parseInt(id, 10);

      if (Number.isNaN(jobId)) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Invalid job ID',
        });
        return;
      }

      const job = await this.jobService.getJobById(jobId);

      if (!job || job.length === 0) {
        res.status(404).json({
          error: 'Not found',
          message: `Job with ID ${jobId} not found`,
        });
        return;
      }

      // Return the first (and only) job object, not an array
      res.json(job[0]);
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

      const updatedJob = await this.jobService.updateJobRole(jobRoleId, req.body);

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
      const statusCode =
        errorMessage.includes('Invalid') || errorMessage.includes('No updates') ? 400 : 500;

      res.status(statusCode).json({
        error: statusCode === 400 ? 'Bad request' : 'Internal server error',
        message: errorMessage,
      });
    }
  }

  async addJobRole(req: Request, res: Response): Promise<void> {
    try {
      const jobData: JobRole = req.body;

      const createdJob = await this.jobService.addJob(jobData);

      if (!createdJob) {
        res.status(500).json({
          success: false,
          message: 'Failed to create job role',
        });
        return;
      }

      // Return the created job data instead of just success message
      res.status(201).json(createdJob);
    } catch (error) {
      console.error('Error in addJob controller:', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error creating job role',
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
      const job = await this.jobService.getJobById(jobRoleId);
      if (!job) {
        _res.status(404).json({
          error: 'Not Found',
          message: `Job with ID ${jobRoleId} not found`,
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

  async getCapabilities(_req: Request, res: Response): Promise<void> {
    try {
      const capabilities = await this.jobService.getCapabilities();
      res.status(200).json(capabilities);
    } catch (error) {
      console.error('Error fetching capabilities:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Failed to fetch capabilities',
      });
    }
  }

  async getBands(_req: Request, res: Response): Promise<void> {
    try {
      const bands = await this.jobService.getBands();
      res.status(200).json(bands);
    } catch (error) {
      console.error('Error fetching bands:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Failed to fetch bands',
      });
    }
  }
}
