import { Router } from 'express';
import { MembershipController } from './membership.controller';

const router = Router();

router.get('/plans', MembershipController.getPlans);
router.get('/me', MembershipController.getMyMemberships);
router.patch('/:id/toggle-pause', MembershipController.togglePause);
router.get('/all', MembershipController.getAllMemberships);

export const MembershipRoutes = router;
