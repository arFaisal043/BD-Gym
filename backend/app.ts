import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './routes';
import globalErrorHandler from './middlewares/globalErrorHandler';

const app: Application = express();

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'GymFlow BD Modular Backend',
    database: 'Neon PostgreSQL (Connected)',
  });
});

// Modular Routes (Thin Controller, Fat Service, DB Pool)
app.use('/api', router);
app.use('/api/v1', router);

// Centralized Global Error Handler Middleware
app.use(globalErrorHandler);

export default app;
