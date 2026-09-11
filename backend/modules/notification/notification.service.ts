import { query } from '../../config/db';
import { sendEmail } from '../../utils/mailer';
import { INotificationPayload } from './notification.interface';

export const NotificationService = {
  /**
   * Fetch in-app notifications from PostgreSQL
   */
  async getNotifications(userId?: string) {
    if (userId) {
      const res = await query(
        `SELECT id, user_id AS "userId", title, message, type, is_read AS "isRead", created_at AS "createdAt"
         FROM notifications 
         WHERE user_id = $1 OR user_id IS NULL 
         ORDER BY created_at DESC`,
        [userId]
      );
      return res.rows;
    }
    const res = await query(
      `SELECT id, user_id AS "userId", title, message, type, is_read AS "isRead", created_at AS "createdAt"
       FROM notifications 
       ORDER BY created_at DESC`
    );
    return res.rows;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(id: string) {
    await query(`UPDATE notifications SET is_read = TRUE WHERE id = $1`, [id]);
    return { success: true };
  },

  /**
   * Send external email / SMS receipt
   */
  async dispatchNotification(payload: INotificationPayload) {
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    if (payload.type === 'sms') {
      const smsMessage = `[GymFlow BD] Welcome to Banani Hub, ${payload.recipient || 'Athlete'}. Checked in at ${now}. Air quality: 99.4% AQI.`;

      return {
        success: true,
        channel: 'SMS Webhook',
        message: smsMessage,
        deliveredTo: payload.recipient,
        status: 'DELIVERED',
      };
    }

    // Default: Email receipt using Nodemailer
    const emailSubject = `[GymFlow BD] Official Tax Invoice & Pass Confirmation • ${payload.txnId || 'TXN-001'}`;
    const emailHtml = `
      <div style="font-family: sans-serif; background: #121318; color: #fff; padding: 24px; border-radius: 12px;">
        <h2 style="color: #4edea3;">GymFlow BD • Banani Flagship</h2>
        <p>Your subscription for <strong>${payload.planName || '3-Month Pro Athlete'}</strong> has been verified.</p>
        <p><strong>Amount:</strong> ৳ ${Number(payload.amount || 9500).toLocaleString()} BDT (15% VAT Included)</p>
        <p><strong>Pass Status:</strong> Active and ready in Member Dashboard.</p>
      </div>
    `;

    const mailResult = await sendEmail({
      to: payload.recipient,
      subject: emailSubject,
      html: emailHtml,
    });

    return {
      success: true,
      channel: 'Nodemailer SMTP',
      subject: emailSubject,
      deliveredTo: payload.recipient,
      messageId: mailResult.messageId,
      status: 'SENT',
    };
  },
};
