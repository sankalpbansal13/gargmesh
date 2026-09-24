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

function asList(value) {
  if (Array.isArray(value)) return value;
  if (value == null || value === '') return [];
  return [value];
}

function categoryChoices() {
  return db.prepare(
    'SELECT id, slug, name FROM categories WHERE deleted = 0 ORDER BY sort_order ASC, name ASC'
  ).all();
}

function loadDesign(id) {
  return db.prepare(`
    SELECT d.*, c.name AS category_name, c.slug AS category_slug
    FROM designs d JOIN categories c ON c.id = d.category_id
    WHERE d.id = ?
  `).get(id);
}

function uniqueDesignSlug(categoryId, base, excludeId) {
  let slug = base || 'design';
  let n = 1;
  while (true) {
    const row = excludeId
      ? db.prepare('SELECT id FROM designs WHERE category_id = ? AND slug = ? AND id != ?').get(categoryId, slug, excludeId)
      : db.prepare('SELECT id FROM designs WHERE category_id = ? AND slug = ?').get(categoryId, slug);
    if (!row) return slug;
    slug = (base || 'design') + '-' + (n++);
  }
}

function markDesignEdited(id) {
  db.prepare('UPDATE designs SET admin_edited = 1 WHERE id = ?').run(id);
}

function unlinkIfUnused(filename) {
  if (!filename) return;
  const used = db.prepare('SELECT COUNT(*) AS c FROM design_images WHERE filename = ?').get(filename).c;
  let legacy = 0;
  try {
    legacy = db.prepare('SELECT COUNT(*) AS c FROM product_images WHERE filename = ?').get(filename).c;
  } catch (e) { legacy = 0; }
  if (used + legacy === 0) unlinkUpload(filename);
}

function attachDesignPhotos(designId, files) {
  if (!files || !files.length) return;
  const hasCover = db.prepare(
    'SELECT COUNT(*) AS c FROM design_images WHERE design_id = ? AND is_cover = 1'
  ).get(designId).c;
  const maxSort = db.prepare(
    'SELECT COALESCE(MAX(sort_order), 0) AS m FROM design_images WHERE design_id = ?'
  ).get(designId).m;
  const ins = db.prepare(
    `INSERT INTO design_images
     (design_id, filename, caption, alt_text, sort_order, is_cover, width, height, material_slug)
     VALUES (?,?,?,?,?,?,?,?,?)`
  );
  files.forEach((f, i) => {
    const fp = safeUploadPath(f.filename);
    const dims = fp ? imageDims(fp) : null;
    ins.run(
      designId,
      path.basename(f.filename),
      '',
      '',
      maxSort + 1 + i,
      hasCover === 0 && i === 0 ? 1 : 0,
      dims ? dims.width : null,
      dims ? dims.height : null,
      null
    );
  });
}

function nextMaterialSlug(designId, name) {
  let slug = slugify(name) || 'material';
  const base = slug;
  let n = 1;
  while (true) {
    const row = db.prepare(
      'SELECT id, deleted FROM design_materials WHERE design_id = ? AND slug = ?'
    ).get(designId, slug);
    if (!row) return { slug, reviveId: null };
    if (row.deleted) return { slug, reviveId: row.id };
    slug = base + '-' + (n++);
  }
}

function saveMaterials(designId, body) {
  const ids = asList(body.mat_id);
  const names = asList(body.mat_name);
  const grades = asList(body.mat_grades);
  const shorts = asList(body.mat_short);
  const prices = asList(body.mat_price);
  const remove = new Set(asList(body.mat_remove).map(String));
  const update = db.prepare(
    `UPDATE design_materials
     SET name = ?, grades = ?, short_desc = ?, price_from = ?, sort_order = ?, deleted = 0
     WHERE id = ? AND design_id = ?`
  );
  const soft = db.prepare('UPDATE design_materials SET deleted = 1 WHERE id = ? AND design_id = ?');
  ids.forEach((id, i) => {
    if (!id) return;
    if (remove.has(String(id))) {
      soft.run(id, designId);
      return;
    }
    const name = String(names[i] || '').trim();
    if (!name) return;
    update.run(
      name,
      String(grades[i] || '').trim(),
      String(shorts[i] || '').trim(),
      String(prices[i] || '').trim().slice(0, 80),
      i + 1,
      id,
      designId
    );
  });
  const newNames = asList(body.mat_new_name);
  const newPrices = asList(body.mat_new_price);
  const newGrades = asList(body.mat_new_grades);
  const insert = db.prepare(
    `INSERT INTO design_materials
     (design_id, slug, name, price_from, grades, short_desc, sort_order, deleted)
     VALUES (?,?,?,?,?,?,?,0)`
  );
  const revive = db.prepare(
    `UPDATE design_materials
     SET name = ?, price_from = ?, grades = ?, short_desc = ?, sort_order = ?, deleted = 0
     WHERE id = ?`
  );
  newNames.forEach((raw, i) => {
    const name = String(raw || '').trim();
    if (!name) return;
    const found = nextMaterialSlug(designId, name);
    const price = String(newPrices[i] || '').trim().slice(0, 80);
    const grade = String(newGrades[i] || '').trim();
    if (found.reviveId) {
      revive.run(name, price, grade, '', ids.length + i + 1, found.reviveId);
      return;
    }
    insert.run(designId, found.slug, name, price, grade, '', ids.length + i + 1);
  });
}

function waDigits(phone) {
  let d = String(phone || '').replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  if (d.length === 10) d = '91' + d;
  return d;
}
app.locals.waDigits = waDigits;

const ENQUIRY_STATUSES = ['new', 'contacted', 'quoted', 'closed'];

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
  const productCount = db.prepare('SELECT COUNT(*) as c FROM designs WHERE deleted = 0').get().c;
  const enquiryCount = db.prepare("SELECT COUNT(*) as c FROM enquiries WHERE COALESCE(status, 'new') = 'new'").get().c;
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
  let sql = `
    SELECT d.*, c.name AS category_name, c.slug AS category_slug,
      (SELECT group_concat(m.name || ' — ' || COALESCE(NULLIF(m.price_from, ''), 'Ask for quote'), ' · ')
       FROM design_materials m WHERE m.design_id = d.id AND m.deleted = 0) AS prices
    FROM designs d JOIN categories c ON c.id = d.category_id WHERE 1=1`;
  const params = [];
  if (showDeleted) sql += ' AND d.deleted = 1';
  else sql += ' AND d.deleted = 0 AND c.deleted = 0';
  if (q) { sql += ' AND (d.name LIKE ? OR d.short_desc LIKE ?)'; params.push('%' + q + '%', '%' + q + '%'); }
  if (cat) { sql += ' AND c.slug = ?'; params.push(cat); }
  sql += ' ORDER BY c.sort_order ASC, d.sort_order ASC';
  const products = db.prepare(sql).all(...params).map((p) => ({
    ...p,
    category: p.category_name,
    slug: p.category_slug + '/' + p.slug
  }));
  res.render('admin/products', {
    title: 'Manage Designs | Admin',
    products,
    categories: categoryChoices(),
    q,
    cat,
    showDeleted,
    layout: false
  });
});

app.get('/admin/products/new', requireAuth, (req, res) => {
  res.render('admin/product-form', {
    title: 'Add product | Admin',
    product: {},
    materials: [],
    images: [],
    categories: categoryChoices(),
    isEdit: false,
    layout: false
  });
});

app.post('/admin/products', requireAuth, upload.array('photos', 10), checkCsrfCleanupUploads, validateUploadedImages, (req, res) => {
  try {
    const b = req.body;
    const categoryId = Number(b.category_id);
    const category = db.prepare('SELECT id FROM categories WHERE id = ? AND deleted = 0').get(categoryId);
    if (!category || !String(b.name || '').trim()) {
      (req.files || []).forEach((f) => unlinkUpload(f.filename));
      req.session.flash = 'Name and category are required.';
      return res.redirect('/admin/products/new');
    }
    const slug = uniqueDesignSlug(categoryId, b.slug ? slugify(b.slug) : slugify(b.name));
    const info = db.prepare(`
      INSERT INTO designs
      (category_id, slug, name, short_desc, description, applications, faq, meta_title, meta_description, meta_keywords, featured, admin_edited, custom)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,1,1)
    `).run(
      categoryId, slug, String(b.name).trim(), String(b.short_desc || '').trim(), String(b.description || '').trim(),
      String(b.applications || '').trim(), buildFaqJson(b), String(b.meta_title || '').trim(),
      String(b.meta_description || '').trim(), String(b.meta_keywords || '').trim(), b.featured ? 1 : 0
    );
    saveMaterials(info.lastInsertRowid, b);
    attachDesignPhotos(info.lastInsertRowid, req.files);
    req.session.flash = 'Product created. It is on the live catalogue.';
    res.redirect('/admin/products/' + info.lastInsertRowid + '/edit');
  } catch (err) {
    console.error('Create product failed', err);
    (req.files || []).forEach((f) => unlinkUpload(f.filename));
    req.session.flash = 'Could not create product. Please try again.';
    res.redirect('/admin/products/new');
  }
});

app.get('/admin/products/:id/edit', requireAuth, (req, res) => {
  const product = loadDesign(req.params.id);
  if (!product) return res.redirect('/admin/products');
  const materials = db.prepare(
    'SELECT * FROM design_materials WHERE design_id = ? AND deleted = 0 ORDER BY sort_order ASC, id ASC'
  ).all(product.id);
  const images = db.prepare(
    'SELECT * FROM design_images WHERE design_id = ? ORDER BY sort_order ASC, id ASC'
  ).all(product.id);
  res.render('admin/product-form', {
    title: 'Edit product | Admin',
    product,
    materials,
    images,
    categories: categoryChoices(),
    isEdit: true,
    layout: false
  });
});

app.put('/admin/products/:id', requireAuth, upload.array('photos', 10), checkCsrfCleanupUploads, validateUploadedImages, (req, res) => {
  const id = req.params.id;
  try {
    const existing = loadDesign(id);
    if (!existing) {
      (req.files || []).forEach((f) => unlinkUpload(f.filename));
      req.session.flash = 'Design not found.';
      return res.redirect('/admin/products');
    }
    const b = req.body;
    if (!String(b.name || '').trim()) {
      (req.files || []).forEach((f) => unlinkUpload(f.filename));
      req.session.flash = 'Name is required.';
      return res.redirect('/admin/products/' + id + '/edit');
    }
    const categoryId = Number(b.category_id) || existing.category_id;
    const category = db.prepare('SELECT id FROM categories WHERE id = ? AND deleted = 0').get(categoryId);
    if (!category) {
      (req.files || []).forEach((f) => unlinkUpload(f.filename));
      req.session.flash = 'Pick a category.';
      return res.redirect('/admin/products/' + id + '/edit');
    }
    const slug = uniqueDesignSlug(categoryId, b.slug ? slugify(b.slug) : slugify(b.name), id);
    db.prepare(`
      UPDATE designs SET
        category_id = ?, slug = ?, name = ?, short_desc = ?, description = ?, applications = ?,
        faq = ?, meta_title = ?, meta_description = ?, meta_keywords = ?, featured = ?, admin_edited = 1
      WHERE id = ?
    `).run(
      categoryId, slug, String(b.name).trim(), String(b.short_desc || '').trim(), String(b.description || '').trim(),
      String(b.applications || '').trim(), buildFaqJson(b), String(b.meta_title || '').trim(),
      String(b.meta_description || '').trim(), String(b.meta_keywords || '').trim(), b.featured ? 1 : 0, id
    );
    saveMaterials(id, b);
    attachDesignPhotos(id, req.files);
    req.session.flash = 'Product saved. This version stays after the next restart.';
    res.redirect('/admin/products/' + id + '/edit');
  } catch (err) {
    console.error('Update product failed', err);
    (req.files || []).forEach((f) => unlinkUpload(f.filename));
    req.session.flash = 'Could not update product. Please try again.';
    res.redirect('/admin/products/' + id + '/edit');
  }
});

app.delete('/admin/products/:id', requireAuth, checkCsrf, (req, res) => {
  const p = db.prepare('SELECT id, slug FROM designs WHERE id = ?').get(req.params.id);
  if (p) {
    const tombstone = p.slug + '-deleted-' + p.id;
    db.prepare('UPDATE designs SET deleted = 1, slug = ? WHERE id = ?').run(tombstone, p.id);
    req.session.flash = 'Design moved to deleted. It will not be recreated on restart.';
  } else {
    req.session.flash = 'Design not found.';
  }
  res.redirect('/admin/products');
});

app.post('/admin/products/:id/restore', requireAuth, checkCsrf, (req, res) => {
  const p = db.prepare('SELECT id, slug, name, category_id FROM designs WHERE id = ?').get(req.params.id);
  if (p) {
    const restoredBase = String(p.slug || '').replace(new RegExp('-deleted-' + p.id + '$'), '') || slugify(p.name);
    const slug = uniqueDesignSlug(p.category_id, restoredBase, p.id);
    db.prepare('UPDATE designs SET deleted = 0, slug = ? WHERE id = ?').run(slug, p.id);
    req.session.flash = 'Design restored.';
  } else {
    req.session.flash = 'Design not found.';
  }
  res.redirect('/admin/products?deleted=1');
});

app.post('/admin/products/:id/permdelete', requireAuth, checkCsrf, (req, res) => {
  const imgs = db.prepare('SELECT filename FROM design_images WHERE design_id = ?').all(req.params.id);
  db.prepare('DELETE FROM design_images WHERE design_id = ?').run(req.params.id);
  imgs.forEach((im) => unlinkIfUnused(im.filename));
  db.prepare('DELETE FROM design_materials WHERE design_id = ?').run(req.params.id);
  db.prepare('DELETE FROM designs WHERE id = ?').run(req.params.id);
  req.session.flash = 'Design permanently deleted.';
  res.redirect('/admin/products?deleted=1');
});

function imageDesignRedirect(img) {
  return '/admin/products/' + (img ? img.design_id : '') + '/edit';
}

app.post('/admin/images/:id', requireAuth, checkCsrf, (req, res) => {
  const img = db.prepare('SELECT * FROM design_images WHERE id = ?').get(req.params.id);
  if (!img) return res.redirect('/admin/products');
  db.prepare('UPDATE design_images SET caption = ?, alt_text = ? WHERE id = ?').run(
    req.body.caption || '', req.body.alt_text || '', img.id
  );
  markDesignEdited(img.design_id);
  res.redirect(imageDesignRedirect(img));
});

app.post('/admin/images/:id/cover', requireAuth, checkCsrf, (req, res) => {
  const img = db.prepare('SELECT * FROM design_images WHERE id = ?').get(req.params.id);
  if (!img) return res.redirect('/admin/products');
  db.prepare('UPDATE design_images SET is_cover = 0 WHERE design_id = ?').run(img.design_id);
  db.prepare('UPDATE design_images SET is_cover = 1 WHERE id = ?').run(img.id);
  markDesignEdited(img.design_id);
  res.redirect(imageDesignRedirect(img));
});

app.post('/admin/images/:id/move', requireAuth, checkCsrf, (req, res) => {
  const dir = req.body.dir || 'up';
  const img = db.prepare('SELECT * FROM design_images WHERE id = ?').get(req.params.id);
  if (!img) return res.redirect('/admin/products');
  const ordered = db.prepare(
    'SELECT * FROM design_images WHERE design_id = ? ORDER BY sort_order ASC, id ASC'
  ).all(img.design_id);
  const idx = ordered.findIndex((o) => o.id === img.id);
  const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
  if (swapIdx >= 0 && swapIdx < ordered.length) {
    const other = ordered[swapIdx];
    db.prepare('UPDATE design_images SET sort_order = ? WHERE id = ?').run(other.sort_order, img.id);
    db.prepare('UPDATE design_images SET sort_order = ? WHERE id = ?').run(img.sort_order, other.id);
    markDesignEdited(img.design_id);
  }
  res.redirect(imageDesignRedirect(img));
});

app.delete('/admin/images/:id', requireAuth, checkCsrf, (req, res) => {
  const img = db.prepare('SELECT * FROM design_images WHERE id = ?').get(req.params.id);
  if (!img) return res.redirect('/admin/products');
  db.prepare('DELETE FROM design_images WHERE id = ?').run(img.id);
  unlinkIfUnused(img.filename);
  markDesignEdited(img.design_id);
  res.redirect(imageDesignRedirect(img));
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
  const status = ENQUIRY_STATUSES.includes(req.query.status) ? req.query.status : '';
  const enquiries = status
    ? db.prepare('SELECT * FROM enquiries WHERE COALESCE(status, \'new\') = ? ORDER BY id DESC').all(status)
    : db.prepare('SELECT * FROM enquiries ORDER BY id DESC').all();
  res.render('admin/enquiries', {
    title: 'Enquiries | Admin',
    enquiries,
    status,
    statuses: ENQUIRY_STATUSES,
    layout: false
  });
});

app.post('/admin/enquiries/:id/status', requireAuth, checkCsrf, (req, res) => {
  const status = ENQUIRY_STATUSES.includes(req.body.status) ? req.body.status : 'new';
  const note = String(req.body.note || '').trim().slice(0, 2000);
  db.prepare('UPDATE enquiries SET status = ?, note = ? WHERE id = ?').run(status, note, req.params.id);
  req.session.flash = 'Enquiry updated.';
  const back = req.body.status_filter && ENQUIRY_STATUSES.includes(req.body.status_filter)
    ? '/admin/enquiries?status=' + req.body.status_filter
    : '/admin/enquiries';
  res.redirect(back);
});

// CSV export of enquiries
app.get('/admin/enquiries.csv', requireAuth, (req, res) => {
  const enquiries = db.prepare('SELECT * FROM enquiries ORDER BY id DESC').all();
  const esc = (v) => {
    const s = (v === null || v === undefined) ? '' : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const header = ['id', 'name', 'phone', 'email', 'product', 'message', 'status', 'note', 'created_at'].join(',');
  const rows = enquiries.map(e => [e.id, e.name, e.phone, e.email, e.product, e.message, e.status || 'new', e.note, e.created_at].map(esc).join(','));
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

app.get('/admin/settings', requireAuth, (req, res) => {
  res.render('admin/settings', { title: 'Password | Admin', layout: false });
});

app.post('/admin/settings/password', requireAuth, checkCsrf, (req, res) => {
  const current = req.body.current_password || '';
  const next = String(req.body.new_password || '');
  const again = String(req.body.confirm_password || '');
  const admin = db.prepare('SELECT * FROM admin WHERE username = ?').get('admin');
  if (!admin || !bcrypt.compareSync(current, admin.password || '')) {
    req.session.flash = 'Current password is wrong.';
    return res.redirect('/admin/settings');
  }
  if (next.length < 8) {
    req.session.flash = 'New password must be at least 8 characters.';
    return res.redirect('/admin/settings');
  }
  if (next !== again) {
    req.session.flash = 'New password and confirmation do not match.';
    return res.redirect('/admin/settings');
  }
  db.prepare('UPDATE admin SET password = ? WHERE id = ?').run(bcrypt.hashSync(next, 10), admin.id);
  req.session.flash = 'Password changed.';
  res.redirect('/admin/settings');
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
