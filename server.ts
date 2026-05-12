import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';
import pool, { initDB } from './server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Environment Guards ──────────────────────────────────────────────────────
if (!process.env.JWT_SECRET) throw new Error('❌ JWT_SECRET must be set in .env');
if (!process.env.ADMIN_EMAIL) throw new Error('❌ ADMIN_EMAIL must be set in .env');

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const PORT = parseInt(process.env.PORT || '3000');
const IS_PROD = process.env.NODE_ENV === 'production';

// ── Rate Limiters ───────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many login attempts, please try again later.' },
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'API rate limit exceeded.' },
});

// ── CORS ────────────────────────────────────────────────────────────────────
// In production, only allow requests from your Netlify frontend URL.
// In dev, allow the Vite dev server.
const allowedOrigins = IS_PROD
  ? [process.env.FRONTEND_URL || ''].filter(Boolean)
  : ['http://localhost:5173', 'http://localhost:3000'];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
};

async function startServer() {
  const app = express();

  // ── Core Middleware ────────────────────────────────────────────────────────
  app.use(express.json({ limit: '10kb' }));
  app.use(morgan(IS_PROD ? 'combined' : 'dev'));
  app.use(cors(corsOptions));
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));

  // ── Audit Logger ───────────────────────────────────────────────────────────
  const logAction = async (
    userId: string | null,
    action: string,
    details: object,
    ip: string | undefined
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    try {
      await pool.query(
        'INSERT INTO audit_logs (id, user_id, action, details, ip_address) VALUES ($1,$2,$3,$4,$5)',
        [id, userId, action, JSON.stringify(details), ip]
      );
    } catch (e) {
      console.error('Logging failed:', e);
    }
  };

  // ── Auth: Register ─────────────────────────────────────────────────────────
  app.post('/api/auth/register', authLimiter, async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({ error: 'Invalid input. Password must be 8+ chars.' });
    }

    try {
      const hashedPassword = bcrypt.hashSync(password, 12);
      const id = Math.random().toString(36).substr(2, 9);
      const role = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user';

      await pool.query(
        'INSERT INTO users (id, name, email, password, role) VALUES ($1,$2,$3,$4,$5)',
        [id, name, email, hashedPassword, role]
      );

      await logAction(id, 'AUTH_REGISTER', { email, role }, req.ip);

      const token = jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '6h' });
      return res.status(201).json({ user: { id, name, email, role }, token });
    } catch (err: any) {
      // Postgres unique violation code
      if (err.code === '23505') {
        return res.status(400).json({ error: 'Email already registered.' });
      }
      console.error(err);
      return res.status(500).json({ error: 'Registration failed.' });
    }
  });

  // ── Auth: Login ────────────────────────────────────────────────────────────
  app.post('/api/auth/login', authLimiter, async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
      const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = rows[0];

      if (!user || !bcrypt.compareSync(password, user.password)) {
        await logAction(null, 'AUTH_LOGIN_FAILED', { email }, req.ip);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      await logAction(user.id, 'AUTH_LOGIN_SUCCESS', { email }, req.ip);

      // Always enforce admin role by email match
      const effectiveRole =
        email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : user.role;

      const token = jwt.sign({ id: user.id, role: effectiveRole }, JWT_SECRET, { expiresIn: '6h' });
      return res.json({
        user: { id: user.id, name: user.name, email: user.email, role: effectiveRole },
        token,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Login failed.' });
    }
  });

  // ── Get All Events ─────────────────────────────────────────────────────────
  app.get('/api/events', apiLimiter, async (_req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM events ORDER BY date ASC');
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch events.' });
    }
  });

  // ── JWT Middleware ─────────────────────────────────────────────────────────
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: 'Invalid or expired token' });
      req.user = user;
      next();
    });
  };

  const requireAdmin = (req: any, res: any, next: any) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    next();
  };

  // ── Purchase Ticket ────────────────────────────────────────────────────────
  app.post('/api/tickets/purchase', apiLimiter, authenticateToken, async (req: any, res: any) => {
    const { eventId } = req.body;
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const { rows } = await client.query(
        'SELECT * FROM events WHERE id = $1 FOR UPDATE',
        [eventId]
      );
      const event = rows[0];

      if (!event || event.available_tickets <= 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Event sold out or not found.' });
      }

      const ticketId = `T-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      await client.query(
        'INSERT INTO tickets (id, event_id, user_id, seat) VALUES ($1,$2,$3,$4)',
        [ticketId, eventId, req.user.id, 'Section B, Row 4']
      );
      await client.query(
        'UPDATE events SET available_tickets = available_tickets - 1 WHERE id = $1',
        [eventId]
      );

      await client.query('COMMIT');
      await logAction(req.user.id, 'TICKET_PURCHASE', { eventId, ticketId }, req.ip);
      return res.status(201).json({ ticketId });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      return res.status(500).json({ error: 'Purchase failed.' });
    } finally {
      client.release();
    }
  });

  // ── Admin: Stats ───────────────────────────────────────────────────────────
  app.get('/api/admin/stats', authenticateToken, requireAdmin, async (_req, res) => {
    try {
      const { rows: rev } = await pool.query(
        'SELECT SUM(e.price) as revenue FROM tickets t JOIN events e ON t.event_id = e.id'
      );
      const { rows: tix } = await pool.query('SELECT COUNT(*) as count FROM tickets');
      const { rows: usr } = await pool.query('SELECT COUNT(*) as count FROM users');
      const { rows: sales } = await pool.query(`
        SELECT TO_CHAR(purchased_at, 'YYYY-MM') as month, COUNT(*) as sales
        FROM tickets
        GROUP BY month
        ORDER BY month DESC
        LIMIT 6
      `);

      res.json({
        revenue: rev[0].revenue || 0,
        tickets: tix[0].count,
        users: usr[0].count,
        conversion: '4.2%',
        salesHistory: sales,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch stats.' });
    }
  });

  // ── Admin: List Users ──────────────────────────────────────────────────────
  app.get('/api/admin/users', authenticateToken, requireAdmin, async (_req, res) => {
    try {
      const { rows } = await pool.query(
        'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch users.' });
    }
  });

  // ── Admin: List Logs ───────────────────────────────────────────────────────
  app.get('/api/admin/logs', authenticateToken, requireAdmin, async (_req, res) => {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100'
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch logs.' });
    }
  });

  // ── Admin: Create Event ────────────────────────────────────────────────────
  app.post('/api/admin/events', authenticateToken, requireAdmin, async (req: any, res: any) => {
    const { title, date, location, venue, price, image, category, capacity } = req.body;
    const id = Math.random().toString(36).substr(2, 9);

    try {
      await pool.query(
        `INSERT INTO events (id, title, date, location, venue, price, image, category, capacity, available_tickets)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [id, title, date, location, venue, price, image, category, capacity, capacity]
      );
      await logAction(req.user.id, 'EVENT_CREATE', { id, title }, req.ip);
      res.status(201).json({ id, title });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Failed to create event.' });
    }
  });

  // ── Admin: Update Event ────────────────────────────────────────────────────
  app.put('/api/admin/events/:id', authenticateToken, requireAdmin, async (req: any, res: any) => {
    const { title, price, available_tickets } = req.body;
    const { id } = req.params;

    try {
      await pool.query(
        'UPDATE events SET title = $1, price = $2, available_tickets = $3 WHERE id = $4',
        [title, price, available_tickets, id]
      );
      await logAction(req.user.id, 'EVENT_UPDATE', { id }, req.ip);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Update failed.' });
    }
  });

  // ── Frontend Serving ───────────────────────────────────────────────────────
  // In production, Netlify serves the frontend — this block is only for dev.
  if (!IS_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  // ── Start ──────────────────────────────────────────────────────────────────
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Arias backend running on port ${PORT} [${IS_PROD ? 'production' : 'development'}]`);
  });
}

// Initialize DB then start server
initDB()
  .then(startServer)
  .catch((err) => {
    console.error('❌ Failed to initialize database:', err);
    process.exit(1);
  });