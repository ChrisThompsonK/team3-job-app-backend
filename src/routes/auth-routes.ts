import { Router } from 'express';
import { authController } from '../controllers/auth-controller.js';
import { authMiddleware } from '../middleware/adminAuth.js';

const router = Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes - require authentication
router.get('/user/:id', authMiddleware, authController.getUserById);

export default router;
