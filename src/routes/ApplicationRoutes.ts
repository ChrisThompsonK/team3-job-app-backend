import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import { applicationController } from '../di/ApplicationController.js';
import { requireAdmin, requireAuth } from '../middleware/adminAuth.js';

const router = Router();

// Wrapper to handle async errors in route handlers
const asyncHandler = (fn: (req: Request, res: Response) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };
};

// Public routes - users can submit applications and view their own
// Submit a new application
router.post(
  '/applications',
  asyncHandler(async (req, res) => applicationController.submitApplication(req, res))
);

// Get applications by email (for logged-in user to view their own applications)
// IMPORTANT: This must come BEFORE /applications/:id to avoid route conflicts
router.get(
  '/applications/my-applications',
  asyncHandler(async (req, res) => applicationController.getApplicationsByEmail(req, res))
);

// Withdraw application (delete from database)
// Protected route - users can only withdraw their own applications (requires authentication)
// Support both DELETE and POST methods for frontend compatibility
router.delete(
  '/applications/:id/withdraw',
  requireAuth,
  asyncHandler(async (req, res) => applicationController.withdrawApplication(req, res))
);
router.post(
  '/applications/:id/withdraw',
  requireAuth,
  asyncHandler(async (req, res) => applicationController.withdrawApplication(req, res))
);

// Admin-only routes - requires admin role for reports and management
// Get all applications (admin report)
router.get(
  '/applications',
  requireAdmin,
  asyncHandler(async (req, res) => applicationController.getAllApplications(req, res))
);

// Get a specific application by ID (admin access)
// IMPORTANT: This must come AFTER more specific routes like /applications/my-applications
router.get(
  '/applications/:id',
  requireAdmin,
  asyncHandler(async (req, res) => applicationController.getApplicationById(req, res))
);

// Get application details with job role information (admin access)
router.get(
  '/applications/:id/details',
  requireAdmin,
  asyncHandler(async (req, res) => applicationController.getApplicationByIdWithJobRole(req, res))
);

// Get all applications with job role details (admin report)
router.get(
  '/applications-with-roles',
  requireAdmin,
  asyncHandler(async (req, res) => applicationController.getApplicationsWithJobRoles(req, res))
);

// Get applications for a specific job role (admin only)
router.get(
  '/applications/job-role/:jobRoleId',
  requireAdmin,
  asyncHandler(async (req, res) => applicationController.getApplicationsByJobRole(req, res))
);

// Update application status (admin only)
router.put(
  '/applications/:id/status',
  requireAdmin,
  asyncHandler(async (req, res) => applicationController.updateApplicationStatus(req, res))
);

// Hire applicant (admin only) - convenience endpoint
router.put(
  '/applications/:id/hire',
  requireAdmin,
  asyncHandler(async (req, res) => applicationController.hireApplicant(req, res))
);

// Reject applicant (admin only) - convenience endpoint
router.put(
  '/applications/:id/reject',
  requireAdmin,
  asyncHandler(async (req, res) => applicationController.rejectApplicant(req, res))
);

// Get application analytics (admin only)
router.get(
  '/analytics/applications',
  requireAdmin,
  asyncHandler(async (req, res) => applicationController.getApplicationAnalytics(req, res))
);

export { router as applicationRoutes };
