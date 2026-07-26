/**
 * Minimal SQLite-backed session store for express-session (better-sqlite3).
 * Survives process restarts; suitable for single-node production.
 */
function createSqliteSessionStore(session, db) {
  const Store = session.Store;

  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      sid TEXT PRIMARY KEY,
      sess TEXT NOT NULL,
      expired INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS sessions_expired ON sessions(expired);
  `);

  class SqliteStore extends Store {
    constructor() {
      super();
      this.getStmt = db.prepare('SELECT sess, expired FROM sessions WHERE sid = ?');
      this.setStmt = db.prepare('INSERT INTO sessions (sid, sess, expired) VALUES (?, ?, ?) ON CONFLICT(sid) DO UPDATE SET sess = excluded.sess, expired = excluded.expired');
      this.destroyStmt = db.prepare('DELETE FROM sessions WHERE sid = ?');
      this.touchStmt = db.prepare('UPDATE sessions SET expired = ? WHERE sid = ?');
      this.purgeStmt = db.prepare('DELETE FROM sessions WHERE expired < ?');
      // Opportunistic purge of expired rows
      try { this.purgeStmt.run(Date.now()); } catch (e) { /* ignore */ }
    }

    get(sid, cb) {
      try {
        const row = this.getStmt.get(sid);
        if (!row) return cb(null, null);
        if (row.expired && row.expired < Date.now()) {
          this.destroyStmt.run(sid);
          return cb(null, null);
        }
        return cb(null, JSON.parse(row.sess));
      } catch (err) {
        return cb(err);
      }
    }

    set(sid, sess, cb) {
      try {
        const maxAge = sess.cookie && typeof sess.cookie.maxAge === 'number' ? sess.cookie.maxAge : 1000 * 60 * 60 * 8;
        const expired = Date.now() + maxAge;
        this.setStmt.run(sid, JSON.stringify(sess), expired);
        cb && cb(null);
      } catch (err) {
        cb && cb(err);
      }
    }

    destroy(sid, cb) {
      try {
        this.destroyStmt.run(sid);
        cb && cb(null);
      } catch (err) {
        cb && cb(err);
      }
    }

    touch(sid, sess, cb) {
      try {
        const maxAge = sess.cookie && typeof sess.cookie.maxAge === 'number' ? sess.cookie.maxAge : 1000 * 60 * 60 * 8;
        this.touchStmt.run(Date.now() + maxAge, sid);
        cb && cb(null);
      } catch (err) {
        cb && cb(err);
      }
    }
  }

  return SqliteStore;
}

module.exports = { createSqliteSessionStore };
