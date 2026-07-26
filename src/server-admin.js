const {
  app, upload, db, requireAuth, loginLimiter, checkCsrf, checkCsrfCleanupUploads,
  validateUploadedImages, safeUploadPath, safeRedirectPath
} = require('./server-public');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { imageSize } = require('image-size');

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Read pixel dimensions of an uploaded image file (returns {width,height} or null).
function imageDims(filepath) {
  try {
    const buf = fs.readFileSync(filepath);
    const d = imageSize(buf);
    return (d && d.width && d.height) ? { width: d.width, height: d.height } : null;
  } catch (e) { return null; }
}

function unlinkUpload(filename) {
  const fp = safeUploadPath(filename);
  if (fp && fs.existsSync(fp)) {
    try { fs.unlinkSync(fp); } catch (e) { /* ignore */ }
  }
}

// Build the FAQ JSON column from repeater form arrays (faq_q[] / faq_a[]).
function buildFaqJson(body) {
  const qs = Array.isArray(body.faq_q) ? body.faq_q : (body.faq_q ? [body.faq_q] : []);
  const as = Array.isArray(body.faq_a) ? body.faq_a : (body.faq_a ? [body.faq_a] : []);
  const faqs = [];
  for (let i = 0; i < Math.max(qs.length, as.length); i++) {
    const q = (qs[i] || '').trim();
    const a = (as[i] || '').trim();
    if (q) faqs.push({ q, a });
  }
  return JSON.stringify(faqs);
}

function uniqueSlug(base, excludeId) {
  let slug = base || 'product';
  let n = 1;
  while (true) {
    const row = excludeId
      ? db.prepare('SELECT id FROM products WHERE slug = ? AND id != ?').get(slug, excludeId)
      : db.prepare('SELECT id FROM products WHERE slug = ?').get(slug);
    if (!row) return slug;
    slug = base + '-' + (n++);
  }
}

function uniquePostSlug(base, excludeId) {
  let slug = base || 'post';
  let n = 1;
  while (true) {
    const row = excludeId
      ? db.prepare('SELECT id FROM posts WHERE slug = ? AND id != ?').get(slug, excludeId)
      : db.prepare('SELECT id FROM posts WHERE slug = ?').get(slug);
    if (!row) return slug;
    slug = base + '-' + (n++);
  }
}

function linesFromTextarea(raw) {
  return String(raw || '').replace(/\r\n/g, '\n').split('\n').map((l) => l.trimEnd());
}

function tldrFromTextarea(raw) {
  return String(raw || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

// ---------- ADMIN ROUTES ----------

app.get('/admin/login', (req, res) => {
  res.render('admin/login', { title: 'Admin Login | Garg Industrial Mesh', error: null, layout: false });
});

app.post('/admin/login', loginLimiter, checkCsrf, (req, res) => {
  const { username, password } = req.body;
  const admin = db.prepare('SELECT * FROM admin WHERE username = ?').get(username);
  if (admin && admin.password && bcrypt.compareSync(password || '', admin.password)) {
    // Session fixation mitigation: regenerate session id on privilege change
    return req.session.regenerate((err) => {
      if (err) {
        console.error('session.regenerate failed', err);
        return res.status(500).send('Login failed. Please try again.');
      }
      req.session.isAdmin = true;
      req.session.csrfToken = crypto.randomBytes(16).toString('hex');
      res.redirect('/admin/dashboard');
    });
  }
  res.render('admin/login', { title: 'Admin Login', error: 'Invalid username or password', layout: false });
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

app.get('/admin/dashboard', requireAuth, (req, res) => {
  const productCount = db.prepare('SELECT COUNT(*) as c FROM products WHERE deleted = 0').get().c;
  const enquiryCount = db.prepare('SELECT COUNT(*) as c FROM enquiries').get().c;
  const postCount = db.prepare('SELECT COUNT(*) as c FROM posts WHERE deleted = 0').get().c;
  const recentEnquiries = db.prepare('SELECT * FROM enquiries ORDER BY id DESC LIMIT 5').all();
  const recentPosts = db.prepare('SELECT id, title, slug, date FROM posts WHERE deleted = 0 ORDER BY id DESC LIMIT 5').all();
  res.render('admin/dashboard', {
    title: 'Dashboard | Admin',
    productCount, enquiryCount, postCount, recentEnquiries, recentPosts,
    layout: false
  });
});

app.get('/admin/products', requireAuth, (req, res) => {
  const q = (req.query.q || '').trim();
  const cat = req.query.category || '';
  const showDeleted = req.query.deleted === '1';
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];
  if (showDeleted) { sql += ' AND deleted = 1'; }
  else { sql += ' AND deleted = 0'; }
  if (q) { sql += ' AND (name LIKE ? OR short_desc LIKE ?)'; params.push('%'+q+'%','%'+q+'%'); }
  if (cat) { sql += ' AND category = ?'; params.push(cat); }
  sql += ' ORDER BY id DESC';
  const products = db.prepare(sql).all(...params);
  const categories = [...new Set(db.prepare('SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND deleted = 0').all().map(r => r.category))];
  res.render('admin/products', { title: 'Manage Products | Admin', products, categories, q, cat, showDeleted, layout: false });
});

app.get('/admin/products/new', requireAuth, (req, res) => {
  res.render('admin/product-form', { title: 'Add Product | Admin', product: {}, images: [], isEdit: false, layout: false });
});

app.post('/admin/products', requireAuth, upload.array('photos', 10), checkCsrfCleanupUploads, validateUploadedImages, (req, res) => {
  try {
    const b = req.body;
    const slug = uniqueSlug(b.slug ? slugify(b.slug) : slugify(b.name));
    const faqJson = buildFaqJson(b);
    const rating = b.rating_value !== '' && b.rating_value != null ? Number(b.rating_value) : null;
    const reviews = b.review_count !== '' && b.review_count != null ? parseInt(b.review_count, 10) : null;
    const info = db.prepare(`
      INSERT INTO products (slug, name, category, short_desc, description, materials, sizes, grades, applications, price_from, faq, meta_title, meta_description, meta_keywords, featured, rating_value, review_count)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).run(
      slug, b.name, b.category, b.short_desc, b.description, b.materials, b.sizes, b.grades, b.applications, b.price_from,
      faqJson, b.meta_title, b.meta_description, b.meta_keywords, b.featured ? 1 : 0,
      (rating != null && !Number.isNaN(rating) ? rating : null),
      (reviews != null && !Number.isNaN(reviews) ? reviews : null)
    );
    if (req.files && req.files.length) {
      const hasCover = db.prepare('SELECT COUNT(*) as c FROM product_images WHERE product_id = ? AND is_cover = 1').get(info.lastInsertRowid).c;
      const insImg = db.prepare('INSERT INTO product_images (product_id, filename, caption, alt_text, sort_order, is_cover, width, height) VALUES (?,?,?,?,?,?,?,?)');
      req.files.forEach((f, i) => {
        const fp = safeUploadPath(f.filename);
        const dims = fp ? imageDims(fp) : null;
        insImg.run(info.lastInsertRowid, path.basename(f.filename), '', '', i, (i === 0 && !hasCover) ? 1 : 0, dims ? dims.width : null, dims ? dims.height : null);
      });
    }
    req.session.flash = '✅ Product created successfully.';
    res.redirect('/admin/products');
  } catch (err) {
    console.error('Create product failed', err);
    (req.files || []).forEach((f) => unlinkUpload(f.filename));
    req.session.flash = 'Could not create product. Please try again.';
    res.redirect('/admin/products/new');
  }
});

// Duplicate a product (clone data + copy image files into a new draft)
app.post('/admin/products/:id/duplicate', requireAuth, checkCsrf, (req, res) => {
  try {
    const p = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!p) return res.redirect('/admin/products');
    const slug = uniqueSlug(slugify(p.name) + '-copy');
    const info = db.prepare(`
      INSERT INTO products (slug, name, category, short_desc, description, materials, sizes, grades, applications, price_from, faq, meta_title, meta_description, meta_keywords, featured, rating_value, review_count)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).run(
      slug, p.name + ' (Copy)', p.category, p.short_desc, p.description, p.materials, p.sizes, p.grades, p.applications,
      p.price_from, p.faq, p.meta_title, p.meta_description, p.meta_keywords, 0, p.rating_value || null, p.review_count || null
    );
    const newId = info.lastInsertRowid;
    const imgs = db.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC').all(p.id);
    const insImg = db.prepare('INSERT INTO product_images (product_id, filename, caption, alt_text, sort_order, is_cover, width, height) VALUES (?,?,?,?,?,?,?,?)');
    const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
    imgs.forEach((im) => {
      const src = safeUploadPath(im.filename);
      if (!src || !fs.existsSync(src)) return;
      const ext = path.extname(im.filename) || '.jpg';
      const copyName = crypto.randomBytes(12).toString('hex') + ext;
      try {
        fs.copyFileSync(src, path.join(uploadsDir, copyName));
        insImg.run(newId, copyName, im.caption || '', im.alt_text || '', im.sort_order || 0, im.is_cover ? 1 : 0, im.width || null, im.height || null);
      } catch (e) {
        console.warn('Duplicate image copy failed', im.filename, e.message);
      }
    });
    req.session.flash = 'Product duplicated (including photos).';
  } catch (err) {
    console.error('Duplicate product failed', err);
    req.session.flash = 'Could not duplicate product.';
  }
  res.redirect('/admin/products');
});

app.get('/admin/products/:id/edit', requireAuth, (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.redirect('/admin/products');
  const images = db.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC').all(product.id);
  res.render('admin/product-form', { title: 'Edit Product | Admin', product, images, isEdit: true, layout: false });
});

app.put('/admin/products/:id', requireAuth, upload.array('photos', 10), checkCsrfCleanupUploads, validateUploadedImages, (req, res) => {
  try {
    const b = req.body;
    const id = req.params.id;
    const slug = uniqueSlug(b.slug ? slugify(b.slug) : slugify(b.name), id);
    const faqJson = buildFaqJson(b);
    const rating = b.rating_value !== '' && b.rating_value != null ? Number(b.rating_value) : null;
    const reviews = b.review_count !== '' && b.review_count != null ? parseInt(b.review_count, 10) : null;
    db.prepare(`
      UPDATE products SET slug=?, name=?, category=?, short_desc=?, description=?, materials=?, sizes=?, grades=?, applications=?, price_from=?, faq=?, meta_title=?, meta_description=?, meta_keywords=?, featured=?, rating_value=?, review_count=? WHERE id=?
    `).run(
      slug, b.name, b.category, b.short_desc, b.description, b.materials, b.sizes, b.grades, b.applications, b.price_from,
      faqJson, b.meta_title, b.meta_description, b.meta_keywords, b.featured ? 1 : 0,
      (rating != null && !Number.isNaN(rating) ? rating : null),
      (reviews != null && !Number.isNaN(reviews) ? reviews : null),
      id
    );
    if (req.files && req.files.length) {
      const hasCover = db.prepare('SELECT COUNT(*) as c FROM product_images WHERE product_id = ? AND is_cover = 1').get(id).c;
      const maxSort = db.prepare('SELECT COALESCE(MAX(sort_order),-1) as m FROM product_images WHERE product_id = ?').get(id).m;
      const insImg = db.prepare('INSERT INTO product_images (product_id, filename, caption, alt_text, sort_order, is_cover, width, height) VALUES (?,?,?,?,?,?,?,?)');
      req.files.forEach((f, i) => {
        const fp = safeUploadPath(f.filename);
        const dims = fp ? imageDims(fp) : null;
        insImg.run(id, path.basename(f.filename), '', '', maxSort + 1 + i, (maxSort === -1 && i === 0 && !hasCover) ? 1 : 0, dims ? dims.width : null, dims ? dims.height : null);
      });
    }
    req.session.flash = '✅ Product updated successfully.';
    res.redirect('/admin/products');
  } catch (err) {
    console.error('Update product failed', err);
    (req.files || []).forEach((f) => unlinkUpload(f.filename));
    req.session.flash = 'Could not update product. Please try again.';
    res.redirect('/admin/products/' + req.params.id + '/edit');
  }
});

// Quick price update from products list (no full form needed)
app.post('/admin/products/:id/price', requireAuth, checkCsrf, (req, res) => {
  const id = req.params.id;
  const product = db.prepare('SELECT id, name FROM products WHERE id = ?').get(id);
  if (!product) {
    req.session.flash = 'Product not found.';
    return res.redirect('/admin/products');
  }
  const price = String(req.body.price_from || '').trim().slice(0, 80);
  db.prepare('UPDATE products SET price_from = ? WHERE id = ?').run(price, id);
  req.session.flash = `Price updated for ${product.name}: ${price || '(cleared)'}`;
  const back = safeRedirectPath(req.body.redirect, '/admin/products');
  res.redirect(back);
});

// Soft-delete (default Delete button) — free the live slug for reuse
app.delete('/admin/products/:id', requireAuth, checkCsrf, (req, res) => {
  const p = db.prepare('SELECT id, slug FROM products WHERE id = ?').get(req.params.id);
  if (p) {
    const base = String(p.slug || 'product').replace(/-deleted-\d+$/, '');
    const tombstone = uniqueSlug(base + '-deleted-' + p.id);
    db.prepare('UPDATE products SET deleted = 1, slug = ? WHERE id = ?').run(tombstone, p.id);
  }
  req.session.flash = '🗑️ Product moved to deleted (restore anytime).';
  res.redirect('/admin/products');
});

// Restore a soft-deleted product and reclaim a clean slug
app.post('/admin/products/:id/restore', requireAuth, checkCsrf, (req, res) => {
  const p = db.prepare('SELECT id, slug, name FROM products WHERE id = ?').get(req.params.id);
  if (p) {
    const restoredBase = String(p.slug || '').replace(new RegExp('-deleted-' + p.id + '$'), '') || slugify(p.name);
    const slug = uniqueSlug(restoredBase, p.id);
    db.prepare('UPDATE products SET deleted = 0, slug = ? WHERE id = ?').run(slug, p.id);
    req.session.flash = '✅ Product restored.';
  } else {
    req.session.flash = 'Product not found.';
  }
  res.redirect('/admin/products?deleted=1');
});

// Permanent (hard) delete — removes product + images + files
app.post('/admin/products/:id/permdelete', requireAuth, checkCsrf, (req, res) => {
  const imgs = db.prepare('SELECT filename FROM product_images WHERE product_id = ?').all(req.params.id);
  imgs.forEach(im => unlinkUpload(im.filename));
  db.prepare('DELETE FROM product_images WHERE product_id = ?').run(req.params.id);
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  req.session.flash = '🗑️ Product permanently deleted.';
  res.redirect('/admin/products?deleted=1');
});

// Update image caption + alt text
app.post('/admin/images/:id', requireAuth, checkCsrf, (req, res) => {
  const { caption, alt_text } = req.body;
  const img = db.prepare('SELECT * FROM product_images WHERE id = ?').get(req.params.id);
  db.prepare('UPDATE product_images SET caption = ?, alt_text = ? WHERE id = ?').run(caption || '', alt_text || '', req.params.id);
  res.redirect('/admin/products/' + (img ? img.product_id : '') + '/edit');
});

// Set image as cover
app.post('/admin/images/:id/cover', requireAuth, checkCsrf, (req, res) => {
  const img = db.prepare('SELECT * FROM product_images WHERE id = ?').get(req.params.id);
  if (img) {
    db.prepare('UPDATE product_images SET is_cover = 0 WHERE product_id = ?').run(img.product_id);
    db.prepare('UPDATE product_images SET is_cover = 1 WHERE id = ?').run(img.id);
  }
  res.redirect('/admin/products/' + (img ? img.product_id : '') + '/edit');
});

// Reorder image (up/down) by swapping sort_order with neighbour
app.post('/admin/images/:id/move', requireAuth, checkCsrf, (req, res) => {
  const dir = req.body.dir || req.query.dir || 'up';
  const img = db.prepare('SELECT * FROM product_images WHERE id = ?').get(req.params.id);
  if (img) {
    const ordered = db.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC').all(img.product_id);
    const idx = ordered.findIndex(o => o.id === img.id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx >= 0 && swapIdx < ordered.length) {
      const other = ordered[swapIdx];
      db.prepare('UPDATE product_images SET sort_order = ? WHERE id = ?').run(other.sort_order, img.id);
      db.prepare('UPDATE product_images SET sort_order = ? WHERE id = ?').run(img.sort_order, other.id);
    }
  }
  res.redirect('/admin/products/' + (img ? img.product_id : '') + '/edit');
});

app.delete('/admin/images/:id', requireAuth, checkCsrf, (req, res) => {
  const img = db.prepare('SELECT * FROM product_images WHERE id = ?').get(req.params.id);
  if (img) {
    unlinkUpload(img.filename);
    db.prepare('DELETE FROM product_images WHERE id = ?').run(img.id);
  }
  res.redirect('/admin/products/' + (img ? img.product_id : '') + '/edit');
});

// ---------- BLOG / POSTS ----------

app.get('/admin/posts', requireAuth, (req, res) => {
  const q = (req.query.q || '').trim();
  const showDeleted = req.query.deleted === '1';
  const { listPosts } = require('./posts');
  const posts = listPosts({ includeDeleted: showDeleted, q });
  res.render('admin/posts', { title: 'Manage Blog | Admin', posts, q, showDeleted, layout: false });
});

app.get('/admin/posts/new', requireAuth, (req, res) => {
  res.render('admin/post-form', {
    title: 'Add Blog Post | Admin',
    post: {
      author: 'Garg Industrial Mesh Team',
      date: new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }),
      tldr: [],
      body: [],
      faq: []
    },
    isEdit: false,
    layout: false
  });
});

app.post('/admin/posts', requireAuth, checkCsrf, (req, res) => {
  try {
    const b = req.body;
    if (!(b.title || '').trim()) {
      req.session.flash = 'Title is required.';
      return res.redirect('/admin/posts/new');
    }
    const slug = uniquePostSlug(b.slug ? slugify(b.slug) : slugify(b.title));
    const faqJson = buildFaqJson(b);
    const tldrJson = JSON.stringify(tldrFromTextarea(b.tldr));
    const bodyJson = JSON.stringify(linesFromTextarea(b.body));
    db.prepare(`
      INSERT INTO posts (slug, title, date, author, excerpt, meta_description, meta_keywords, tldr, body, faq, deleted)
      VALUES (?,?,?,?,?,?,?,?,?,?,0)
    `).run(
      slug, b.title.trim(), (b.date || '').trim(), (b.author || 'Garg Industrial Mesh Team').trim(),
      (b.excerpt || '').trim(), (b.meta_description || '').trim(), (b.meta_keywords || '').trim(),
      tldrJson, bodyJson, faqJson
    );
    req.session.flash = 'Blog post created.';
    res.redirect('/admin/posts');
  } catch (err) {
    console.error('Create post failed', err);
    req.session.flash = 'Could not create post. Please try again.';
    res.redirect('/admin/posts/new');
  }
});

app.get('/admin/posts/:id/edit', requireAuth, (req, res) => {
  const { findById } = require('./posts');
  const post = findById(req.params.id);
  if (!post) return res.redirect('/admin/posts');
  res.render('admin/post-form', { title: 'Edit Blog Post | Admin', post, isEdit: true, layout: false });
});

app.put('/admin/posts/:id', requireAuth, checkCsrf, (req, res) => {
  try {
    const b = req.body;
    const id = req.params.id;
    const existing = db.prepare('SELECT id FROM posts WHERE id = ?').get(id);
    if (!existing) {
      req.session.flash = 'Post not found.';
      return res.redirect('/admin/posts');
    }
    if (!(b.title || '').trim()) {
      req.session.flash = 'Title is required.';
      return res.redirect('/admin/posts/' + id + '/edit');
    }
    const slug = uniquePostSlug(b.slug ? slugify(b.slug) : slugify(b.title), id);
    const faqJson = buildFaqJson(b);
    const tldrJson = JSON.stringify(tldrFromTextarea(b.tldr));
    const bodyJson = JSON.stringify(linesFromTextarea(b.body));
    db.prepare(`
      UPDATE posts SET slug=?, title=?, date=?, author=?, excerpt=?, meta_description=?, meta_keywords=?, tldr=?, body=?, faq=?
      WHERE id=?
    `).run(
      slug, b.title.trim(), (b.date || '').trim(), (b.author || 'Garg Industrial Mesh Team').trim(),
      (b.excerpt || '').trim(), (b.meta_description || '').trim(), (b.meta_keywords || '').trim(),
      tldrJson, bodyJson, faqJson, id
    );
    req.session.flash = 'Blog post updated.';
    res.redirect('/admin/posts');
  } catch (err) {
    console.error('Update post failed', err);
    req.session.flash = 'Could not update post. Please try again.';
    res.redirect('/admin/posts/' + req.params.id + '/edit');
  }
});

app.delete('/admin/posts/:id', requireAuth, checkCsrf, (req, res) => {
  const p = db.prepare('SELECT id, slug FROM posts WHERE id = ?').get(req.params.id);
  if (p) {
    const base = String(p.slug || 'post').replace(/-deleted-\d+$/, '');
    const tombstone = uniquePostSlug(base + '-deleted-' + p.id);
    db.prepare('UPDATE posts SET deleted = 1, slug = ? WHERE id = ?').run(tombstone, p.id);
  }
  req.session.flash = 'Post moved to deleted (restore anytime).';
  res.redirect('/admin/posts');
});

app.post('/admin/posts/:id/restore', requireAuth, checkCsrf, (req, res) => {
  const p = db.prepare('SELECT id, slug, title FROM posts WHERE id = ?').get(req.params.id);
  if (p) {
    const restoredBase = String(p.slug || '').replace(new RegExp('-deleted-' + p.id + '$'), '') || slugify(p.title);
    const slug = uniquePostSlug(restoredBase, p.id);
    db.prepare('UPDATE posts SET deleted = 0, slug = ? WHERE id = ?').run(slug, p.id);
    req.session.flash = 'Post restored.';
  } else {
    req.session.flash = 'Post not found.';
  }
  res.redirect('/admin/posts?deleted=1');
});

app.post('/admin/posts/:id/permdelete', requireAuth, checkCsrf, (req, res) => {
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  req.session.flash = 'Post permanently deleted.';
  res.redirect('/admin/posts?deleted=1');
});

app.get('/admin/enquiries', requireAuth, (req, res) => {
  const enquiries = db.prepare('SELECT * FROM enquiries ORDER BY id DESC').all();
  res.render('admin/enquiries', { title: 'Enquiries | Admin', enquiries, layout: false });
});

// CSV export of enquiries
app.get('/admin/enquiries.csv', requireAuth, (req, res) => {
  const enquiries = db.prepare('SELECT * FROM enquiries ORDER BY id DESC').all();
  const esc = (v) => {
    const s = (v === null || v === undefined) ? '' : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const header = ['id', 'name', 'phone', 'email', 'product', 'message', 'created_at'].join(',');
  const rows = enquiries.map(e => [e.id, e.name, e.phone, e.email, e.product, e.message, e.created_at].map(esc).join(','));
  const csv = header + '\n' + rows.join('\n');
  res.set('Content-Type', 'text/csv');
  res.set('Content-Disposition', 'attachment; filename="enquiries.csv"');
  res.send(csv);
});

// Bulk delete enquiries
app.post('/admin/enquiries/bulk', requireAuth, checkCsrf, (req, res) => {
  const ids = Array.isArray(req.body.ids) ? req.body.ids : (req.body.ids ? [req.body.ids] : []);
  const del = db.prepare('DELETE FROM enquiries WHERE id = ?');
  const tx = db.transaction(() => ids.forEach(id => del.run(Number(id))));
  tx();
  req.session.flash = `🗑️ ${ids.length} enquiry(s) deleted.`;
  res.redirect('/admin/enquiries');
});

app.delete('/admin/enquiries/:id', requireAuth, checkCsrf, (req, res) => {
  db.prepare('DELETE FROM enquiries WHERE id = ?').run(req.params.id);
  req.session.flash = 'Enquiry deleted.';
  res.redirect('/admin/enquiries');
});

// 404 (last)
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found | Garg Industrial Mesh' });
});

// Central error handler (must have 4 args)
app.use((err, req, res, next) => {
  console.error('Unhandled error', err);
  if (res.headersSent) return next(err);
  const debugOn = /^(1|true|yes|on)$/i.test(String(process.env.DEBUG || ''));
  if (debugOn) {
    return res.status(500).type('text/plain').send(
      'DEBUG error\n\n' + (err && err.stack ? err.stack : String(err))
    );
  }
  if (req.path && req.path.startsWith('/admin')) {
    req.session && (req.session.flash = 'Something went wrong. Please try again.');
    return res.status(500).redirect('/admin/dashboard');
  }
  res.status(500).send('Something went wrong. Please try again.');
});

const { PORT } = require('./server-public');
app.listen(PORT, () => {
  console.log('Garg Industrial Mesh server running on http://localhost:' + PORT);
  if (/^(1|true|yes|on)$/i.test(String(process.env.DEBUG || ''))) {
    console.log('[debug] request logging and error stacks enabled');
  }
});
