import { Request, Response } from 'express';
import { ContentService } from './content.service';
import catchAsync from '../../utils/catchAsync';
import { sessionStore } from '../../utils/session';

export const ContentController = {
  getTrainers: catchAsync(async (_req: Request, res: Response) => {
    const trainers = await ContentService.getTrainers();
    res.status(200).json({ trainers });
  }),

  addTrainer: catchAsync(async (req: Request, res: Response) => {
    const trainer = await ContentService.addTrainer(req.body);
    res.status(201).json({ success: true, trainer });
  }),

  bookTrainer: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id || sessionStore.getUserId() || 'usr_member_1';
    const result = await ContentService.bookTrainerSession(req.params.id, userId, req.body.preferredTime);
    res.status(200).json(result);
  }),

  getFacilities: catchAsync(async (_req: Request, res: Response) => {
    const facilities = await ContentService.getFacilities();
    res.status(200).json({ facilities });
  }),

  getFaqs: catchAsync(async (_req: Request, res: Response) => {
    const faqs = await ContentService.getFaqs();
    res.status(200).json({ faqs });
  }),

  saveInquiry: catchAsync(async (req: Request, res: Response) => {
    const result = await ContentService.saveInquiry(req.body);
    res.status(200).json(result);
  }),

  getSensors: catchAsync(async (_req: Request, res: Response) => {
    const stats = ContentService.getGymSensors();
    res.status(200).json({ stats });
  }),
};
