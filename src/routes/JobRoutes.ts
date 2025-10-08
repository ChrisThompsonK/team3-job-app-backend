import { Router } from 'express';
import { jobController } from '../di/JobController.js';

const router = Router();


router.get('/jobs', async (req, res) => jobController.getJobs(req, res));

router.get('/jobs/:id', async (req, res) => jobController.getJobById(req, res));

router.post('/job', async (req, res) => jobController.addJobRole(req, res));

router.delete('/job/:id', async (req, res) => jobController.deleteJobRole(req, res));

router.put('/jobs/:id', async (req, res) => jobController.updateJobRole(req, res));
export { router as jobRoutes };
