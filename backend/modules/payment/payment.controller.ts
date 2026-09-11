import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import catchAsync from '../../utils/catchAsync';
import { sessionStore } from '../../utils/session';

export const PaymentController = {
  createPayment: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id || sessionStore.getUserId();
    if (!userId) {
      return res.status(401).json({ error: 'Please sign in to proceed with checkout.' });
    }
    const result = await PaymentService.createPaymentSession({
      userId,
      planId: req.body.planId,
      paymentMethod: req.body.paymentMethod,
      customerName: req.body.customerName,
    });
    res.status(200).json(result);
  }),

  verifyPayment: catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.verifyPayment(req.body);
    res.status(200).json(result);
  }),

  getMyPayments: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id || sessionStore.getUserId();
    if (!userId) {
      return res.status(200).json({ payments: [] });
    }
    const payments = await PaymentService.getMyPayments(userId);
    res.status(200).json({ payments });
  }),

  getAllPayments: catchAsync(async (_req: Request, res: Response) => {
    const payments = await PaymentService.getAllPayments();
    res.status(200).json({ payments });
  }),

  refundPayment: catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.refundPayment(req.params.id);
    res.status(200).json(result);
  }),
};
