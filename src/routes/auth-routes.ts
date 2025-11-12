import { Router } from 'express';
import { authController } from '../controllers/auth-controller.js';

const router = Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/user/:id', authController.getUserById);

export default router;
