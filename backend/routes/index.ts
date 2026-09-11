import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoutes } from '../modules/user/user.route';
import { MembershipRoutes } from '../modules/membership/membership.route';
import { MembershipController } from '../modules/membership/membership.controller';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { ContentRoutes } from '../modules/content/content.route';
import { NotificationRoutes } from '../modules/notification/notification.route';
import { ChatRoutes } from '../modules/chat/chat.route';

const router = Router();

// Dedicated route alias for membership plans
router.get('/membership-plans', MembershipController.getPlans);

const moduleRoutes = [
  { path: '/auth', route: AuthRoutes },
  { path: '/users', route: UserRoutes },
  { path: '/memberships', route: MembershipRoutes },
  { path: '/payments', route: PaymentRoutes },
  { path: '/admin', route: AdminRoutes },
  { path: '/notifications', route: NotificationRoutes },
  { path: '/chat', route: ChatRoutes },
  { path: '/', route: ContentRoutes },
];

moduleRoutes.forEach((item) => {
  router.use(item.path, item.route);
});

export default router;
