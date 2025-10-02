import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';

const router = Router();
const userController = new UserController();

// User CRUD endpoints
router.post('/', (req, res) => userController.createUser(req, res));
router.get('/', (req, res) => userController.getAllUsers(req, res));
router.get('/:id', (req, res) => userController.getUserById(req, res));
router.put('/:id', (req, res) => userController.updateUser(req, res));
router.delete('/:id', (req, res) => userController.deleteUser(req, res));

// Special endpoints
router.get('/filter/adults', (req, res) => userController.getAdultUsers(req, res));
router.get('/stats/overview', (req, res) => userController.getUserStatistics(req, res));

export { router as userRoutes };
