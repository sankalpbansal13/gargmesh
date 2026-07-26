const db = require('./db');

/**
 * Idempotent import of JS module posts into SQLite.
 * Only inserts missing slugs — never overwrites admin edits.
 */
function ensureBlogPosts() {
  let modules;
  try {
    modules = require('./blog-data').posts || [];
  } catch (e) {
    console.warn('Seed blog: could not load blog-data modules:', e.message);
    return;
  }
  if (!modules.length) return;

  const exists = db.prepare('SELECT id FROM posts WHERE slug = ?');
  const softDeleted = db.prepare(
    "SELECT id FROM posts WHERE deleted = 1 AND (slug = ? OR slug LIKE ?)"
  );
  const insert = db.prepare(`
    INSERT INTO posts (slug, title, date, author, excerpt, meta_description, meta_keywords, tldr, body, faq, deleted)
    VALUES (@slug, @title, @date, @author, @excerpt, @meta_description, @meta_keywords, @tldr, @body, @faq, 0)
  `);

  let added = 0;
  const tx = db.transaction(() => {
    for (const p of modules) {
      if (!p || !p.slug || !p.title) continue;
      if (exists.get(p.slug)) continue;
      if (softDeleted.get(p.slug, p.slug + '-deleted-%')) continue;
      insert.run({
        slug: p.slug,
        title: p.title,
        date: p.date || '',
        author: p.author || 'Garg Industrial Mesh Team',
        excerpt: p.excerpt || '',
        meta_description: p.meta_description || '',
        meta_keywords: p.meta_keywords || '',
        tldr: JSON.stringify(Array.isArray(p.tldr) ? p.tldr : []),
        body: JSON.stringify(Array.isArray(p.body) ? p.body : []),
        faq: JSON.stringify(Array.isArray(p.faq) ? p.faq : [])
      });
      added++;
    }
  });
  tx();

  const total = db.prepare('SELECT COUNT(*) as c FROM posts WHERE deleted = 0').get().c;
  if (added) {
    console.log('Seed: imported ' + added + ' blog post(s) into SQLite (total live: ' + total + ').');
  } else {
    console.log('Seed: blog posts already present (' + total + ').');
  }
}

module.exports = { ensureBlogPosts };
