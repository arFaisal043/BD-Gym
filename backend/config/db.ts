import pg from 'pg';
import { config } from './index';
import { seedDB } from './seed';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('[PostgreSQL Pool Error]:', err.message);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

/**
 * Initializes database schemas if they do not already exist.
 * Runs on server start to guarantee relational integrity.
 */
export const initDB = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log('[Neon PostgreSQL] Database connected successfully.');

    // 1. Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'USER',
        status VARCHAR(50) DEFAULT 'ACTIVE',
        profile_image TEXT,
        address TEXT,
        bio TEXT,
        emergency_contact VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(50);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image TEXT;
    `);

    // 2. Membership plans table
    await client.query(`
      CREATE TABLE IF NOT EXISTS membership_plans (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        duration_months INT DEFAULT 1,
        duration_days INT DEFAULT 30,
        price NUMERIC(10, 2) NOT NULL,
        interval_label VARCHAR(50) DEFAULT '/ month',
        badge VARCHAR(100),
        is_popular BOOLEAN DEFAULT FALSE,
        features TEXT[],
        unavailable_features TEXT[],
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      ALTER TABLE membership_plans ADD COLUMN IF NOT EXISTS description TEXT;
      ALTER TABLE membership_plans ADD COLUMN IF NOT EXISTS duration_days INT DEFAULT 30;
      ALTER TABLE membership_plans ADD COLUMN IF NOT EXISTS interval_label VARCHAR(50) DEFAULT '/ month';
      ALTER TABLE membership_plans ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT FALSE;
      ALTER TABLE membership_plans ADD COLUMN IF NOT EXISTS unavailable_features TEXT[];
      ALTER TABLE membership_plans ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    `);

    // 3. Memberships table
    await client.query(`
      CREATE TABLE IF NOT EXISTS memberships (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        plan_id VARCHAR(64),
        plan_name VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'ACTIVE',
        start_date TIMESTAMP WITH TIME ZONE NOT NULL,
        end_date TIMESTAMP WITH TIME ZONE NOT NULL,
        auto_renew BOOLEAN DEFAULT TRUE,
        price NUMERIC(10, 2) NOT NULL,
        days_remaining INT DEFAULT 30,
        benefits TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      ALTER TABLE memberships ADD COLUMN IF NOT EXISTS days_remaining INT DEFAULT 30;
      ALTER TABLE memberships ADD COLUMN IF NOT EXISTS benefits TEXT[];
    `);

    // 4. Attendances / Check-ins table
    await client.query(`
      CREATE TABLE IF NOT EXISTS attendances (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
        user_name VARCHAR(255),
        rfid_tag VARCHAR(100),
        zone VARCHAR(100) DEFAULT 'Main Gym Floor',
        check_in_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Invoices & Payments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        user_name VARCHAR(255),
        user_email VARCHAR(255),
        membership_id VARCHAR(64),
        plan_id VARCHAR(64),
        plan_name VARCHAR(255),
        transaction_id VARCHAR(100) UNIQUE NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'BDT',
        payment_method VARCHAR(50) DEFAULT 'bKash',
        status VARCHAR(50) DEFAULT 'SUCCESS',
        gateway_response TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        verified_at TIMESTAMP WITH TIME ZONE
      );
      ALTER TABLE payments ADD COLUMN IF NOT EXISTS user_name VARCHAR(255);
      ALTER TABLE payments ADD COLUMN IF NOT EXISTS user_email VARCHAR(255);
      ALTER TABLE payments ADD COLUMN IF NOT EXISTS membership_id VARCHAR(64);
      ALTER TABLE payments ADD COLUMN IF NOT EXISTS plan_id VARCHAR(64);
      ALTER TABLE payments ADD COLUMN IF NOT EXISTS gateway_response TEXT;
      ALTER TABLE payments ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;
    `);

    // 6. Notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'SYSTEM',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. Inquiries table
    await client.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 8. Trainers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS trainers (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image TEXT,
        specialization TEXT,
        badge VARCHAR(100),
        experience VARCHAR(50),
        certifications TEXT[],
        bio TEXT,
        athletes_mentored INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        rating NUMERIC(3, 2) DEFAULT 5.0,
        schedule TEXT[]
      );
    `);

    // 9. Facilities table
    await client.query(`
      CREATE TABLE IF NOT EXISTS facilities (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        zone_code VARCHAR(100),
        tag VARCHAR(50),
        floor INT DEFAULT 1,
        category VARCHAR(50),
        description TEXT,
        image TEXT,
        features TEXT[],
        equipment_list TEXT[],
        is_active BOOLEAN DEFAULT TRUE
      );
    `);

    // 10. FAQs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id VARCHAR(64) PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        category VARCHAR(50) DEFAULT 'membership'
      );
    `);

    client.release();
    console.log('[Neon PostgreSQL] All application tables initialized successfully.');

    // Seed baseline tables if empty
    await seedDB();
  } catch (error: any) {
    console.error('[Neon PostgreSQL Init Error]:', error.message);
  }
};
