import type { Request, Response } from 'express';
import type { JobRoleCreate } from '../models/JobModel.js';
import type { JobService } from '../services/JobService.js';

export class JobController {
  private jobService: JobService;

  constructor(jobService: JobService) {
    this.jobService = jobService;
  }

  async getJobs(req: Request, res: Response): Promise<void> {
    try {
      console.log('JobController.getJobs: Starting to fetch jobs...');
      const startTime = Date.now();

      // Extract sort parameters from query string
      const sortBy = (req.query['sortBy'] as string) || 'name';
      const sortOrder = (req.query['sortOrder'] as string) || 'asc';

      // Extract pagination parameters from query string
      const limit = req.query['limit']
        ? Number.parseInt(req.query['limit'] as string, 10)
        : undefined;
      const offset = req.query['offset']
        ? Number.parseInt(req.query['offset'] as string, 10)
        : undefined;

      // Validate pagination parameters
      if (limit !== undefined && (Number.isNaN(limit) || limit < 0)) {
        console.warn('Invalid limit parameter:', req.query['limit']);
        res.status(400).json({
          error: 'Bad request',
          message: 'Invalid limit parameter',
        });
        return;
      }

      if (offset !== undefined && (Number.isNaN(offset) || offset < 0)) {
        console.warn('Invalid offset parameter:', req.query['offset']);
        res.status(400).json({
          error: 'Bad request',
          message: 'Invalid offset parameter',
        });
        return;
      }

      console.log(
        `JobController.getJobs: Query params - sortBy: ${sortBy}, sortOrder: ${sortOrder}, limit: ${limit}, offset: ${offset}`
      );

      const jobs = await this.jobService.fetchJobs(sortBy, sortOrder, limit, offset);
      const endTime = Date.now();
      console.log(
        `JobController.getJobs: Successfully fetched ${jobs.length} jobs in ${endTime - startTime}ms`
      );

      // Always return 200 with the jobs array (even if empty)
      res.status(200).json(jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch jobs';
      console.error('Error details:', errorMessage);

      res.status(500).json({
        error: 'Internal server error',
        message: errorMessage,
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

      if (!job) {
        res.status(404).json({
          error: 'Not found',
          message: `Job with ID ${jobId} not found`,
        });
        return;
      }

      // Return the first (and only) job object, not an array
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
      const jobData: JobRoleCreate = req.body;

      const createdJob = await this.jobService.addJob(jobData);

      if (!createdJob) {
        res.status(500).json({
          success: false,
          message: 'Failed to create job role - no data returned',
        });
        return;
      }

      // Return the created job data instead of just success message
      res.status(201).json(createdJob);
    } catch (error) {
      console.error('Error in addJob controller:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error creating job role';

      // Determine status code based on error type
      let statusCode = 400;
      if (errorMessage.includes('Failed to create') || errorMessage.includes('database')) {
        statusCode = 500;
      }

      res.status(statusCode).json({
        success: false,
        message: errorMessage,
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
      console.log('JobController.getCapabilities: Starting to fetch capabilities...');
      const startTime = Date.now();

      const capabilities = await this.jobService.getCapabilities();

      const endTime = Date.now();
      console.log(
        `JobController.getCapabilities: Fetched ${capabilities.length} capabilities in ${endTime - startTime}ms`
      );

      // Return 200 regardless of whether capabilities is empty or has data
      res.status(200).json(capabilities || []);
    } catch (error) {
      console.error('Error fetching capabilities:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch capabilities';
      console.error('Error details:', errorMessage);

      res.status(500).json({
        error: 'Internal server error',
        message: errorMessage,
      });
    }
  }

  async getBands(_req: Request, res: Response): Promise<void> {
    try {
      console.log('JobController.getBands: Starting to fetch bands...');
      const startTime = Date.now();

      const bands = await this.jobService.getBands();

      const endTime = Date.now();
      console.log(
        `JobController.getBands: Fetched ${bands.length} bands in ${endTime - startTime}ms`
      );

      // Return 200 regardless of whether bands is empty or has data
      res.status(200).json(bands || []);
    } catch (error) {
      console.error('Error fetching bands:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bands';
      console.error('Error details:', errorMessage);

      res.status(500).json({
        error: 'Internal server error',
        message: errorMessage,
      });
    }
  }

  async getStatuses(_req: Request, res: Response): Promise<void> {
    try {
      console.log('JobController.getStatuses: Starting to fetch statuses...');
      const startTime = Date.now();

      const statuses = await this.jobService.getStatuses();

      const endTime = Date.now();
      console.log(
        `JobController.getStatuses: Fetched ${statuses.length} statuses in ${endTime - startTime}ms`
      );

      // Return 200 regardless of whether statuses is empty or has data
      res.status(200).json(statuses || []);
    } catch (error) {
      console.error('Error fetching statuses:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch statuses';
      console.error('Error details:', errorMessage);

      res.status(500).json({
        error: 'Internal server error',
        message: errorMessage,
      });
    }
  }

  /**
   * Auto-close expired job roles
   * POST /jobs/auto-close
   */
  async autoCloseExpiredJobRoles(_req: Request, res: Response): Promise<void> {
    try {
      console.log('JobController.autoCloseExpiredJobRoles: Starting auto-close process...');
      const result = await this.jobService.autoCloseExpiredJobRoles();
      res.status(200).json(result);
    } catch (error) {
      console.error('Error auto-closing job roles:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Failed to auto-close job roles',
      });
    }
  }
}
