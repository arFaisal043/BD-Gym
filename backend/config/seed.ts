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
      console.log('[Seed] Users already exist. Skipping seed.');
    }
  } catch (error) {
    console.error('[Seed Error]:', error);
  } finally {
    client.release();
  }
};
