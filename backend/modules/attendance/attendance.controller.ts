import { Request, Response } from 'express';
import { AttendanceService } from './attendance.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/responseStatus';

export const AttendanceController = {
  checkIn: catchAsync(async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
      userId: req.user?.id || req.body.userId,
    };
    const result = await AttendanceService.recordCheckIn(payload);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Turnstile access granted',
      data: result,
    });
  }),

  getMyAttendances: catchAsync(async (req: Request, res: Response) => {
    const result = await AttendanceService.getMyAttendances(req.user!.id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Attendance history retrieved successfully',
      data: result,
    });
  }),

  getAllAttendances: catchAsync(async (req: Request, res: Response) => {
    const result = await AttendanceService.getAllAttendances();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'All attendances retrieved successfully',
      data: result,
    });
  }),

  getOccupancy: catchAsync(async (req: Request, res: Response) => {
    const result = await AttendanceService.getFloorOccupancy();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Floor occupancy status retrieved',
      data: result,
    });
  }),
};
