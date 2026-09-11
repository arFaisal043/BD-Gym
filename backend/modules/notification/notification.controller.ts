import { Request, Response } from 'express';
import { NotificationService } from './notification.service';
import catchAsync from '../../utils/catchAsync';
import { sessionStore } from '../../utils/session';

export const NotificationController = {
  getNotifications: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id || sessionStore.getUserId();
    const notifications = await NotificationService.getNotifications(userId);
    res.status(200).json({ notifications });
  }),

  markAsRead: catchAsync(async (req: Request, res: Response) => {
    const result = await NotificationService.markAsRead(req.params.id);
    res.status(200).json(result);
  }),

  dispatch: catchAsync(async (req: Request, res: Response) => {
    const result = await NotificationService.dispatchNotification(req.body);
    res.status(200).json(result);
  }),
};
