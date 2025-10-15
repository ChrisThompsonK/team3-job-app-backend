import { JobController } from '../controllers/JobController.js';
import { JobRepository } from '../repositories/JobRepository.js';
import { JobService } from '../services/JobService.js';

const jobRepository: JobRepository = new JobRepository();
const jobService: JobService = new JobService(jobRepository);
const jobController: JobController = new JobController(jobService);

export { jobController, jobService };
