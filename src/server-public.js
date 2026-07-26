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

// Attach primary/cover image URL onto product rows for listing cards (home, /products, related, areas).
function attachCoverImages(products) {
  if (!products || !products.length) return products || [];
  const ids = products.map(p => p.id);
  const placeholders = ids.map(() => '?').join(',');
  const rows = db.prepare(
    `SELECT product_id, filename FROM product_images
     WHERE product_id IN (${placeholders})
     ORDER BY is_cover DESC, sort_order ASC, id ASC`
  ).all(...ids);
  const coverById = {};
  for (const row of rows) {
    if (coverById[row.product_id]) continue;
    if (!existingImages([row]).length) continue;
    coverById[row.product_id] = '/uploads/' + path.basename(row.filename);
  }
  return products.map(p => {
    if (coverById[p.id]) p.image = coverById[p.id];
    return p;
  });
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

// ---------- PUBLIC ROUTES ----------

app.get('/', (req, res) => {
  const products = attachCoverImages(db.prepare('SELECT * FROM products WHERE deleted = 0 ORDER BY featured DESC, name ASC').all());
  const featured = products.filter(p => p.featured);
  const categories = [...new Set(products.map(p => p.category))];
  res.render('home', {
    title: 'Industrial Wire Mesh & Perforated Sheets Supplier in Noida | Garg Industrial Mesh',
    products, featured, categories, page: 'home',
    sent: req.query.sent === '1'
  });
});

app.get('/products', (req, res) => {
  const { material, application, category, q } = req.query;
  let sql = 'SELECT * FROM products WHERE deleted = 0';
  const params = [];
  const qTrim = (q || '').trim();
  if (qTrim) {
    const like = '%' + qTrim + '%';
    sql += ' AND (name LIKE ? OR short_desc LIKE ? OR materials LIKE ? OR applications LIKE ? OR category LIKE ?)';
    params.push(like, like, like, like, like);
  }
  if (material) { sql += ' AND (materials LIKE ? OR category LIKE ?)'; params.push('%' + material + '%', '%' + material + '%'); }
  if (category) { sql += ' AND category = ?'; params.push(category); }
  if (application) { sql += ' AND applications LIKE ?'; params.push('%' + application + '%'); }
  sql += ' ORDER BY featured DESC, name ASC';
  const products = attachCoverImages(db.prepare(sql).all(...params));
  const categories = [...new Set(db.prepare('SELECT DISTINCT category FROM products WHERE deleted = 0').all().map(r => r.category))];
  res.render('products', {
    title: 'All Products — Wire Mesh & Perforated Sheets in Noida | Garg Industrial Mesh',
    products, categories, filters: req.query, page: 'products'
  });
});

app.get('/products/:slug', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE slug = ? AND deleted = 0').get(req.params.slug);
  if (!product) return res.status(404).render('404', { title: 'Product Not Found' });
  let images = db.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY is_cover DESC, sort_order ASC, id ASC').all(product.id);
  images = existingImages(images); // skip any rows whose file is missing on disk
  let faqs = [];
  try { faqs = product.faq ? JSON.parse(product.faq) : []; } catch (e) { faqs = []; }
  const related = attachCoverImages(db.prepare('SELECT * FROM products WHERE category = ? AND id != ? AND deleted = 0 ORDER BY featured DESC LIMIT 4').all(product.category, product.id));
  res.locals.waText = `Hi Garg Industrial Mesh, I'm interested in ${product.name}. Please share price & availability.`;
  res.render('product', { title: product.meta_title || product.name, meta_description: product.meta_description, meta_keywords: product.meta_keywords, product, images, faqs, related, page: 'product', sent: req.query.sent === '1' });
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
  const products = attachCoverImages(db.prepare('SELECT * FROM products WHERE deleted = 0 ORDER BY featured DESC, name ASC').all());
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
  const allProducts = attachCoverImages(db.prepare('SELECT * FROM products WHERE deleted = 0 ORDER BY featured DESC, name ASC').all());
  const wanted = sector.products || [];
  const products = allProducts.filter(p => wanted.includes(p.name));
  const fallback = products.length ? products : allProducts.slice(0, 4);
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
  const products = db.prepare('SELECT slug FROM products WHERE deleted = 0').all();
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
  products.forEach(p => {
    xml += `  <url><loc>${base}/products/${p.slug}</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>\n`;
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
