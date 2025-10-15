import { ApplicationController } from '../controllers/ApplicationController.js';
import { ApplicationRepository } from '../repositories/ApplicationRepository.js';
import { ApplicationService } from '../services/ApplicationService.js';

const applicationRepository: ApplicationRepository = new ApplicationRepository();
const applicationService: ApplicationService = new ApplicationService(applicationRepository);
const applicationController: ApplicationController = new ApplicationController(applicationService);

export { applicationController };
