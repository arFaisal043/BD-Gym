import { query } from '../../config/db';
import { AppError } from '../../utils/customError';

export const AdminService = {
  /**
   * Aggregate high-level executive KPIs and recent records from PostgreSQL
   */
  async getDashboard() {
    const revenueRes = await query(
      "SELECT COALESCE(SUM(amount), 0)::numeric::float AS total FROM payments WHERE status = 'SUCCESS'"
    );
    const usersCountRes = await query('SELECT count(*) AS total FROM users');
    const activeMemRes = await query("SELECT count(*) AS total FROM memberships WHERE status = 'ACTIVE'");
    const expiredMemRes = await query("SELECT count(*) AS total FROM memberships WHERE status = 'EXPIRED'");
    const pendingPayRes = await query("SELECT count(*) AS total FROM payments WHERE status = 'PENDING'");

    const recentPaymentsRes = await query(`
      SELECT 
        id, 
        user_id AS "userId", 
        user_name AS "userName", 
        user_email AS "userEmail", 
        membership_id AS "membershipId", 
        plan_id AS "planId", 
        plan_name AS "planName", 
        transaction_id AS "transactionId", 
        amount::numeric::float AS amount, 
        currency, 
        payment_method AS "paymentMethod", 
        status, 
        gateway_response AS "gatewayResponse", 
        created_at AS "createdAt",
        verified_at AS "verifiedAt"
      FROM payments 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    const recentMembersRes = await query(`
      SELECT 
        id, 
        name, 
        email, 
        phone, 
        role, 
        status, 
        profile_image AS "profileImage", 
        address, 
        bio, 
        emergency_contact AS "emergencyContact", 
        created_at AS "createdAt"
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    return {
      stats: {
        totalUsers: parseInt(usersCountRes.rows[0].total, 10),
        activeMembers: parseInt(activeMemRes.rows[0].total, 10),
        expiredMembers: parseInt(expiredMemRes.rows[0].total, 10),
        pendingPayments: parseInt(pendingPayRes.rows[0].total, 10),
        totalRevenueBDT: Number(revenueRes.rows[0].total),
        floorDensityPercent: 64,
        activeRfidBadges: 87,
        hvacAqi: 99.4,
      },
      recentPayments: recentPaymentsRes.rows,
      recentMembers: recentMembersRes.rows,
    };
  },

  /**
   * Get all users with their active membership status
   */
  async getUsers() {
    const usersRes = await query(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.phone, 
        u.role, 
        u.status, 
        u.profile_image AS "profileImage", 
        u.address, 
        u.bio, 
        u.emergency_contact AS "emergencyContact", 
        u.created_at AS "createdAt",
        (
          SELECT json_build_object(
            'id', m.id,
            'planName', m.plan_name,
            'status', m.status,
            'startDate', m.start_date,
            'endDate', m.end_date,
            'price', m.price
          )
          FROM memberships m
          WHERE m.user_id = u.id AND m.status = 'ACTIVE'
          ORDER BY m.created_at DESC
          LIMIT 1
        ) AS membership
      FROM users u
      ORDER BY u.created_at DESC
    `);
    return usersRes.rows;
  },

  /**
   * Update member status (ACTIVE / INACTIVE)
   */
  async updateUserStatus(userId: string, newStatus?: string) {
    const userRes = await query('SELECT id, status FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    const current = userRes.rows[0];
    const statusToSet = newStatus
      ? newStatus.toUpperCase()
      : current.status === 'ACTIVE'
      ? 'INACTIVE'
      : 'ACTIVE';

    const updateRes = await query(
      `UPDATE users 
       SET status = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING id, name, email, phone, role, status, profile_image AS "profileImage", address, bio, emergency_contact AS "emergencyContact"`,
      [statusToSet, userId]
    );

    return { success: true, user: updateRes.rows[0] };
  },

  /**
   * Update user role (ADMIN / USER)
   */
  async updateUserRole(userId: string, newRole: string) {
    const normalized = (newRole || '').toUpperCase();
    if (normalized !== 'ADMIN' && normalized !== 'USER' && normalized !== 'MEMBER') {
      throw new AppError('Invalid role. Must be ADMIN or USER', 400);
    }
    const roleToSet = normalized === 'ADMIN' ? 'ADMIN' : 'USER';

    const updateRes = await query(
      `UPDATE users 
       SET role = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING id, name, email, phone, role, status, profile_image AS "profileImage", address, bio, emergency_contact AS "emergencyContact"`,
      [roleToSet, userId]
    );

    if (updateRes.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    return { success: true, user: updateRes.rows[0] };
  },
};
