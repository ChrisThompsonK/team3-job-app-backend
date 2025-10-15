import { ApplicationController } from '../controllers/ApplicationController.js';
import { ApplicationRepository } from '../repositories/ApplicationRepository.js';
import { JobRepository } from '../repositories/JobRepository.js';
import { ApplicationService } from '../services/ApplicationService.js';

const applicationRepository: ApplicationRepository = new ApplicationRepository();
const jobRepository: JobRepository = new JobRepository();
const applicationService: ApplicationService = new ApplicationService(
  applicationRepository,
  jobRepository
);
const applicationController: ApplicationController = new ApplicationController(applicationService);

export { applicationController };
