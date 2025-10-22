import type { Request } from 'express';
import { Router } from 'express';
import { jobController } from '../di/JobController.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = Router();

// Public routes - anyone can view jobs
router.get('/jobs', async (req, res) => jobController.getJobs(req, res));

router.get('/jobs/:id', async (req, res) => jobController.getJobById(req, res));

// Admin-only routes - requires admin role
router.post('/jobs/job', requireAdmin, async (req, res) => jobController.addJobRole(req, res));

router.delete('/jobs/:id', requireAdmin, async (req: Request<{ id: string }>, res) =>
  jobController.deleteJobRole(req, res)
);

router.put('/jobs/:id', requireAdmin, async (req, res) => jobController.updateJobRole(req, res));

router.get('/capabilities', async (req, res) => jobController.getCapabilities(req, res));

router.get('/bands', async (req, res) => jobController.getBands(req, res));

router.get('/statuses', async (req, res) => jobController.getStatuses(req, res));

// Auto-close expired job roles (for scheduled tasks)
router.post('/jobs/auto-close', async (req, res) =>
  jobController.autoCloseExpiredJobRoles(req, res)
);

export { router as jobRoutes };
