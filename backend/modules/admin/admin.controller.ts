import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import catchAsync from '../../utils/catchAsync';

export const AdminController = {
  getDashboard: catchAsync(async (_req: Request, res: Response) => {
    const data = await AdminService.getDashboard();
    res.status(200).json(data);
  }),

  getUsers: catchAsync(async (_req: Request, res: Response) => {
    const users = await AdminService.getUsers();
    res.status(200).json({ users });
  }),

  updateUserStatus: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.updateUserStatus(req.params.id, req.body.status);
    res.status(200).json(result);
  }),

  updateUserRole: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.updateUserRole(req.params.id, req.body.role);
    res.status(200).json(result);
  }),
};
