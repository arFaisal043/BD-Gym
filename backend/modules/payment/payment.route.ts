import { Router } from 'express';
import { PaymentController } from './payment.controller';

const router = Router();

router.post('/create', PaymentController.createPayment);
router.post('/verify', PaymentController.verifyPayment);
router.get('/me', PaymentController.getMyPayments);
router.get('/all', PaymentController.getAllPayments);
router.post('/:id/refund', PaymentController.refundPayment);

export const PaymentRoutes = router;
