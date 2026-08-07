const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { imageSize } = require('image-size');

const db = require('./db');
const { run: seedRun } = require('./seed');
const { requireAuth } = require('./middleware/auth');
const { listPosts, findBySlug: findBlogPost } = require('./posts');
const { findByName: findCity } = require('./city-data');
const { sectors: sectorList, findBySlug: findSector, byCity: localitiesByCity, groupedByCity, relatedLocalities } = require('./sector-data');
const { safeRedirectPath } = require('./safe-redirect');
const { createSqliteSessionStore } = require('./session-store');
const { GUIDE_SECTIONS, materialBySlug, buildDesignTech, faqsForDesign } = require('./seed-data');

seedRun();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';
const isDebug = /^(1|true|yes|on)$/i.test(String(process.env.DEBUG || ''));

const siteUrlRaw = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
if (isProd) {
  if (!process.env.SITE_URL || /localhost|127\.0\.0\.1/i.test(siteUrlRaw) || !/^https:\/\//i.test(siteUrlRaw)) {
    console.error('FATAL: In production set SITE_URL to your HTTPS origin (e.g. https://gargindustrialmesh.com).');
    process.exit(1);
  }
  const secret = process.env.SESSION_SECRET || '';
  if (!secret || secret.length < 32 || secret === 'garg-mesh-secret-2026') {
    console.error('FATAL: In production set a strong SESSION_SECRET (min 32 chars). Do not use the documented default.');
    process.exit(1);
  }
}

if (isDebug) {
  console.log('[debug] DEBUG mode ON', {
    NODE_ENV,
    PORT,
    SITE_URL: siteUrlRaw,
    TRUST_PROXY: process.env.TRUST_PROXY || '',
    hasSessionSecret: !!(process.env.SESSION_SECRET),
    hasAdminPassword: !!(process.env.ADMIN_PASSWORD)
  });
}

const sessionSecret = process.env.SESSION_SECRET
  || ('garg-mesh-dev-' + crypto.createHash('sha256').update(__dirname).digest('hex'));
if (!process.env.SESSION_SECRET) {
  console.warn('[auth] SESSION_SECRET unset — using derived local secret (sessions reset if path changes). Set SESSION_SECRET for stable sessions.');
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));
// Needed so secure cookies + rate-limit see the real client IP behind Nginx/Render/etc.
if (isProd || process.env.TRUST_PROXY === '1') {
  app.set('trust proxy', 1);
}

if (isDebug) {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      console.log(`[debug] ${req.method} ${req.originalUrl} → ${res.statusCode} ${Date.now() - start}ms`);
    });
    next();
  });
}

// Security headers (helmet) with a permissive CSP that keeps inline JSON-LD + Google Fonts working.
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://www.googletagmanager.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      fontSrc: ["'self'", 'fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:', 'https://www.googletagmanager.com', 'https://www.google-analytics.com'],
      connectSrc: ["'self'", 'https://www.google-analytics.com', 'https://analytics.google.com', 'https://www.googletagmanager.com', 'https://region1.google-analytics.com'],
      frameSrc: ["'self'", 'https://www.google.com'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

const SqliteStore = createSqliteSessionStore(session, db);
const useSecureCookie = isProd || /^https:\/\//i.test(siteUrlRaw);
app.use(session({
  store: new SqliteStore(),
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 8,
    sameSite: 'strict',
    secure: useSecureCookie,
    httpOnly: true
  }
}));

// CSRF: synchronizer-token pattern. Initialise a per-session token and expose it to all views.
app.use((req, res, next) => {
  if (!req.session.csrfToken) req.session.csrfToken = crypto.randomBytes(16).toString('hex');
  res.locals.csrfToken = req.session.csrfToken;
  next();
});

// CSRF verification middleware — apply to admin mutation routes (POST/PUT/DELETE).
function checkCsrf(req, res, next) {
  const token = (req.body && req.body._csrf) || req.headers['x-csrf-token'];
  if (token && req.session.csrfToken && token === req.session.csrfToken) return next();
  return res.status(403).send('CSRF token mismatch. Please refresh the page and try again.');
}

/** After multer: verify CSRF and delete any uploaded files on failure. */
function checkCsrfCleanupUploads(req, res, next) {
  const token = (req.body && req.body._csrf) || req.headers['x-csrf-token'];
  if (token && req.session.csrfToken && token === req.session.csrfToken) return next();
  const files = Array.isArray(req.files) ? req.files : [];
  files.forEach((f) => {
    try { if (f.path && fs.existsSync(f.path)) fs.unlinkSync(f.path); } catch (e) { /* ignore */ }
  });
  req.files = [];
  return res.status(403).send('CSRF token mismatch. Please refresh the page and try again.');
}

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

function safeUploadPath(filename) {
  const base = path.basename(filename || '');
  if (!base || base === '.' || base === '..') return null;
  const resolved = path.resolve(uploadDir, base);
  const rel = path.relative(path.resolve(uploadDir), resolved);
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return null;
  return resolved;
}

// Helper: filter out product_images whose file no longer exists on disk (prevents broken <img>).
function existingImages(images) {
  return (images || []).filter(img => {
    try {
      const fp = safeUploadPath(img.filename);
      return fp && fs.existsSync(fp);
    } catch (e) { return false; }
  });
}

// Attach primary/cover image URL onto design rows for listing cards.
function attachDesignCovers(designs) {
  if (!designs || !designs.length) return designs || [];
  const ids = designs.map(d => d.id);
  const placeholders = ids.map(() => '?').join(',');
  const rows = db.prepare(
    `SELECT design_id, filename FROM design_images
     WHERE design_id IN (${placeholders})
     ORDER BY is_cover DESC, sort_order ASC, id ASC`
  ).all(...ids);
  const coverById = {};
  for (const row of rows) {
    if (coverById[row.design_id]) continue;
    if (!existingImages([row]).length) continue;
    coverById[row.design_id] = '/uploads/' + path.basename(row.filename);
  }
  return designs.map(d => {
    if (coverById[d.id]) d.image = coverById[d.id];
    return d;
  });
}

/** @deprecated legacy product covers — kept for any leftover callers */
function attachCoverImages(products) {
  return attachDesignCovers(products);
}

// Long-cache immutable static assets (CSS/JS). 1 year.
const oneYear = { maxAge: '1y', immutable: true, fallthrough: true };
app.use('/css', express.static(path.join(__dirname, '..', 'public', 'css'), oneYear));
app.use('/js', express.static(path.join(__dirname, '..', 'public', 'js'), oneYear));
const uploadMime = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
app.use('/uploads', express.static(uploadDir, {
  ...oneYear,
  setHeaders(res, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (uploadMime[ext]) res.setHeader('Content-Type', uploadMime[ext]);
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
}));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rate limiters
const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // 10 submissions per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many enquiries from this IP, please try again later.'
});
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts, please try again later.'
});

const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const MIME_TO_EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const mimeExt = MIME_TO_EXT[file.mimetype];
    const origExt = path.extname(file.originalname || '').toLowerCase();
    if (!mimeExt || !ALLOWED_EXT.has(origExt)) {
      return cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
    if (mimeExt === '.jpg') {
      if (origExt !== '.jpg' && origExt !== '.jpeg') return cb(new Error('File extension does not match image type'));
    } else if (origExt !== mimeExt) {
      return cb(new Error('File extension does not match image type'));
    }
    cb(null, 'prod-' + Date.now() + '-' + Math.round(Math.random() * 1e6) + mimeExt);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpe?g|png|webp)$/.test(file.mimetype) && ALLOWED_EXT.has(path.extname(file.originalname || '').toLowerCase())) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

/** Drop uploads that fail magic-byte / dimension checks (real image parse). */
function validateUploadedImages(req, res, next) {
  const files = Array.isArray(req.files) ? req.files : [];
  const kept = [];
  for (const f of files) {
    const fp = f.path || safeUploadPath(f.filename);
    try {
      const buf = fs.readFileSync(fp);
      const d = imageSize(buf);
      if (d && d.width && d.height) {
        kept.push(f);
      } else {
        try { fs.unlinkSync(fp); } catch (e) { /* ignore */ }
      }
    } catch (e) {
      try { if (fp) fs.unlinkSync(fp); } catch (e2) { /* ignore */ }
    }
  }
  req.files = kept;
  next();
}

// Safe JSON-LD for <script> embedding (escapes </script> breakouts)
app.locals.safeJsonLd = function safeJsonLd(obj) {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
};

// Site-wide config available to all views
app.use((req, res, next) => {
  const gstRaw = (process.env.GST_NUMBER || '').trim();
  // Accept either bare GSTIN or a value already prefixed with "GSTIN:"
  const gstNumber = gstRaw.replace(/^GSTIN:\s*/i, '').trim();
  res.locals.site = {
    name: 'GARG INDUSTRIAL MESH',
    phone: '9910238277',
    whatsapp: '919910238277',
    address: 'G-25, G Block, Sector 9, Noida, Uttar Pradesh 201301',
    gstNumber, // empty when unset — views show "GST Verified" badge only
    gstLabel: gstNumber ? ('GSTIN: ' + gstNumber) : '',
    gstVerified: true,
    domain: 'gargindustrialmesh.com',
    url: siteUrlRaw,
    hours: 'Mon–Sat, 9:30 AM – 7:30 PM',
    year: new Date().getFullYear(),
    gaId: (process.env.GA_MEASUREMENT_ID || '').trim(),
    googleReviewUrl: 'https://www.google.com/search?q=GARG+INDUSTRIAL+MESH+G-25+Sector+9+Noida+reviews'
  };
  // Default WhatsApp prefill; product/blog/locality pages override via res.locals.waText
  res.locals.waText = 'Hi Garg Industrial Mesh, I would like to know more about your products.';
  res.locals.path = req.path;
  res.locals.isAdmin = !!(req.session && req.session.isAdmin);
  res.locals.flash = req.session.flash || null;
  req.session.flash = null;
  next();
});

function waLink(productName) {
  const msg = `Hi Garg Industrial Mesh, I'm interested in ${productName}. Please share price & availability.`;
  return 'https://wa.me/919910238277?text=' + encodeURIComponent(msg);
}
app.locals.waLink = waLink;
app.locals.slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const MATERIAL_PILL = {
  'mild-steel': 'MS',
  gi: 'GI',
  'stainless-steel': 'SS',
  aluminium: 'Al',
  copper: 'Copper',
  brass: 'Brass',
  'ss-304': 'SS 304',
  'ss-201': 'SS 201',
  'ss-202': 'SS 202',
  polycarbonate: 'PC',
  'nylon-net': 'Net',
  'pvc-hdpe': 'PVC'
};

function enrichCategories(categories) {
  categories.forEach((cat) => {
    const d = attachDesignCovers(db.prepare(
      'SELECT * FROM designs WHERE category_id = ? AND deleted = 0 ORDER BY featured DESC, sort_order ASC LIMIT 1'
    ).all(cat.id))[0];
    if (d && d.image) cat.image = d.image;
    cat.design_count = db.prepare(
      'SELECT COUNT(*) AS c FROM designs WHERE category_id = ? AND deleted = 0'
    ).get(cat.id).c;
    const mats = db.prepare(`
      SELECT DISTINCT m.slug, m.name, MIN(m.sort_order) AS sort_order
      FROM design_materials m
      JOIN designs d ON d.id = m.design_id
      WHERE d.category_id = ? AND d.deleted = 0 AND m.deleted = 0
      GROUP BY m.slug, m.name
      ORDER BY sort_order ASC, m.name ASC
    `).all(cat.id);
    cat.materials = mats.map((m) => ({
      slug: m.slug,
      name: m.name,
      label: MATERIAL_PILL[m.slug] || m.name
    }));
  });
  return categories;
}

// ---------- PUBLIC ROUTES ----------

app.get('/', (req, res) => {
  const categories = enrichCategories(db.prepare(
    'SELECT * FROM categories WHERE deleted = 0 ORDER BY featured DESC, sort_order ASC, name ASC'
  ).all());
  // Featured = product types (categories), never individual designs
  const featured = categories.filter((c) => c.featured).slice(0, 8);
  const featuredTypes = featured.length ? featured : categories.slice(0, 8);
  res.render('home', {
    title: 'Industrial Wire Mesh & Perforated Sheets Supplier in Noida | Garg Industrial Mesh',
    products: featuredTypes, featured: featuredTypes, categories, page: 'home',
    sent: req.query.sent === '1'
  });
});

app.get('/products', (req, res) => {
  const categories = enrichCategories(db.prepare(
    'SELECT * FROM categories WHERE deleted = 0 ORDER BY featured DESC, sort_order ASC, name ASC'
  ).all());
  res.render('products', {
    title: 'Step 1: Choose sheet type | Garg Industrial Mesh',
    categories, page: 'products'
  });
});

app.get('/products/:categorySlug', (req, res) => {
  const category = db.prepare(
    'SELECT * FROM categories WHERE slug = ? AND deleted = 0'
  ).get(req.params.categorySlug);
  if (!category) return res.status(404).render('404', { title: 'Category Not Found' });

  const shape = (req.query.shape || '').trim();
  let sql = 'SELECT * FROM designs WHERE category_id = ? AND deleted = 0';
  const params = [category.id];
  if (category.slug === 'perforated-sheets') {
    if (shape === 'round-60') { sql += ' AND hole_shape = ? AND angle_deg = 60'; params.push('Round'); }
    else if (shape === 'round-90') { sql += ' AND hole_shape = ? AND angle_deg = 90'; params.push('Round'); }
    else if (shape === 'square') { sql += ' AND hole_shape = ?'; params.push('Square'); }
    else if (shape === 'hex') { sql += " AND hole_shape LIKE 'Hex%'"; }
  } else if (category.slug === 'ss-welded-mesh') {
    if (shape === 'square') { sql += ' AND hole_shape = ?'; params.push('Square'); }
    else if (shape === 'rect' || shape === 'rectangular') { sql += ' AND hole_shape = ?'; params.push('Rectangular'); }
  }
  sql += ' ORDER BY sort_order ASC, name ASC';

  const designs = attachDesignCovers(db.prepare(sql).all(...params));
  designs.forEach((d) => {
    const mats = db.prepare(
      'SELECT slug, name FROM design_materials WHERE design_id = ? AND deleted = 0 ORDER BY sort_order ASC, name ASC'
    ).all(d.id);
    d.materials = mats.map((m) => ({
      slug: m.slug,
      name: m.name,
      label: MATERIAL_PILL[m.slug] || m.name
    }));
  });

  let guideSections = [];
  try { guideSections = category.guide_sections ? JSON.parse(category.guide_sections) : []; } catch (e) { guideSections = []; }

  res.locals.waText = `Hi Garg Industrial Mesh, I need ${category.name}. Please share patterns, materials & pricing.`;
  res.render('category', {
    title: category.meta_title || `Step 2: Choose design — ${category.name} | Garg Industrial Mesh`,
    meta_description: category.meta_description || `Step 2: pick a ${category.name} option, then choose material.`,
    meta_keywords: category.meta_keywords,
    category, designs, shape, guideSections, page: 'products'
  });
});

app.get('/products/:categorySlug/:designSlug', (req, res) => {
  const category = db.prepare(
    'SELECT * FROM categories WHERE slug = ? AND deleted = 0'
  ).get(req.params.categorySlug);
  if (!category) return res.status(404).render('404', { title: 'Category Not Found' });

  const design = db.prepare(
    'SELECT * FROM designs WHERE category_id = ? AND slug = ? AND deleted = 0'
  ).get(category.id, req.params.designSlug);
  if (!design) return res.status(404).render('404', { title: 'Design Not Found' });

  const materials = db.prepare(
    'SELECT * FROM design_materials WHERE design_id = ? AND deleted = 0 ORDER BY sort_order ASC, name ASC'
  ).all(design.id);

  let selected = materials.find(m => m.slug === req.query.material) || materials[0] || null;

  let images = db.prepare(
    'SELECT * FROM design_images WHERE design_id = ? ORDER BY is_cover DESC, sort_order ASC, id ASC'
  ).all(design.id);
  images = existingImages(images);

  // Prefer images tagged for selected material, else cover/generic
  let displayImages = images;
  if (selected) {
    const matImgs = images.filter(i => i.material_slug === selected.slug);
    if (matImgs.length) displayImages = matImgs;
  }

  const label = selected ? `${design.name} — ${selected.name}` : design.name;
  const tech = buildDesignTech(design, category);
  const materialInfo = selected ? (materialBySlug(selected.slug) || selected) : null;
  const faqs = faqsForDesign(design);
  let guideSections = [];
  try { guideSections = category.guide_sections ? JSON.parse(category.guide_sections) : []; } catch (e) { guideSections = []; }
  if (category.slug === 'perforated-sheets' && (!guideSections || !guideSections.length)) {
    guideSections = GUIDE_SECTIONS;
  }

  res.locals.waText = `Hi Garg Industrial Mesh, I'm interested in ${label}. Please share price & availability.`;
  res.render('design', {
    title: design.meta_title || `Step 3: Choose material — ${design.name} | Garg Industrial Mesh`,
    meta_description: design.meta_description || `Step 3: choose material for ${design.name}.`,
    meta_keywords: design.meta_keywords,
    category, design, materials, selected, images: displayImages,
    tech, materialInfo, guideSections, faqs,
    page: 'product', sent: req.query.sent === '1'
  });
});

app.get('/areas', (req, res) => {
  const cities = ['Noida', 'Greater Noida', 'Delhi', 'Ghaziabad', 'Faridabad', 'Gurugram'];
  res.render('areas', {
    title: 'Areas We Serve — Noida, Greater Noida, Delhi NCR | Garg Industrial Mesh',
    cities,
    localityGroups: groupedByCity(),
    page: 'areas'
  });
});

app.get('/areas/:city', (req, res) => {
  const cityData = findCity(req.params.city.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())) ||
    (function () {
      const map = { 'noida':'Noida','greater-noida':'Greater Noida','delhi':'Delhi','ghaziabad':'Ghaziabad','faridabad':'Faridabad','gurugram':'Gurugram' };
      const name = map[req.params.city];
      return name ? findCity(name) : null;
    })();
  if (!cityData) return res.status(404).render('404', { title: 'Area Not Found' });
  const products = attachDesignCovers(db.prepare(`
    SELECT d.*, c.slug AS category_slug, c.name AS category_name
    FROM designs d JOIN categories c ON c.id = d.category_id
    WHERE d.deleted = 0 AND c.deleted = 0
    ORDER BY d.featured DESC, d.sort_order ASC LIMIT 8
  `).all());
  const localities = localitiesByCity(cityData.slug);
  const city = cityData.slug === 'greater-noida' ? 'Greater Noida' : (cityData.slug.charAt(0).toUpperCase()+cityData.slug.slice(1));
  const breadcrumb = {
    "@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item":res.locals.site.url},
      {"@type":"ListItem","position":2,"name":"Areas We Serve","item":res.locals.site.url+"/areas"},
      {"@type":"ListItem","position":3,"name":city,"item":res.locals.site.url+"/areas/"+cityData.slug}
    ]
  };
  const localBusiness = {
    "@context":"https://schema.org","@type":"HardwareStore",
    "name":"GARG INDUSTRIAL MESH","telephone":"+91"+res.locals.site.phone,
    "address":{"@type":"PostalAddress","streetAddress":"G-25, G Block, Sector 9","addressLocality":"Noida","addressRegion":"Uttar Pradesh","postalCode":"201301","addressCountry":"IN"},
    "url":res.locals.site.url,"areaServed":city,
    "openingHours":"Mo-Sa 09:30-19:30","priceRange":"₹₹"
  };
  const faqLd = cityData.faq.length ? {"@context":"https://schema.org","@type":"FAQPage","mainEntity":cityData.faq.map(f=>({"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}))} : null;
  const extraLd = faqLd ? [breadcrumb, localBusiness, faqLd] : [breadcrumb, localBusiness];
  res.locals.waText = `Hi Garg Industrial Mesh, I need wire mesh in ${city}. Please share price & availability.`;
  res.render('area', {
    title: `Wire Mesh & Perforated Sheet Supplier in ${city} | Garg Industrial Mesh`,
    meta_description: `Wire mesh, perforated sheet, welded mesh, chain link fence, bird & monkey spikes supplier in ${city}. Garg Industrial Mesh delivers across ${city} and Delhi NCR. Get a quote.`,
    city, cityData, products, localities, extraLd, page: 'area',
    sent: req.query.sent === '1'
  });
});

app.get('/sectors/:slug', (req, res) => {
  const sector = findSector(req.params.slug);
  if (!sector) return res.status(404).render('404', { title: 'Locality Not Found' });
  const allProducts = attachDesignCovers(db.prepare(`
    SELECT d.*, c.slug AS category_slug, c.name AS category_name
    FROM designs d JOIN categories c ON c.id = d.category_id
    WHERE d.deleted = 0 AND c.deleted = 0
    ORDER BY d.featured DESC, d.sort_order ASC LIMIT 8
  `).all());
  const fallback = allProducts.slice(0, 4);
  const related = relatedLocalities(sector);
  const locName = sector.locality || sector.sector;
  const breadcrumb = {
    "@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item":res.locals.site.url},
      {"@type":"ListItem","position":2,"name":"Areas We Serve","item":res.locals.site.url+"/areas"},
      {"@type":"ListItem","position":3,"name":sector.city,"item":res.locals.site.url+"/areas/"+sector.citySlug},
      {"@type":"ListItem","position":4,"name":locName,"item":res.locals.site.url+"/sectors/"+sector.slug}
    ]
  };
  const localBusiness = {
    "@context":"https://schema.org","@type":"HardwareStore",
    "name":"GARG INDUSTRIAL MESH","telephone":"+91"+res.locals.site.phone,
    "address":{"@type":"PostalAddress","streetAddress":"G-25, G Block, Sector 9","addressLocality":"Noida","addressRegion":"Uttar Pradesh","postalCode":"201301","addressCountry":"IN"},
    "url":res.locals.site.url,
    "areaServed":[locName, sector.city, "Delhi NCR"],
    "openingHours":"Mo-Sa 09:30-19:30","priceRange":"₹₹"
  };
  const faqLd = sector.faq && sector.faq.length ? {"@context":"https://schema.org","@type":"FAQPage","mainEntity":sector.faq.map(f=>({"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}))} : null;
  const extraLd = faqLd ? [breadcrumb, localBusiness, faqLd] : [breadcrumb, localBusiness];
  const metaDesc = sector.meta_description || `Wire mesh, perforated sheet, welded mesh & fencing supplier in ${locName}, ${sector.city}. Garg Industrial Mesh delivers across ${locName}. Get a quote.`;
  res.locals.waText = `Hi Garg Industrial Mesh, I need wire mesh in ${locName}, ${sector.city}. Please share price & availability.`;
  res.render('sector', {
    title: sector.title + ' | Garg Industrial Mesh',
    meta_description: metaDesc.length > 155 ? metaDesc.slice(0, 152) + '…' : metaDesc,
    sector, products: fallback, related, extraLd, page: 'sector',
    sent: req.query.sent === '1'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Us — Trusted Mesh Manufacturer in Noida | Garg Industrial Mesh',
    page: 'about',
    sent: req.query.sent === '1'
  });
});

app.get('/contact', (req, res) => {
  const contactLd = {
    "@context":"https://schema.org","@type":"ContactPage",
    "name":"Contact Garg Industrial Mesh",
    "description":"Contact Garg Industrial Mesh — wire mesh & perforated sheet supplier in Noida. Call 9910238277 or WhatsApp for a quote.",
    "url":res.locals.site.url+"/contact",
    "mainEntity":{
      "@type":"LocalBusiness",
      "name":"GARG INDUSTRIAL MESH",
      "telephone":"+91"+res.locals.site.phone,
      "email":"info@gargindustrialmesh.com",
      "address":{"@type":"PostalAddress","streetAddress":"G-25, G Block, Sector 9","addressLocality":"Noida","addressRegion":"Uttar Pradesh","postalCode":"201301","addressCountry":"IN"},
      "openingHours":"Mo-Sa 09:30-19:30",
      "url":res.locals.site.url
    }
  };
  res.render('contact', { title: 'Contact Us — Garg Industrial Mesh, Noida', page: 'contact', extraLd: [contactLd], sent: req.query.sent === '1' });
});

app.get('/blog', (req, res) => {
  const perPage = 9;
  const currentPage = Math.max(1, parseInt(req.query.page, 10) || 1);
  const all = listPosts({ includeDeleted: false });
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pagePosts = all.slice((currentPage - 1) * perPage, currentPage * perPage);
  res.render('blog', {
    title: 'Blog — Mesh Guides & Tips | Garg Industrial Mesh',
    posts: pagePosts,
    currentPage,
    totalPages,
    total,
    page: 'blog'
  });
});

app.get('/blog/:slug', (req, res) => {
  const post = findBlogPost(req.params.slug);
  if (!post) return res.status(404).render('404', { title: 'Blog Post Not Found' });
  const related = listPosts({ includeDeleted: false }).filter(p => p.slug !== post.slug).slice(0, 3);
  const { renderBody } = require('./blog-render');
  const bodyHtml = renderBody(post.body || []);
  const breadcrumb = {
    "@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item":res.locals.site.url},
      {"@type":"ListItem","position":2,"name":"Blog","item":res.locals.site.url+"/blog"},
      {"@type":"ListItem","position":3,"name":post.title,"item":res.locals.site.url+"/blog/"+post.slug}
    ]
  };
  const articleLd = {
    "@context":"https://schema.org","@type":"Article",
    "headline":post.title,"description":post.excerpt,
    "url":res.locals.site.url+"/blog/"+post.slug,
    "author":{"@type":"Organization","name":post.author || "Garg Industrial Mesh Team"},
    "publisher":{"@type":"Organization","name":"GARG INDUSTRIAL MESH","logo":{"@type":"ImageObject","url":res.locals.site.url+"/logo.png"}}
  };
  const faqLd = (post.faq && post.faq.length) ? {"@context":"https://schema.org","@type":"FAQPage","mainEntity":post.faq.map(f=>({"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}))} : null;
  const extraLd = faqLd ? [breadcrumb, articleLd, faqLd] : [breadcrumb, articleLd];
  res.locals.waText = `Hi Garg Industrial Mesh, I just read your article "${post.title}" and would like a quote.`;
  res.render('post', {
    title: post.title + ' | Garg Industrial Mesh Blog',
    meta_description: post.meta_description,
    meta_keywords: post.meta_keywords,
    post, related, bodyHtml,
    extraLd, page: 'post'
  });
});

// Enquiry submission (public) — honeypot + CSRF + rate limit + safe redirect
app.post('/enquiry', enquiryLimiter, (req, res) => {
  const redirectTo = safeRedirectPath(req.body && req.body.redirect, '/contact?sent=1');

  // Soft CSRF first (never redirect to attacker-controlled URL before checks)
  const token = (req.body && req.body._csrf) || '';
  if (!token || !req.session.csrfToken || token !== req.session.csrfToken) {
    return res.status(403).send('Session expired. Please go back, refresh the page, and try again.');
  }

  // Honeypot: bots fill hidden "company_website"; humans never see it
  if ((req.body.company_website || '').trim()) {
    return res.redirect(redirectTo);
  }

  const name = String(req.body.name || '').trim().slice(0, 120);
  const phone = String(req.body.phone || '').trim().slice(0, 40);
  const email = String(req.body.email || '').trim().slice(0, 120);
  const product = String(req.body.product || '').trim().slice(0, 200);
  const message = String(req.body.message || '').trim().slice(0, 2000);
  if (!name || !phone) {
    return res.redirect(redirectTo);
  }
  db.prepare('INSERT INTO enquiries (name, phone, email, product, message) VALUES (?,?,?,?,?)')
    .run(name, phone, email, product, message);
  res.redirect(redirectTo);
});

// sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  res.set('Content-Type', 'application/xml');
  const base = res.locals.site.url;
  const categories = db.prepare('SELECT slug FROM categories WHERE deleted = 0').all();
  const designs = db.prepare(`
    SELECT d.slug AS design_slug, c.slug AS category_slug
    FROM designs d JOIN categories c ON c.id = d.category_id
    WHERE d.deleted = 0 AND c.deleted = 0
  `).all();
  const cities = ['noida', 'greater-noida', 'delhi', 'ghaziabad', 'faridabad', 'gurugram'];
  const sectorSlugs = sectorList.map(s => s.slug);
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const staticPages = ['', '/products', '/areas', '/about', '/contact', '/blog'];
  staticPages.forEach(p => {
    xml += `  <url><loc>${base}${p}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
  });
  try {
    listPosts({ includeDeleted: false }).forEach(p => {
      xml += `  <url><loc>${base}/blog/${p.slug}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n`;
    });
  } catch (e) {}
  categories.forEach(c => {
    xml += `  <url><loc>${base}/products/${c.slug}</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>\n`;
  });
  designs.forEach(d => {
    xml += `  <url><loc>${base}/products/${d.category_slug}/${d.design_slug}</loc><changefreq>weekly</changefreq><priority>0.85</priority></url>\n`;
  });
  cities.forEach(c => {
    xml += `  <url><loc>${base}/areas/${c}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>\n`;
  });
  sectorSlugs.forEach(s => {
    xml += `  <url><loc>${base}/sectors/${s}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n`;
  });
  xml += '</urlset>';
  res.send(xml);
});

app.get('/robots.txt', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ' + res.locals.site.url + '/sitemap.xml\n');
});

module.exports = {
  app, upload, db, requireAuth, PORT, loginLimiter, checkCsrf, checkCsrfCleanupUploads,
  validateUploadedImages, existingImages, safeUploadPath, safeRedirectPath
};
