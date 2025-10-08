import { Router } from 'express';
import { jobController } from '../di/JobController.js';

const router = Router();

// Root endpoint
router.get('/', (req, res) => jobController.getRoot(req, res));

// Health check endpoint
router.get('/health', (req, res) => jobController.getHealth(req, res));

// Greeting endpoint
router.get('/greeting', (req, res) => jobController.getGreeting(req, res));

router.get('/jobs', async (req, res) => jobController.getJobs(req, res));

router.get('/jobs/:id', async (req, res) => jobController.getJobById(req, res));

router.post('/job', async (req, res) => jobController.addJobRole(req, res));

router.delete('/job/:id', async (req, res) => jobController.deleteJobRole(req, res));

router.put('/jobs/:id', async (req, res) => jobController.updateJobRole(req, res));
export { router as jobRoutes };
