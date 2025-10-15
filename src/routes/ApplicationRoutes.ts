import { Router } from 'express';
import { applicationController } from '../di/ApplicationController.js';

const router = Router();

// Submit a new application
router.post('/applications', async (req, res) => applicationController.submitApplication(req, res));

// Get applications by email (for logged-in user to view their own applications)
// IMPORTANT: This must come BEFORE /applications/:id to avoid route conflicts
router.get('/applications/my-applications', async (req, res) =>
  applicationController.getApplicationsByEmail(req, res)
);

// Get all applications
router.get('/applications', async (req, res) => applicationController.getAllApplications(req, res));

// Get a specific application by ID
// IMPORTANT: This must come AFTER more specific routes like /applications/my-applications
router.get('/applications/:id', async (req, res) =>
  applicationController.getApplicationById(req, res)
);

// Get all applications with job role details
router.get('/applications-with-roles', async (req, res) =>
  applicationController.getApplicationsWithJobRoles(req, res)
);

// Update application status
router.put('/applications/:id/status', async (req, res) =>
  applicationController.updateApplicationStatus(req, res)
);

export { router as applicationRoutes };
