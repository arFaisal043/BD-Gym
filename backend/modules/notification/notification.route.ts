import { Router } from 'express';
import { NotificationController } from './notification.controller';

const router = Router();

router.get('/', NotificationController.getNotifications);
router.patch('/:id/read', NotificationController.markAsRead);
router.post('/dispatch', NotificationController.dispatch);

export const NotificationRoutes = router;
