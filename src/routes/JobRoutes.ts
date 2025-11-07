import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import { jobController } from '../di/JobController.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = Router();

// Wrapper to handle async errors in route handlers
const asyncHandler = (fn: (req: Request, res: Response) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };
};

// Public routes - anyone can view jobs
router.get(
  '/jobs',
  asyncHandler(async (req, res) => jobController.getJobs(req, res))
);

router.get(
  '/jobs/:id',
  asyncHandler(async (req, res) => jobController.getJobById(req, res))
);

// Admin-only routes - requires admin role
router.post(
  '/jobs/job',
  requireAdmin,
  asyncHandler(async (req, res) => jobController.addJobRole(req, res))
);

router.delete(
  '/jobs/:id',
  requireAdmin,
  asyncHandler(async (req, res) => jobController.deleteJobRole(req as Request<{ id: string }>, res))
);

router.put(
  '/jobs/:id',
  requireAdmin,
  asyncHandler(async (req, res) => jobController.updateJobRole(req, res))
);

router.get(
  '/capabilities',
  asyncHandler(async (req, res) => jobController.getCapabilities(req, res))
);

router.get(
  '/bands',
  asyncHandler(async (req, res) => jobController.getBands(req, res))
);

router.get(
  '/statuses',
  asyncHandler(async (req, res) => jobController.getStatuses(req, res))
);

// Auto-close expired job roles (for scheduled tasks)
router.post(
  '/jobs/auto-close',
  asyncHandler(async (req, res) => jobController.autoCloseExpiredJobRoles(req, res))
);

export { router as jobRoutes };
