import { Router } from 'express';
import { ContentController } from './content.controller';

const router = Router();

// Trainer routes
router.get('/trainers', ContentController.getTrainers);
router.post('/trainers', ContentController.addTrainer);
router.post('/trainers/:id/book', ContentController.bookTrainer);
router.post('/trainers/:id/book-induction', ContentController.bookTrainer);

// Facilities and FAQs
router.get('/facilities', ContentController.getFacilities);
router.get('/faqs', ContentController.getFaqs);

// Inquiries
router.post('/contact', ContentController.saveInquiry);
router.post('/contact/inquiry', ContentController.saveInquiry);

// Sensor metrics
router.get('/gym-sensor', ContentController.getSensors);
router.get('/metrics/live', ContentController.getSensors);

export const ContentRoutes = router;
