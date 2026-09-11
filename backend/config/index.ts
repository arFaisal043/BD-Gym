import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_li2q4tHohBTn@ep-delicate-brook-ay5lc66b-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  jwt: {
    secret: process.env.JWT_SECRET || 'a3fb1b564e85968dfe5b357870fff379a79c8f0cdbf9a164a050405b2a9cad79',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'GymFlow BD <notifications@gymflow.bd>',
  },
  geminiApiKey: process.env.GEMINI_API_KEY || '',
};
