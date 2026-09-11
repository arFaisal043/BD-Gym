import { Request, Response } from 'express';
import { MembershipService } from './membership.service';
import catchAsync from '../../utils/catchAsync';
import { sessionStore } from '../../utils/session';

export const MembershipController = {
  getPlans: catchAsync(async (_req: Request, res: Response) => {
    const plans = await MembershipService.getAllPlans();
    res.status(200).json({ plans });
  }),

  getMyMemberships: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id || sessionStore.getUserId();
    if (!userId) {
      return res.status(200).json({ memberships: [], activeMembership: null });
    }
    const result = await MembershipService.getMyMemberships(userId);
    res.status(200).json(result);
  }),

  togglePause: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id || sessionStore.getUserId();
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const result = await MembershipService.togglePause(req.params.id, userId);
    res.status(200).json(result);
  }),

  getAllMemberships: catchAsync(async (_req: Request, res: Response) => {
    const memberships = await MembershipService.getAllMemberships();
    res.status(200).json({ memberships });
  }),
};
