import { Router } from 'express';

import { AuthController } from '../controllers/AuthController.js';

const router = Router();
const authController = new AuthController();

// Authentication routes
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));
router.get('/profile', (req, res) => authController.profile(req, res));

export { router as authRoutes };