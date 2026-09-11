import path from 'path';
import express from 'express';
import app from './app';
import { initDB } from './config/db';

const PORT = 3000;

async function startServer() {
  try {
    // 1. Initialize Relational Database Schema & Seed Baseline Data
    console.log('[Server] Connecting to PostgreSQL database...');
    await initDB();

    // 2. Static Serving for Production
    if (process.env.NODE_ENV === 'production') {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    // 3. Start Server on port 3000
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error: any) {
    console.error('[Server Startup Error]:', error);
    process.exit(1);
  }
}

startServer();
