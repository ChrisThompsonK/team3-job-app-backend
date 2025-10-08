import { AppController } from '../controllers/AppController.js';
import { AppRepository } from '../repositories/AppRepository.js';
import { AppService } from '../services/AppService.js';

const appRepository: AppRepository = new AppRepository();
const appService: AppService = new AppService(appRepository);
const appController: AppController = new AppController(appService);
export { appController };
