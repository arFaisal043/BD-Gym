import { Request, Response } from 'express';
import { ChatService } from './chat.service';
import catchAsync from '../../utils/catchAsync';

export const ChatController = {
  chat: catchAsync(async (req: Request, res: Response) => {
    const { messages } = req.body;
    const reply = await ChatService.generateCoachResponse(messages || []);
    res.status(200).json({ reply });
  }),
};
