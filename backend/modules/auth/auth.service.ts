import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { query } from '../../config/db';
import { config } from '../../config';
import { signToken } from '../../utils/jwt';
import { AppError } from '../../utils/customError';
import { sessionStore } from '../../utils/session';

export const AuthService = {
  /**
   * Register a new member in PostgreSQL
   */
  async register(payload: { name: string; email: string; phone: string; password: string }) {
    const { name, email, phone, password } = payload;
    if (!name || !email || !phone || !password) {
      throw new AppError('All registration fields are required', 400);
    }

    const existing = await query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()]);
    if (existing.rows.length > 0) {
      throw new AppError('An account with this email already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(password, config.bcryptSaltRounds);
    const userId = crypto.randomUUID();
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

    const insertRes = await query(
      `INSERT INTO users (id, name, email, phone, password, role, status, profile_image, address, bio, emergency_contact)
       VALUES ($1, $2, $3, $4, $5, 'USER', 'ACTIVE', $6, 'Banani, Dhaka', 'GymFlow BD Member', '+880 1711-998877')
       RETURNING id, name, email, phone, role, status, profile_image AS "profileImage", address, bio, emergency_contact AS "emergencyContact", created_at AS "createdAt"`,
      [userId, name.trim(), email.trim().toLowerCase(), phone.trim(), hashedPassword, avatar]
    );

    const user = insertRes.rows[0];
    sessionStore.setUserId(user.id);

    // Add welcome notification
    await query(
      `INSERT INTO notifications (id, user_id, title, message, type, is_read)
       VALUES ($1, $2, $3, $4, $5, FALSE)`,
      [
        crypto.randomUUID(),
        user.id,
        'Welcome to GymFlow BD!',
        'Your membership account is now ready. Select a plan to begin your athletic journey at Banani Flagship.',
        'SYSTEM',
      ]
    );

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return { success: true, user, token };
  },

  /**
   * User login with PostgreSQL lookup
   */
  async login(payload: { email: string; password: string }) {
    const { email, password } = payload;
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const res = await query(
      `SELECT id, name, email, phone, password, role, status, profile_image AS "profileImage", address, bio, emergency_contact AS "emergencyContact", created_at AS "createdAt" 
       FROM users WHERE LOWER(email) = LOWER($1)`,
      [email.trim()]
    );

    if (res.rows.length === 0) {
      throw new AppError('Invalid email or password', 401);
    }

    const user = res.rows[0];

    let isMatch = false;
    if (user.password) {
      try {
        isMatch = await bcrypt.compare(password, user.password);
      } catch (err) {
        isMatch = false;
      }
    }

    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    sessionStore.setUserId(user.id);

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Strip password from returned user object
    const { password: _, ...userSafe } = user;
    return { success: true, user: userSafe, token };
  },

  /**
   * Get current authenticated user profile
   */
  async getMe(userId: string) {
    const res = await query(
      `SELECT id, name, email, phone, role, status, profile_image AS "profileImage", address, bio, emergency_contact AS "emergencyContact", created_at AS "createdAt"
       FROM users WHERE id = $1`,
      [userId]
    );

    if (res.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    return { user: res.rows[0] };
  },

  /**
   * Switch persona (convenience helper for demo / testing)
   */
  async switchPersona(userId: string) {
    const res = await query(
      `SELECT id, name, email, phone, role, status, profile_image AS "profileImage", address, bio, emergency_contact AS "emergencyContact", created_at AS "createdAt"
       FROM users WHERE id = $1`,
      [userId]
    );

    if (res.rows.length === 0) {
      throw new AppError('Target persona user not found', 404);
    }

    const user = res.rows[0];
    sessionStore.setUserId(user.id);

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return { success: true, user, token };
  },

  /**
   * Log out current session
   */
  async logout() {
    sessionStore.clear();
    return { success: true, message: 'Logged out successfully' };
  },
};
