const db = require('./db');

function safeJson(raw, fallback) {
  if (raw == null || raw === '') return fallback;
  if (typeof raw !== 'string') return raw;
  try {
    const v = JSON.parse(raw);
    return v == null ? fallback : v;
  } catch (e) {
    return fallback;
  }
}

/** Hydrate a DB row into the shape public/admin views expect. */
function hydratePost(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: row.date || '',
    author: row.author || 'Garg Industrial Mesh Team',
    excerpt: row.excerpt || '',
    meta_description: row.meta_description || '',
    meta_keywords: row.meta_keywords || '',
    tldr: safeJson(row.tldr, []),
    body: safeJson(row.body, []),
    faq: safeJson(row.faq, []),
    deleted: row.deleted ? 1 : 0,
    created_at: row.created_at
  };
}

function listPosts({ includeDeleted = false, q = '' } = {}) {
  let sql = 'SELECT * FROM posts WHERE 1=1';
  const params = [];
  if (!includeDeleted) sql += ' AND deleted = 0';
  else sql += ' AND deleted = 1';
  if (q) {
    sql += ' AND (title LIKE ? OR excerpt LIKE ? OR slug LIKE ?)';
    const like = '%' + q + '%';
    params.push(like, like, like);
  }
  sql += ' ORDER BY id DESC';
  return db.prepare(sql).all(...params).map(hydratePost);
}

function findBySlug(slug) {
  const row = db.prepare('SELECT * FROM posts WHERE slug = ? AND deleted = 0').get(slug);
  return hydratePost(row);
}

function findById(id) {
  const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
  return hydratePost(row);
}

function countPosts(includeDeleted) {
  if (includeDeleted) {
    return db.prepare('SELECT COUNT(*) as c FROM posts WHERE deleted = 1').get().c;
  }
  return db.prepare('SELECT COUNT(*) as c FROM posts WHERE deleted = 0').get().c;
}

module.exports = {
  hydratePost,
  listPosts,
  findBySlug,
  findById,
  countPosts,
  safeJson
};
