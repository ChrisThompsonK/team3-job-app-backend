import { Router } from 'express';
import { applicationController } from '../di/ApplicationController.js';

const router = Router();

// Submit a new application
router.post('/applications', async (req, res) => applicationController.submitApplication(req, res));

// Get a specific application by ID
router.get('/applications/:id', async (req, res) =>
  applicationController.getApplicationById(req, res)
);

// Get applications by email (for logged-in user to view their own applications)
// Note: This should come BEFORE the general /applications route to avoid route conflicts
router.get('/applications/my-applications', async (req, res) =>
  applicationController.getApplicationsByEmail(req, res)
);

// Get all applications
router.get('/applications', async (req, res) => applicationController.getAllApplications(req, res));

// Get all applications with job role details
router.get('/applications-with-roles', async (req, res) =>
  applicationController.getApplicationsWithJobRoles(req, res)
);

// Update application status
router.put('/applications/:id/status', async (req, res) =>
  applicationController.updateApplicationStatus(req, res)
);

export { router as applicationRoutes };
