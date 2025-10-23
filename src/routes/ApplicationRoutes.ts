import { Router } from 'express';
import { applicationController } from '../di/ApplicationController.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = Router();

// Public routes - users can submit applications and view their own
// Submit a new application
router.post('/applications', async (req, res) => applicationController.submitApplication(req, res));

// Get applications by email (for logged-in user to view their own applications)
// IMPORTANT: This must come BEFORE /applications/:id to avoid route conflicts
router.get('/applications/my-applications', async (req, res) =>
  applicationController.getApplicationsByEmail(req, res)
);

// Admin-only routes - requires admin role for reports and management
// Get all applications (admin report)
router.get('/applications', requireAdmin, async (req, res) =>
  applicationController.getAllApplications(req, res)
);

// Get a specific application by ID (admin access)
// IMPORTANT: This must come AFTER more specific routes like /applications/my-applications
router.get('/applications/:id', requireAdmin, async (req, res) =>
  applicationController.getApplicationById(req, res)
);

// Get all applications with job role details (admin report)
router.get('/applications-with-roles', requireAdmin, async (req, res) =>
  applicationController.getApplicationsWithJobRoles(req, res)
);

// Update application status (admin only)
router.put('/applications/:id/status', requireAdmin, async (req, res) =>
  applicationController.updateApplicationStatus(req, res)
);

// Get application analytics (admin only)
router.get('/analytics/applications', requireAdmin, async (req, res) =>
  applicationController.getApplicationAnalytics(req, res)
);

export { router as applicationRoutes };
