import { Router } from 'express';
import { AppController } from '../controllers/AppController.js';

const router = Router();
const appController = new AppController();

// Root endpoint
router.get('/', (req, res) => appController.getRoot(req, res));

// Health check endpoint
router.get('/health', (req, res) => appController.getHealth(req, res));

// Greeting endpoint
router.get('/greeting', (req, res) => appController.getGreeting(req, res));

router.get('/jobs', async (req, res) => appController.getJobs(req, res));

export { router as appRoutes };
