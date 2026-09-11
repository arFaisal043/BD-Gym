import { query } from '../../config/db';
import { AppError } from '../../utils/customError';

export const UserService = {
  async getAllUsers() {
    const res = await query(
      `SELECT id, name, email, phone, role, status, profile_image AS "profileImage", address, bio, emergency_contact AS "emergencyContact", created_at AS "createdAt"
       FROM users ORDER BY created_at DESC`
    );
    return res.rows;
  },

  async getUserById(id: string) {
    const res = await query(
      `SELECT id, name, email, phone, role, status, profile_image AS "profileImage", address, bio, emergency_contact AS "emergencyContact", created_at AS "createdAt"
       FROM users WHERE id = $1`,
      [id]
    );
    if (res.rows.length === 0) {
      throw new AppError('User not found', 404);
    }
    return res.rows[0];
  },

  async updateProfile(userId: string, payload: { name?: string; phone?: string; address?: string; bio?: string; emergencyContact?: string; profileImage?: string }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (payload.name !== undefined) {
      values.push(payload.name);
      fields.push(`name = $${values.length}`);
    }
    if (payload.phone !== undefined) {
      values.push(payload.phone);
      fields.push(`phone = $${values.length}`);
    }
    if (payload.address !== undefined) {
      values.push(payload.address);
      fields.push(`address = $${values.length}`);
    }
    if (payload.bio !== undefined) {
      values.push(payload.bio);
      fields.push(`bio = $${values.length}`);
    }
    if (payload.emergencyContact !== undefined) {
      values.push(payload.emergencyContact);
      fields.push(`emergency_contact = $${values.length}`);
    }
    if (payload.profileImage !== undefined) {
      values.push(payload.profileImage);
      fields.push(`profile_image = $${values.length}`);
    }

    if (fields.length === 0) {
      const u = await this.getUserById(userId);
      return { success: true, user: u };
    }

    values.push(userId);
    const sql = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${values.length} 
                 RETURNING id, name, email, phone, role, status, profile_image AS "profileImage", address, bio, emergency_contact AS "emergencyContact", created_at AS "createdAt"`;
    const res = await query(sql, values);
    return { success: true, user: res.rows[0] };
  },

  async updateUserStatus(userId: string, status: string) {
    const res = await query(
      `UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2 
       RETURNING id, name, email, phone, role, status, profile_image AS "profileImage", address, bio, emergency_contact AS "emergencyContact"`,
      [status.toUpperCase(), userId]
    );
    if (res.rows.length === 0) {
      throw new AppError('User not found', 404);
    }
    return { success: true, user: res.rows[0] };
  },

  async updateUserRole(userId: string, role: string) {
    const res = await query(
      `UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 
       RETURNING id, name, email, phone, role, status, profile_image AS "profileImage", address, bio, emergency_contact AS "emergencyContact"`,
      [role.toUpperCase(), userId]
    );
    if (res.rows.length === 0) {
      throw new AppError('User not found', 404);
    }
    return { success: true, user: res.rows[0] };
  },
};
