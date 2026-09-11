import crypto from 'crypto';
import { query } from '../../config/db';
import { AppError } from '../../utils/customError';

export const PaymentService = {
  /**
   * Initialize a simulated SSLCOMMERZ payment transaction session
   */
  async createPaymentSession(payload: {
    userId: string;
    planId: string;
    paymentMethod?: string;
    customerName?: string;
  }) {
    const { userId, planId, paymentMethod = 'bKash', customerName } = payload;

    // Get user
    const userRes = await query('SELECT id, name, email, phone FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0) {
      throw new AppError('User not found', 404);
    }
    const user = userRes.rows[0];

    // Get plan
    const planRes = await query(
      'SELECT id, name, price::numeric::float AS price, duration_days FROM membership_plans WHERE id = $1',
      [planId]
    );
    if (planRes.rows.length === 0) {
      throw new AppError('Membership plan not found', 404);
    }
    const plan = planRes.rows[0];

    const transactionId = `SSL-TXN-${Date.now().toString().slice(-9)}`;
    const paymentId = crypto.randomUUID();
    const membershipId = crypto.randomUUID();

    // Insert pending payment into PostgreSQL
    const payRes = await query(
      `INSERT INTO payments (
        id, user_id, user_name, user_email, membership_id, plan_id, plan_name,
        transaction_id, amount, currency, payment_method, status, gateway_response
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'BDT', $10, 'PENDING', $11)
      RETURNING 
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
        created_at AS "createdAt"`,
      [
        paymentId,
        user.id,
        customerName || user.name,
        user.email,
        membershipId,
        plan.id,
        plan.name,
        transactionId,
        plan.price,
        paymentMethod,
        'SSLCOMMERZ SESSION CREATED. AWAITING USER PIN/OTP VERIFICATION',
      ]
    );

    const pendingPayment = payRes.rows[0];

    return {
      success: true,
      payment: pendingPayment,
      sslcommerz: {
        sessionKey: `SSL_SESSION_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        gatewayUrl: `/checkout/gateway?tran_id=${transactionId}`,
        transactionId,
        amount: plan.price,
        currency: 'BDT',
        storeName: 'GymFlow BD Flagship Banani',
      },
    };
  },

  /**
   * Verify SSLCOMMERZ transaction and activate membership
   */
  async verifyPayment(payload: {
    transactionId: string;
    simulationSuccess?: boolean;
    gatewayRef?: string;
  }) {
    const { transactionId, simulationSuccess = true, gatewayRef } = payload;

    const payRes = await query(
      `SELECT 
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
        status
       FROM payments WHERE transaction_id = $1`,
      [transactionId]
    );

    if (payRes.rows.length === 0) {
      throw new AppError('Transaction record not found', 404);
    }

    const payment = payRes.rows[0];

    if (payment.status === 'SUCCESS') {
      return { success: true, message: 'Payment already verified', payment };
    }

    if (!simulationSuccess) {
      await query(
        `UPDATE payments SET status = 'FAILED', gateway_response = 'SSLCOMMERZ ERROR: DECLINED_OR_TIMEOUT' WHERE id = $1`,
        [payment.id]
      );
      throw new AppError('Payment declined by payment gateway', 400);
    }

    // 1. Mark payment verified in PostgreSQL
    const updatedPayRes = await query(
      `UPDATE payments 
       SET 
        status = 'SUCCESS', 
        verified_at = NOW(), 
        gateway_response = $1 
       WHERE id = $2
       RETURNING 
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
        verified_at AS "verifiedAt"`,
      [`SSLCOMMERZ VERIFIED [IPN_SUCCESS]. GATEWAY_REF: ${gatewayRef || 'BKSH_AUTH_' + Date.now()}`, payment.id]
    );

    const verifiedPayment = updatedPayRes.rows[0];

    // 2. Fetch Plan details for duration
    const planRes = await query(
      'SELECT id, name, duration_days, features FROM membership_plans WHERE id = $1',
      [payment.planId]
    );
    const plan = planRes.rows[0];
    const durationDays = plan?.duration_days || 30;

    // 3. Expire previous active memberships for this user
    await query(
      `UPDATE memberships SET status = 'EXPIRED' WHERE user_id = $1 AND status = 'ACTIVE'`,
      [payment.userId]
    );

    // 4. Activate new membership in PostgreSQL
    const benefits = plan?.features || [
      'Full gym floor and cardio access',
      'Standard day locker and shower suites',
      'Mobile digital membership pass',
    ];

    const memRes = await query(
      `INSERT INTO memberships (
        id, user_id, plan_id, plan_name, status, start_date, end_date, auto_renew, price, days_remaining, benefits
      ) VALUES ($1, $2, $3, $4, 'ACTIVE', NOW(), NOW() + ($5 || ' days')::interval, TRUE, $6, $7, $8)
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
      [
        payment.membershipId || crypto.randomUUID(),
        payment.userId,
        payment.planId,
        payment.planName,
        durationDays,
        payment.amount,
        durationDays,
        benefits,
      ]
    );

    const newMembership = memRes.rows[0];

    // 5. Create notification in PostgreSQL
    await query(
      `INSERT INTO notifications (id, user_id, title, message, type)
       VALUES ($1, $2, $3, $4, 'PAYMENT')`,
      [
        crypto.randomUUID(),
        payment.userId,
        `Membership Activated: ${payment.planName}`,
        `৳ ${Number(payment.amount).toLocaleString()} confirmed via ${payment.paymentMethod}. Your membership pass is active at Banani Flagship.`,
      ]
    );

    return {
      success: true,
      message: 'SSLCOMMERZ Payment verified and membership activated successfully',
      payment: verifiedPayment,
      membership: newMembership,
    };
  },

  /**
   * Get payments for authenticated member
   */
  async getMyPayments(userId: string) {
    const res = await query(
      `SELECT 
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
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );
    return res.rows;
  },

  /**
   * Get all payments for admin
   */
  async getAllPayments() {
    const res = await query(`
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
    `);
    return res.rows;
  },

  /**
   * Refund payment for admin
   */
  async refundPayment(paymentId: string) {
    const res = await query(
      `UPDATE payments 
       SET status = 'REFUNDED', gateway_response = 'ADMIN AUTHORIZED FULL REFUND VIA SSLCOMMERZ BDT'
       WHERE id = $1
       RETURNING 
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
        created_at AS "createdAt"`,
      [paymentId]
    );

    if (res.rows.length === 0) {
      throw new AppError('Payment not found', 404);
    }

    const refunded = res.rows[0];

    // Mark associated membership cancelled
    if (refunded.membershipId) {
      await query(`UPDATE memberships SET status = 'CANCELLED' WHERE id = $1`, [refunded.membershipId]);
    }

    return { success: true, payment: refunded };
  },
};
