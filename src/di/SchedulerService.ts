import { SchedulerService } from '../services/SchedulerService.js';
import { jobService } from './JobController.js';

// Create and export the SchedulerService instance
export const schedulerService = new SchedulerService(jobService);