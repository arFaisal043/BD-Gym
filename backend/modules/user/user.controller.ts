import { Request, Response } from 'express';
import { UserService } from './user.service';
import catchAsync from '../../utils/catchAsync';
import { sessionStore } from '../../utils/session';

export const UserController = {
  getAllUsers: catchAsync(async (_req: Request, res: Response) => {
    const users = await UserService.getAllUsers();
    res.status(200).json({ users });
  }),

  getUserById: catchAsync(async (req: Request, res: Response) => {
    const user = await UserService.getUserById(req.params.id);
    res.status(200).json({ user });
  }),

  updateProfile: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id || sessionStore.getUserId();
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const result = await UserService.updateProfile(userId, req.body);
    res.status(200).json(result);
  }),
};
