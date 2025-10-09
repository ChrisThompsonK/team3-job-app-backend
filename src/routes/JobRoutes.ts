import { Router } from 'express';
import { jobController } from '../di/JobController.js';

const router = Router();

router.get('/jobs', async (req, res) => jobController.getJobs(req, res));

router.get('/jobs/:id', async (req, res) => jobController.getJobById(req, res));

router.post('/jobs/job', async (req, res) => jobController.addJobRole(req, res));

router.delete('/job/:id', async (req, res) => jobController.deleteJobRole(req, res));

router.put('/jobs/:id', async (req, res) => jobController.updateJobRole(req, res));

router.get('/capabilities', async (req, res) => jobController.getCapabilities(req, res));

router.get('/bands', async (req, res) => jobController.getBands(req, res));

export { router as jobRoutes };
