import { Router } from 'express';
import { ChatController } from './chat.controller';

const router = Router();

router.post('/', ChatController.chat);
router.post('/message', ChatController.chat);

export const ChatRoutes = router;
