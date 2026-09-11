import { Router } from 'express';
import { AttendanceController } from './attendance.controller';
import { auth } from '../../middlewares/auth';

const router = Router();

router.post('/checkin', auth(), AttendanceController.checkIn);
router.get('/my', auth(), AttendanceController.getMyAttendances);
router.get('/occupancy', AttendanceController.getOccupancy);
router.get('/all', auth('admin', 'staff'), AttendanceController.getAllAttendances);

export const AttendanceRoutes = router;
