import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import app from './app';
import { initDB } from './config/db';

const PORT = 3000;

async function startServer() {
  try {
    // 1. Initialize Relational Database Schema & Seed Baseline Data
    console.log('[Server] Connecting to PostgreSQL database...');
    await initDB();

    // 2. Vite Middleware for Development / Static Serving for Production
    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    // 3. Start Server on port 3000
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[GymFlow BD] Production-grade full-stack server running on http://0.0.0.0:${PORT}`);
    });
  } catch (error: any) {
    console.error('[Server Startup Error]:', error);
    process.exit(1);
  }
}

startServer();
