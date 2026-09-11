import { Router } from 'express';
import { AdminController } from './admin.controller';

const router = Router();

router.get('/dashboard', AdminController.getDashboard);
router.get('/users', AdminController.getUsers);
router.patch('/users/:id/status', AdminController.updateUserStatus);
router.patch('/users/:id/role', AdminController.updateUserRole);

export const AdminRoutes = router;
