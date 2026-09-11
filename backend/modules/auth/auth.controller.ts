import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import catchAsync from '../../utils/catchAsync';
import { sessionStore } from '../../utils/session';

export const AuthController = {
  register: catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  }),

  login: catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    res.status(200).json(result);
  }),

  getMe: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id || sessionStore.getUserId();
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const result = await AuthService.getMe(userId);
    res.status(200).json(result);
  }),

  switchPersona: catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.body;
    const result = await AuthService.switchPersona(userId);
    res.status(200).json(result);
  }),

  logout: catchAsync(async (_req: Request, res: Response) => {
    const result = await AuthService.logout();
    res.status(200).json(result);
  }),
};
