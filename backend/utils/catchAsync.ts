import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Higher-order function to eliminate repetitive try-catch blocks in controllers (DRY principle).
 */
export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync;
