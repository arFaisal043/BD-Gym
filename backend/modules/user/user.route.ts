import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();

router.put('/profile', UserController.updateProfile);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);

export const UserRoutes = router;
