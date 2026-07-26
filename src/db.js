const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'garg.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE,
  name TEXT NOT NULL,
  category TEXT,
  short_desc TEXT,
  description TEXT,
  materials TEXT,
  sizes TEXT,
  grades TEXT,
  applications TEXT,
  price_from TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  featured INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS product_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER,
  filename TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  phone TEXT,
  email TEXT,
  product TEXT,
  message TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS admin (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  date TEXT,
  author TEXT,
  excerpt TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  tldr TEXT,
  body TEXT,
  faq TEXT,
  deleted INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
`);

// Add columns added in this extension if missing (idempotent)
function addColumnIfMissing(table, column, def) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all().map(c => c.name);
  if (!cols.includes(column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${def}`);
  }
}
addColumnIfMissing('products', 'grades', 'TEXT');
addColumnIfMissing('products', 'applications', 'TEXT');
addColumnIfMissing('products', 'price_from', 'TEXT');
addColumnIfMissing('products', 'faq', 'TEXT'); // JSON array of {q,a}
addColumnIfMissing('products', 'deleted', 'INTEGER DEFAULT 0');
addColumnIfMissing('products', 'rating_value', 'REAL');
addColumnIfMissing('products', 'review_count', 'INTEGER');
addColumnIfMissing('product_images', 'alt_text', 'TEXT');
addColumnIfMissing('product_images', 'is_cover', 'INTEGER DEFAULT 0');
addColumnIfMissing('product_images', 'width', 'INTEGER');
addColumnIfMissing('product_images', 'height', 'INTEGER');

// Known published defaults — never auto-set these as the live password going forward.
const PUBLISHED_DEFAULTS = ['bhavyathegreat', 'gargmesh2026'];

function envAdminPassword() {
  const p = (process.env.ADMIN_PASSWORD || '').trim();
  return p.length >= 8 ? p : null;
}

function randomPassword() {
  return crypto.randomBytes(18).toString('base64url');
}

function setAdminPassword(plain, reason) {
  const hash = bcrypt.hashSync(plain, 10);
  db.prepare('UPDATE admin SET password = ? WHERE username = ?').run(hash, 'admin');
  console.warn('[auth]', reason);
}

const adminRow = db.prepare('SELECT id, password FROM admin WHERE username = ?').get('admin');
if (!adminRow) {
  const pwd = envAdminPassword() || randomPassword();
  const hash = bcrypt.hashSync(pwd, 10);
  db.prepare('INSERT INTO admin (username, password) VALUES (?, ?)').run('admin', hash);
  if (!envAdminPassword()) {
    console.warn('[auth] Created admin user with one-time password (save it, then set ADMIN_PASSWORD):', pwd);
  } else {
    console.warn('[auth] Created admin user from ADMIN_PASSWORD env.');
  }
} else {
  const pwd = adminRow.password || '';
  const isHashed = pwd.startsWith('$2');
  if (!isHashed) {
    // Migrate plaintext row — never write a published default.
    const next = envAdminPassword() || randomPassword();
    setAdminPassword(next, envAdminPassword()
      ? 'Migrated plaintext admin password from ADMIN_PASSWORD env.'
      : 'Migrated plaintext admin password; one-time password: ' + next);
  } else {
    const matchesPublished = PUBLISHED_DEFAULTS.some((d) => {
      try { return bcrypt.compareSync(d, pwd); } catch (e) { return false; }
    });
    if (matchesPublished) {
      if (envAdminPassword()) {
        setAdminPassword(envAdminPassword(), 'Rotated known published admin password from ADMIN_PASSWORD env.');
      } else {
        console.warn('[auth] WARNING: admin password matches a published default. Set ADMIN_PASSWORD (min 8 chars) and restart to rotate.');
      }
    }
  }
}

module.exports = db;
