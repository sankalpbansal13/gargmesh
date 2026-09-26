const db = require('./db');

/**
 * Idempotent import of JS module posts into SQLite.
 * Inserts missing slugs. Refreshes seeded posts. Skips any post saved in the admin panel.
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

  const exists = db.prepare('SELECT id, admin_edited FROM posts WHERE slug = ?');
  const softDeleted = db.prepare(
    "SELECT id FROM posts WHERE deleted = 1 AND (slug = ? OR slug LIKE ?)"
  );
  const insert = db.prepare(`
    INSERT INTO posts (slug, title, date, author, excerpt, meta_description, meta_keywords, tldr, body, faq, deleted, admin_edited)
    VALUES (@slug, @title, @date, @author, @excerpt, @meta_description, @meta_keywords, @tldr, @body, @faq, 0, 0)
  `);
  const update = db.prepare(`
    UPDATE posts SET title=@title, date=@date, author=@author, excerpt=@excerpt,
      meta_description=@meta_description, meta_keywords=@meta_keywords, tldr=@tldr, body=@body, faq=@faq
    WHERE id=@id AND IFNULL(admin_edited, 0) = 0
  `);

  let added = 0;
  let refreshed = 0;
  const tx = db.transaction(() => {
    for (const p of modules) {
      if (!p || !p.slug || !p.title) continue;
      const row = {
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
      };
      const current = exists.get(p.slug);
      if (current) {
        if (current.admin_edited) continue;
        const result = update.run(Object.assign({ id: current.id }, row));
        if (result.changes) refreshed++;
        continue;
      }
      if (softDeleted.get(p.slug, p.slug + '-deleted-%')) continue;
      insert.run(row);
      added++;
    }
  });
  tx();

  const total = db.prepare('SELECT COUNT(*) as c FROM posts WHERE deleted = 0').get().c;
  if (added || refreshed) {
    console.log('Seed: blog posts added ' + added + ', refreshed ' + refreshed + ' (total live: ' + total + ').');
  } else {
    console.log('Seed: blog posts already present (' + total + ').');
  }
}

module.exports = { ensureBlogPosts };
