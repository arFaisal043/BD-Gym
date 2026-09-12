import crypto from 'crypto';
import { query } from '../../config/db';
import { AppError } from '../../utils/customError';

export const ContentService = {
  /**
   * Get all trainers from PostgreSQL
   */
  async getTrainers() {
    const res = await query(`
      SELECT 
        id, 
        name, 
        image, 
        specialization, 
        badge, 
        experience, 
        certifications, 
        bio, 
        athletes_mentored AS "athletesMentored", 
        is_active AS "isActive", 
        rating::numeric::float AS rating, 
        schedule
      FROM trainers 
      WHERE is_active = TRUE 
      ORDER BY id ASC
    `);
    return res.rows;
  },

  /**
   * Add a new trainer (admin)
   */
  async addTrainer(data: any) {
    const id = crypto.randomUUID();
    const res = await query(
      `INSERT INTO trainers (id, name, image, specialization, badge, experience, certifications, bio, athletes_mentored, is_active, rating, schedule)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE, 4.90, $10)
       RETURNING 
        id, name, image, specialization, badge, experience, certifications, bio, 
        athletes_mentored AS "athletesMentored", is_active AS "isActive", rating::numeric::float AS rating, schedule`,
      [
        id,
        data.name || 'New Coach',
        data.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        data.specialization || 'Strength & Conditioning',
        data.badge || 'Certified Coach',
        data.experience || '5+ Yrs Exp',
        data.certifications || ['Certified Personal Trainer'],
        data.bio || 'Dedicated coach at GymFlow BD.',
        Number(data.athletesMentored) || 50,
        data.schedule || ['Mon to Fri (7:00 AM - 12:00 PM)'],
      ]
    );
    return res.rows[0];
  },

  /**
   * Book a trainer induction session
   */
  async bookTrainerSession(trainerId: string, userId: string, preferredTime?: string) {
    const trainerRes = await query('SELECT id, name FROM trainers WHERE id = $1', [trainerId]);
    if (trainerRes.rows.length === 0) {
      throw new AppError('Trainer not found', 404);
    }
    const trainer = trainerRes.rows[0];

    // Create notification for member
    await query(
      `INSERT INTO notifications (id, user_id, title, message, type)
       VALUES ($1, $2, $3, $4, 'SYSTEM')`,
      [
        crypto.randomUUID(),
        userId,
        `Induction Booked with ${trainer.name}`,
        `Your 1-on-1 coaching assessment is scheduled for ${preferredTime || 'tomorrow at 10:00 AM'} at the Banani Flagship Hub.`,
      ]
    );

    return {
      success: true,
      message: `Induction booked with ${trainer.name}! Our desk team will confirm your slot.`,
    };
  },

  /**
   * Get all facilities
   */
  async getFacilities() {
    const res = await query(`
      SELECT 
        id, 
        name, 
        zone_code AS "zoneCode", 
        tag, 
        floor, 
        category, 
        description, 
        image, 
        features, 
        equipment_list AS "equipmentList", 
        is_active AS "isActive"
      FROM facilities 
      WHERE is_active = TRUE 
      ORDER BY floor ASC, id ASC
    `);
    return res.rows;
  },

  /**
   * Get all FAQs
   */
  async getFaqs() {
    const res = await query('SELECT id, question, answer, category FROM faqs ORDER BY id ASC');
    return res.rows;
  },

  /**
   * Record contact inquiry in PostgreSQL
   */
  async saveInquiry(payload: { name: string; phone: string; email: string; message: string }) {
    const id = crypto.randomUUID();
    await query(
      `INSERT INTO inquiries (id, name, phone, email, message)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, payload.name || 'Guest', payload.phone || '', payload.email || '', payload.message || '']
    );
    return {
      success: true,
      message: 'Inquiry received. Our Banani front desk team will contact you shortly.',
    };
  },

  /**
   * Live facility sensors telemetry
   */
  async getGymSensors() {
    const activeMembersRes = await query("SELECT count(*) AS total FROM memberships WHERE status = 'ACTIVE'");
    const totalUsersRes = await query('SELECT count(*) AS total FROM users');
    const trainersRes = await query("SELECT count(*) AS total FROM trainers WHERE is_active = TRUE");

    return {
      occupancyRate: 63, // Simulated for now since no IoT hardware
      activeRfidAthletes: parseInt(activeMembersRes.rows[0].total, 10),
      aqiPercentage: 99.4, // Simulated
      totalMembers: parseInt(totalUsersRes.rows[0].total, 10),
      certifiedCoaches: parseInt(trainersRes.rows[0].total, 10),
      floorAreaSqFt: 15000,
      operatingHours: '6:00 AM – 11:00 PM',
    };
  },

  /**
   * Get all testimonials
   */
  async getTestimonials() {
    const res = await query('SELECT id, name, role, content, rating, initials, theme_color AS "themeColor", created_at AS "createdAt" FROM testimonials ORDER BY created_at ASC');
    return res.rows;
  },
};
