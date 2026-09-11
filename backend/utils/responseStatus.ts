import { Response } from 'express';

export interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
  data?: T;
}

/**
 * Standardizes API responses across the entire application.
 */
export const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message || (data.success ? 'Success' : 'Failed'),
    meta: data.meta,
    data: data.data,
  });
};

export default sendResponse;
