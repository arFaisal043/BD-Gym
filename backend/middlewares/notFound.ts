import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: [${req.method}] ${req.originalUrl}`,
    errorSources: [
      {
        path: req.originalUrl,
        message: 'Endpoint does not exist',
      },
    ],
  });
};

export default notFound;
