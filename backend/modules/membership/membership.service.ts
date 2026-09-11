import { query } from '../../config/db';
import { AppError } from '../../utils/customError';

export const MembershipService = {
  /**
   * Get all active membership plans
   */
  async getAllPlans() {
    const res = await query(`
      SELECT 
        id, 
        name, 
        description, 
        price::numeric::float AS price, 
        duration_days AS "durationDays", 
        interval_label AS "intervalLabel", 
        badge, 
        is_popular AS "isPopular", 
        features, 
        unavailable_features AS "unavailableFeatures", 
        is_active AS "isActive", 
        created_at AS "createdAt"
      FROM membership_plans
      ORDER BY price ASC
    `);
    return res.rows;
  },

  /**
   * Get all memberships for a specific user
   */
  async getMyMemberships(userId: string) {
    const res = await query(
      `SELECT 
        id,
        user_id AS "userId",
        plan_id AS "planId",
        plan_name AS "planName",
        status,
        start_date AS "startDate",
        end_date AS "endDate",
        auto_renew AS "autoRenew",
        price::numeric::float AS price,
        days_remaining AS "daysRemaining",
        benefits,
        created_at AS "createdAt"
      FROM memberships
      WHERE user_id = $1
      ORDER BY created_at DESC`,
      [userId]
    );

    const memberships = res.rows.map((m) => {
      // Calculate dynamic days remaining if active
      if (m.status === 'ACTIVE' && m.endDate) {
        const diffMs = new Date(m.endDate).getTime() - Date.now();
        m.daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      }
      return m;
    });

    const activeMembership = memberships.find((m) => m.status === 'ACTIVE' || m.status === 'PAUSED') || null;

    return {
      memberships,
      activeMembership,
    };
  },

  /**
   * Toggle pause / freeze status for a membership
   */
  async togglePause(membershipId: string, userId: string) {
    const memRes = await query(
      `SELECT id, status, plan_name FROM memberships WHERE id = $1 AND user_id = $2`,
      [membershipId, userId]
    );

    if (memRes.rows.length === 0) {
      throw new AppError('Membership not found', 404);
    }

    const current = memRes.rows[0];
    const newStatus = current.status === 'PAUSED' ? 'ACTIVE' : 'PAUSED';

    const updateRes = await query(
      `UPDATE memberships 
       SET status = $1 
       WHERE id = $2 
       RETURNING 
        id,
        user_id AS "userId",
        plan_id AS "planId",
        plan_name AS "planName",
        status,
        start_date AS "startDate",
        end_date AS "endDate",
        auto_renew AS "autoRenew",
        price::numeric::float AS price,
        days_remaining AS "daysRemaining",
        benefits,
        created_at AS "createdAt"`,
      [newStatus, membershipId]
    );

    // Create notification
    await query(
      `INSERT INTO notifications (id, user_id, title, message, type)
       VALUES ($1, $2, $3, $4, 'MEMBERSHIP')`,
      [
        `notif_${Date.now()}`,
        userId,
        newStatus === 'PAUSED' ? 'Membership Freeze Initiated' : 'Membership Resumed',
        newStatus === 'PAUSED'
          ? `Your ${current.plan_name} subscription has been temporarily frozen. Days remaining will remain preserved until you reactivate.`
          : `Welcome back! Your ${current.plan_name} subscription has resumed active status at Banani Flagship.`,
      ]
    );

    return {
      success: true,
      membership: updateRes.rows[0],
    };
  },

  /**
   * Get all memberships for admin
   */
  async getAllMemberships() {
    const res = await query(`
      SELECT 
        m.id,
        m.user_id AS "userId",
        u.name AS "userName",
        u.email AS "userEmail",
        m.plan_id AS "planId",
        m.plan_name AS "planName",
        m.status,
        m.start_date AS "startDate",
        m.end_date AS "endDate",
        m.auto_renew AS "autoRenew",
        m.price::numeric::float AS price,
        m.days_remaining AS "daysRemaining",
        m.benefits,
        m.created_at AS "createdAt"
      FROM memberships m
      LEFT JOIN users u ON m.user_id = u.id
      ORDER BY m.created_at DESC
    `);
    return res.rows;
  },
};
