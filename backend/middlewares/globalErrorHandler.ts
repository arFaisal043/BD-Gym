import { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/customError';
import { config } from '../config';

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorSources: Array<{ path: string; message: string }> = [
    {
      path: '',
      message: err.message || 'Something went wrong',
    },
  ];

  // Specific handler for Neon / PostgreSQL unique violation
  if (err.code === '23505') {
    statusCode = 409;
    message = 'Duplicate key entry. Resource already exists.';
    errorSources = [{ path: err.detail || '', message }];
  }

  // Specific handler for JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token. Please log in again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired. Please log in again.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.env === 'development' ? err.stack : undefined,
  });
};

export default globalErrorHandler;
