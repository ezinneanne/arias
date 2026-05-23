import pg from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL must be set in your .env file');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to PostgreSQL');
  release();
});

// Initialize schema
export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      location TEXT NOT NULL,
      venue TEXT,
      price REAL NOT NULL,
      image TEXT,
      category TEXT,
      capacity INTEGER NOT NULL,
      available_tickets INTEGER NOT NULL
    );

    -- ── New Sales Table for Bank Transfer Workflow ────────────────────────────────────
    CREATE TABLE IF NOT EXISTS sales (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    event_id TEXT NOT NULL REFERENCES events(id),
    ticket_quantity INTEGER DEFAULT 1,
    total_amount REAL NOT NULL,
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    receipt_url TEXT,                      -- Link to uploaded proof of payment image
    crm_sync_status BOOLEAN DEFAULT false, -- Flags whether n8n has seen this lead yet
    ticket_issued BOOLEAN DEFAULT false,   -- Flags if n8n successfully issued the ticket
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

    CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES events(id),
    user_id TEXT NOT NULL REFERENCES users(id),
    sales_id TEXT REFERENCES sales(id),     -- Links ticket back to the parent sale record
    seat TEXT,
    status TEXT DEFAULT 'active',
    purchased_at TIMESTAMPTZ DEFAULT NOW()
  );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      details TEXT,
      ip_address TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await seedEvents();
  await seedAdmin();
}

async function seedEvents() {
  const { rows } = await pool.query('SELECT COUNT(*) as count FROM events');
  if (parseInt(rows[0].count) >= 4) return;

  const insertEvent = `
    INSERT INTO events (id, title, date, location, venue, price, image, category, capacity, available_tickets)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    ON CONFLICT (id) DO NOTHING
  `;

  await pool.query(insertEvent, ['1', 'Masters League Finals 2026', '2026-06-15T20:00:00',
    'Cyber Arena, Seoul', 'Digital Stadium South', 120,
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200',
    'ESPORTS', 1000, 42]);

  await pool.query(insertEvent, ['2', 'NBA All-Star Game', '2026-02-18T19:30:00',
    'Staples Center, LA', 'Main Arena', 250,
    'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=800',
    'BASKETBALL', 20000, 8]);

  await pool.query(insertEvent, ['3', 'World Cup Qualifiers: GE vs BR', '2026-03-10T18:00:00',
    'Munich Arena, Germany', 'Allianz Stadium', 85,
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
    'FOOTBALL', 75000, 1200]);

  await pool.query(insertEvent, ['4', 'Grand Slam Tennis: Finals', '2026-07-05T14:00:00',
    'Wimbledon, London', 'Centre Court', 320,
    'https://images.unsplash.com/photo-1592709823125-a191f07a2a5e?auto=format&fit=crop&q=80&w=1200',
    'TENNIS', 15000, 15]);

  console.log('✅ Events seeded');
}

async function seedAdmin() {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const ADMIN_NAME = process.env.ADMIN_NAME || 'Arias Administrator';

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in your .env file');
  }

  const { rows } = await pool.query('SELECT id FROM users WHERE email = $1', [ADMIN_EMAIL]);

  if (rows.length === 0) {
    const hashed = bcrypt.hashSync(ADMIN_PASSWORD, 12);
    await pool.query(
      'INSERT INTO users (id, name, email, password, role) VALUES ($1,$2,$3,$4,$5)',
      ['admin-1', ADMIN_NAME, ADMIN_EMAIL, hashed, 'admin']
    );
    console.log('✅ Admin user created');
  } else {
    await pool.query("UPDATE users SET role = 'admin' WHERE email = $1", [ADMIN_EMAIL]);
    console.log('✅ Admin role verified');
  }

  // Seed test user in development only
  if (process.env.NODE_ENV !== 'production') {
    const { rows: testRows } = await pool.query('SELECT id FROM users WHERE email = $1', ['user@arias.app']);
    if (testRows.length === 0) {
      await pool.query(
        'INSERT INTO users (id, name, email, password, role) VALUES ($1,$2,$3,$4,$5)',
        ['user-1', 'Premium Member', 'user@arias.app', bcrypt.hashSync('password123', 12), 'user']
      );
      console.log('✅ Test user created (dev only)');
    }
  }
}

export default pool;