import crypto from 'crypto';
import { query } from '../../config/db';
import { AppError } from '../../utils/customError';
import { ICheckInPayload } from './attendance.interface';
import { sendEmail } from '../../utils/mailer';

export const AttendanceService = {
  async recordCheckIn(payload: ICheckInPayload) {
    let user: any = null;

    if (payload.userId) {
      const uRes = await query('SELECT * FROM users WHERE id = $1', [payload.userId]);
      user = uRes.rows[0];
    } else if (payload.rfidTag) {
      const uRes = await query('SELECT * FROM users WHERE rfid_tag = $1', [payload.rfidTag]);
      user = uRes.rows[0];
    }

    if (!user) {
      throw new AppError('Member or RFID Pass not recognized at turnstile', 404);
    }

    const attendanceId = crypto.randomUUID();
    const zone = payload.zone || 'Zone 01 • Heavy Olympic & Power Racks';

    const insertRes = await query(
      `INSERT INTO attendances (id, user_id, user_name, rfid_tag, zone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [attendanceId, user.id, user.name, user.rfid_tag, zone]
    );

    // Optional notification dispatch
    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: `[GymFlow BD] Turnstile Pass Verified • ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        html: `
          <div style="font-family: sans-serif; background: #121318; color: #fff; padding: 24px; border-radius: 12px;">
            <h3 style="color: #4edea3;">Welcome to GymFlow BD Banani</h3>
            <p>Hi ${user.name}, your RFID pass checked in at <strong>${zone}</strong>.</p>
            <p>Smart locker assigned: #B-14. Air Quality: Optimal (AQI 99.4%).</p>
          </div>
        `,
      });
    }

    return insertRes.rows[0];
  },

  async getMyAttendances(userId: string) {
    const res = await query(
      'SELECT * FROM attendances WHERE user_id = $1 ORDER BY check_in_time DESC LIMIT 20',
      [userId]
    );
    return res.rows;
  },

  async getAllAttendances() {
    const res = await query('SELECT * FROM attendances ORDER BY check_in_time DESC LIMIT 50');
    return res.rows;
  },

  async getFloorOccupancy() {
    // Calculate recent check-ins within last 3 hours
    const res = await query(`
      SELECT count(*) FROM attendances 
      WHERE check_in_time >= NOW() - INTERVAL '3 hours'
    `);
    const count = parseInt(res.rows[0].count, 10);
    const capacity = 85;
    const current = Math.min(capacity, Math.max(14, count + 18));
    return {
      currentOccupancy: current,
      capacity,
      percentage: Math.round((current / capacity) * 100),
      airQuality: '99.4% (HEPA H14 Filtered)',
      peakHours: '06:00 PM - 09:00 PM',
    };
  },
};
