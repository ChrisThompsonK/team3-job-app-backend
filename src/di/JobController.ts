import { AppController } from '../controllers/AppController';
import { AppRepository } from '../repositories/AppRepository';
import { AppService } from '../services/AppService';

const appRepository: AppRepository = new AppRepository();
const appService: AppService = new AppService(appRepository);
const appController: AppController = new AppController(appService);
export { appController };
