import { pool } from './db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const seedDB = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    // 1. Check if any users exist
    const userCount = await client.query('SELECT count(*) FROM users');
    
    if (parseInt(userCount.rows[0].count, 10) === 0) {
      console.log('[Seed] Database is empty. Creating initial admin user...');
      
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@gymflow.bd';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const defaultPasswordHash = bcrypt.hashSync(adminPassword, 10);
      
      await client.query(`
        INSERT INTO users (id, name, email, phone, password, role, status)
        VALUES ($1, $2, $3, $4, $5, 'ADMIN', 'ACTIVE')
      `, [
        crypto.randomUUID(),
        'System Administrator',
        adminEmail,
        '+880 1700-000000',
        defaultPasswordHash
      ]);
      
      console.log(`[Seed] Initial admin created: ${adminEmail}`);
    } else {
      console.log('[Seed] Users already exist. Skipping user seed.');
    }

    // 2. Seed Testimonials
    const testCount = await client.query('SELECT count(*) FROM testimonials');
    if (parseInt(testCount.rows[0].count, 10) === 0) {
      console.log('[Seed] Seeding initial testimonials...');
      await client.query(`
        INSERT INTO testimonials (id, name, role, content, rating, initials, theme_color)
        VALUES 
        ($1, 'Shakib Hossain', 'Corporate Tech Lead • Member since 2023', 'GymFlow BD completely altered my schedule in Banani. Paying through bKash took 15 seconds, and scanning in with the app QR code before my morning meetings is as seamless as Singapore gyms.', 5, 'SH', 'emerald'),
        ($2, 'Rashed Al-Mamun', 'Competitive Powerlifter • Pro Tier Member', 'The powerlifting zone has true Olympic Eleiko bars that never wobble. Coach Tanvir dialed in my bench technique and added 25kg in just two months. The recovery steam suite is top-tier.', 5, 'RA', 'cyan')
      `, [crypto.randomUUID(), crypto.randomUUID()]);
      console.log('[Seed] Testimonials seeded successfully.');
    } else {
      console.log('[Seed] Testimonials already exist. Skipping testimonial seed.');
    }
  } catch (error) {
    console.error('[Seed Error]:', error);
  } finally {
    client.release();
  }
};
