import { AppController } from "../controllers/AppController";
import { AppService } from "../services/AppService";
import { AppRepository } from "../repositories/AppRepository";

const appRepository:AppRepository = new AppRepository();
const appService:AppService = new AppService(appRepository);
const appController:AppController= new AppController(appService);
export { appController };