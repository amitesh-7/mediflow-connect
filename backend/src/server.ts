import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { authRoutes }          from './routes/auth';
import { dashboardRoutes }     from './routes/dashboard';
import { inventoryRoutes }     from './routes/inventory';
import { ordersRoutes }        from './routes/orders';
import { contactsRoutes }      from './routes/contacts';
import { messagesRoutes }      from './routes/messages';
import { profileRoutes }       from './routes/profile';
import { notificationsRoutes } from './routes/notifications';

const app = express();
const PORT = Number(process.env.PORT ?? 5000);

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
}));
app.use(express.json());

// ── Health check ────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// ── Root ────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    name: 'MediFlow Connect API',
    status: 'ok',
    version: '1.0.0',
    health: '/health',
    api: '/api/*',
    frontend: process.env.FRONTEND_URL || 'not configured',
  });
});

// ── API Routes ──────────────────────────────────────────────
// Public routes (no JWT required)
app.use('/api/auth',          authRoutes);

// Protected routes (JWT validated inside each router via requireAuth middleware)
app.use('/api/dashboard',     dashboardRoutes);
app.use('/api/inventory',     inventoryRoutes);
app.use('/api/orders',        ordersRoutes);
app.use('/api/contacts',      contactsRoutes);
app.use('/api/messages',      messagesRoutes);
app.use('/api/profile',       profileRoutes);
app.use('/api/notifications', notificationsRoutes);

// ── 404 handler ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[server error]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start (local dev only) ──────────────────────────────────
// Vercel sets VERCEL=1; in that environment we just export the app
// and Vercel's serverless runtime invokes it per request.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[ok]  MediFlow backend -> http://localhost:${PORT}`);
  });
}

export default app;
