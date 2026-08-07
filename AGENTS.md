# AGENTS.md — Garg Industrial Mesh

> **Audience:** LLMs / coding agents working in this repo.  
> **Purpose:** Single indexed source of truth for architecture, files, data flows, conventions, and safe-change guidance.  
> **Stack:** Node.js · Express · EJS · better-sqlite3 · vanilla JS/CSS · Multer · Helmet · express-session

---

## 0. Index (jump table)

| § | Topic |
|---|--------|
| [1](#1-product-purpose) | Product & business purpose |
| [2](#2-tech-stack--runtime) | Tech stack & runtime |
| [3](#3-repository-layout) | Repository layout |
| [4](#4-boot-sequence) | Boot sequence & module graph |
| [5](#5-database-schema) | Database schema & migrations |
| [6](#6-seeding) | Product seeding |
| [7](#7-public-routes) | Public HTTP routes |
| [8](#8-admin-routes) | Admin HTTP routes |
| [9](#9-seo--local-pages) | SEO, city & sector pages |
| [10](#10-blog-system) | Blog system |
| [11](#11-views--partials) | Views & partials |
| [12](#12-frontend-assets) | Frontend assets (CSS/JS) |
| [13](#13-security) | Security model |
| [14](#14-env-vars) | Environment variables |
| [15](#15-scripts) | Utility scripts |
| [16](#16-conventions) | Coding conventions for agents |
| [17](#17-common-tasks) | Common change recipes |
| [18](#18-gotchas) | Gotchas & non-obvious rules |
| [19](#19-glossary) | Glossary |

---

## 1. Product & purpose

**Garg Industrial Mesh** is a Noida-based supplier of industrial wire mesh, perforated sheets, welded mesh, fencing, bird/monkey spikes, and related products, serving Delhi NCR.

This repo is their **production marketing + lead-gen website**:

- Server-rendered pages optimized for Google (canonical URLs, sitemap, JSON-LD, FAQ schema, locality landing pages).
- Product catalog stored in SQLite, editable via a password-protected admin portal.
- Enquiry form → SQLite inbox (with CSV export).
- WhatsApp deep links (`wa.me/919910238277`) on product/locality/blog pages.
- No React/Next/SPA — pure Express + EJS for crawlability and simplicity.

**Suggested production domain:** `gargindustrialmesh.com`  
**Shop:** G-25, G Block, Sector 9, Noida, UP 201301 · Phone/WhatsApp: `9910238277`

---

## 2. Tech stack & runtime

| Layer | Choice | Notes |
|-------|--------|--------|
| Runtime | Node.js (CommonJS `require`) | No TypeScript, no bundler for server |
| HTTP | Express 4 | Single process |
| Templates | EJS | `views/`, shared partials |
| DB | better-sqlite3 | File DB at `data/garg.db`, WAL mode |
| Auth | express-session + bcryptjs | Session flag `req.session.isAdmin` |
| Uploads | Multer | → `public/uploads/`, jpeg/png/webp, max 3MB |
| Security | Helmet, CSRF tokens, rate-limit, honeypot | See §13 |
| Frontend | Vanilla JS + one CSS file | No framework |
| Method override | `method-override` | Forms send `_method=PUT\|DELETE` |

**Start:**

```bash
npm install
npm start          # node src/server.js → http://localhost:3000
```

There is no separate `dev` watcher; `dev` and `start` are the same script.

---

## 3. Repository layout

```
garg mesh/
├── AGENTS.md                 ← this file
├── README.md                 ← human-facing ops/SEO deploy notes
├── package.json
├── data/
│   ├── garg.db               ← live SQLite (created/migrated on boot)
│   ├── garg.db-wal / -shm    ← WAL sidecars
│   └── site.db               ← unused leftover (empty); ignore
├── src/
│   ├── server.js             ← entry: requires server-admin
│   ├── server-public.js      ← Express app, middleware, PUBLIC routes, exports app
│   ├── server-admin.js       ← ADMIN routes + app.listen()
│   ├── db.js                 ← schema, column migrations, default admin user
│   ├── seed.js               ← seed runner (idempotent)
│   ├── seed-data.js          ← product catalog seed objects + buildFaq()
│   ├── city-data.js          ← 6 city landing page payloads
│   ├── sector-data.js        ← hyperlocal locality pages (/sectors/:slug)
│   ├── blog-data.js          ← aggregates src/blog/p01..p25
│   ├── blog-render.js        ← lightweight markdown-ish → HTML
│   ├── blog/p01.js … p25.js  ← one post per file
│   └── middleware/auth.js    ← requireAuth
├── views/
│   ├── home.ejs, products.ejs, product.ejs, about.ejs, contact.ejs,
│   │   areas.ejs, area.ejs, sector.ejs, blog.ejs, post.ejs, 404.ejs
│   ├── admin/                ← login, dashboard, products, product-form, enquiries
│   └── partials/             ← _head, _header, _footer, _stickybar, _productcard, …
├── public/
│   ├── css/style.css
│   ├── js/main.js
│   ├── uploads/              ← product images (served statically)
│   ├── images/, gallery-*.jpg, logos, favicon
│   └── …
├── scripts/                  ← one-off image/import/audit helpers (not part of boot)
├── audit-screenshots/        ← generated audit artifacts
└── .review-shots/            ← review artifacts
```

**Mental model:** `server-public.js` builds the app and public surface; `server-admin.js` attaches admin CRUD and starts listening. Data for SEO locality pages lives in JS modules (not DB). Catalog + enquiries live in SQLite.

---

## 4. Boot sequence

```
npm start
  → src/server.js
      → require('./server-admin')
          → require('./server-public')   // side effects: create app, seed, wire public routes
          → attach admin routes
          → app.listen(PORT)
```

### What `server-public.js` does on load

1. `require('./db')` — opens/creates DB, runs `CREATE TABLE IF NOT EXISTS`, additive `ALTER TABLE` migrations, ensures admin user exists.
2. `seedRun()` from `seed.js` — if products empty, insert seed catalog; else repair/ensure missing products.
3. Configure Express: view engine EJS, Helmet CSP, body parsers, method-override, session, CSRF locals, static files, rate limiters, Multer, `res.locals.site`.
4. Register all **public** routes + `/sitemap.xml` + `/robots.txt`.
5. Export `{ app, upload, db, requireAuth, PORT, loginLimiter, checkCsrf, existingImages }`.

### What `server-admin.js` does

1. Destructure exports from `server-public`.
2. Register `/admin/*` routes (login, products CRUD, images, enquiries).
3. Register catch-all 404.
4. `app.listen(PORT)`.

**Do not** move `app.listen` into `server-public.js` without updating the entry split — the split exists so admin and public stay in separate files while sharing one `app`.

---

## 5. Database schema

File: `data/garg.db` · Access: `src/db.js` (singleton export).

### Tables

#### Catalog (Category → Design → Material)

Live catalogue uses:

| Table | Role |
|-------|------|
| `categories` | e.g. Perforated Sheets — `guide_sections` JSON for buying-guide accordions |
| `designs` | Patterns Perforated 01–29 — `hole_shape`, `hole_mm`, `pitch_mm`, `angle_deg`, `open_area_pct` |
| `design_materials` | MS / GI / SS / Aluminium / Copper / Brass per design — `price_from`, `grades` |
| `design_images` | Pattern photos; optional `material_slug` for material-specific renders |

Public URLs: `/products` → `/products/:categorySlug` → `/products/:categorySlug/:designSlug?material=`.

Seed source: `src/seed-data.js` + images from `PERFORATED SHEET/` via `src/seed-images.js`.

Legacy `products` / `product_images` tables may still exist empty; public/admin catalogue no longer uses them.

#### `enquiries`

| Column | Type |
|--------|------|
| id | INTEGER PK |
| name, phone, email, product, message | TEXT |
| created_at | TEXT |

#### `admin`

| Column | Type |
|--------|------|
| id | INTEGER PK |
| username | TEXT UNIQUE | default `admin` |
| password | TEXT | bcrypt hash (`$2…`) |

Admin password: set via `ADMIN_PASSWORD` env (min 8), or a one-time random password is logged on fresh install. Known published defaults are warned/rotated when `ADMIN_PASSWORD` is set. Agents must **not** weaken hashing or reintroduce plaintext/published default passwords.

### Migrations style

There is no migration framework. `db.js` uses `addColumnIfMissing(table, column, def)` via `PRAGMA table_info`. **Always add new columns this way** so existing installs keep working.

---

## 6. Seeding

| File | Role |
|------|------|
| `src/seed-data.js` | Array of product objects + `buildFaq(p)` + `slugify` |
| `src/seed.js` | Runner: empty → full insert; non-empty → `repairSsWeldedMesh()` + `ensureMissingProducts()` |

**Slug rule:** `slugify(name)` → lowercase, non-alnum → `-`, trim edges. Seed insert uses name-derived slug.

**FAQ seed:** `buildFaq` generates 5 standard Q&As from product fields and stores `JSON.stringify(faq)` in `products.faq`. Admin FAQ repeater can overwrite this.

**Repair path:** If `ss-welded-mesh` content looks corrupted (short description/meta), seed restores from `seed-data.js`. Do not remove this unless the bug is permanently fixed elsewhere.

**Images:** files live under `public/uploads/` (committed to git). On every boot, `src/seed-images.js` (called from `seed.js`) links existing files to products in `product_images` (idempotent). Docker entrypoint syncs bundled uploads into the writable volume. Admin can still upload more via the portal.

---

## 7. Public routes

Defined in `src/server-public.js`.

| Method | Path | View / behavior |
|--------|------|-----------------|
| GET | `/` | `home` — all live products, featured subset, categories |
| GET | `/products` | `products` — filters: `?category=&material=&application=` |
| GET | `/products/:slug` | `product` — images, parsed FAQ, related (same category) |
| GET | `/areas` | `areas` — city list + locality groups |
| GET | `/areas/:city` | `area` — city landing from `city-data.js` + JSON-LD |
| GET | `/sectors/:slug` | `sector` — locality from `sector-data.js` + JSON-LD |
| GET | `/about` | `about` |
| GET | `/contact` | `contact` — ContactPage schema |
| GET | `/blog` | `blog` — paginated (9/page) |
| GET | `/blog/:slug` | `post` — `blog-render.renderBody` |
| POST | `/enquiry` | Insert enquiry; honeypot + CSRF + rate limit (10/15min) |
| GET | `/sitemap.xml` | Dynamic XML: static + blog + products + cities + sectors |
| GET | `/robots.txt` | Allow `/`, Disallow `/admin`, Sitemap URL |

### Enquiry flow

1. Forms include hidden `_csrf` (from `res.locals.csrfToken`) and honeypot `company_website`.
2. If honeypot filled → silent redirect (bot trap).
3. CSRF mismatch → 403.
4. Require non-empty `name` + `phone`.
5. Insert into `enquiries`; redirect to `req.body.redirect` or `/contact?sent=1`.

### Site locals (every request)

`res.locals.site` includes: name, phone, whatsapp, address, gst fields, domain, canonical `url` from `SITE_URL`, hours, year, `gaId`, Google review URL.  
`res.locals.waText` defaults globally; product/area/sector/blog routes override for contextual WhatsApp prefills.  
`app.locals.waLink(productName)` builds a product-specific `wa.me` URL.

---

## 8. Admin routes

Defined in `src/server-admin.js`. All mutating routes use `requireAuth` + `checkCsrf` (login POST also rate-limited).

| Method | Path | Purpose |
|--------|------|---------|
| GET/POST | `/admin/login` | Session login (`isAdmin=true`) |
| GET | `/admin/logout` | Destroy session |
| GET | `/admin/dashboard` | Counts + recent enquiries |
| GET | `/admin/products` | List; `?q=&category=&deleted=1` |
| GET | `/admin/products/new` | Create form |
| POST | `/admin/products` | Create + optional multi-upload |
| GET | `/admin/products/:id/edit` | Edit form |
| PUT | `/admin/products/:id` | Update + optional uploads |
| POST | `/admin/products/:id/duplicate` | Clone as draft (new slug `-copy`) |
| POST | `/admin/products/:id/price` | Quick price update |
| DELETE | `/admin/products/:id` | Soft-delete (`deleted=1`) |
| POST | `/admin/products/:id/restore` | Soft-restore |
| POST | `/admin/products/:id/permdelete` | Hard delete + unlink image files |
| POST | `/admin/images/:id` | Caption + alt |
| POST | `/admin/images/:id/cover` | Set cover (clears others) |
| POST | `/admin/images/:id/move` | Swap sort_order up/down |
| DELETE | `/admin/images/:id` | Delete file + row |
| GET | `/admin/enquiries` | Inbox |
| GET | `/admin/enquiries.csv` | CSV export |
| POST | `/admin/enquiries/bulk` | Bulk delete by checkbox ids |
| DELETE | `/admin/enquiries/:id` | Single delete |

Admin views pass `layout: false` (standalone admin chrome, not public header/footer).

**Slug uniqueness:** create/update loops append `-1`, `-2`, … until unique.

**FAQ from form:** `buildFaqJson(body)` pairs `faq_q[]` / `faq_a[]` into JSON.

**Uploads:** field name `photos`, max 10 files; first image becomes cover if none exists; dimensions stored via `image-size`.

---

## 9. SEO & local pages

This site’s SEO strategy is **content volume + uniqueness** for Delhi NCR geo queries.

### City pages (`src/city-data.js`)

Six cities: Noida, Greater Noida, Delhi, Ghaziabad, Faridabad, Gurugram.  
Each has: `slug`, `intro`, `sectors`, `landmarks`, `delivery`, `faq[]`.  
Helpers: `findByName`, `findBySlug`, `slugify`.

Route `/areas/:city` resolves slug (hyphenated) → city object, attaches products + localities from `sector-data`, emits BreadcrumbList + HardwareStore + FAQPage JSON-LD via `extraLd`.

### Sector / locality pages (`src/sector-data.js`)

Large static array `sectors` of hyperlocal landings. URL remains `/sectors/:slug` (historical Noida sector URLs preserved).

Typical object shape:

```js
{
  slug: 'sector-62-noida',
  locality: 'Sector 62',
  sector: 'Sector 62',
  city: 'Noida',
  citySlug: 'noida',
  title: 'Wire Mesh Supplier in Sector 62 Noida',
  meta_description: '…',
  intro, zones, delivery,
  products: ['SS Welded Mesh', …],  // matched by product.name
  related: ['sector-63-noida', …],   // related slugs
  faq: [{ q, a }, …]
}
```

Exported helpers: `sectors`, `findBySlug`, `byCity` / `localitiesByCity`, `groupedByCity`, `relatedLocalities`.

**Product matching:** sector pages filter DB products whose `name` is in `sector.products`. If none match, fallback is first 4 products. Renaming a product in admin **breaks** sector links unless sector-data names are updated too.

### Sitemap / robots

- Sitemap includes static pages, all blog posts, live product slugs, 6 city slugs, all sector slugs.
- Canonical base = `res.locals.site.url` ← **must set `SITE_URL` in production**.
- Robots disallow `/admin`.

### Structured data

Injected per-page via `extraLd` arrays rendered in `_head.ejs` (JSON-LD script tags). Product pages also use FAQ JSON from DB for FAQPage schema (see `product.ejs`).

---

## 10. Blog system

| Piece | Role |
|-------|------|
| `src/blog/pXX.js` | One post module (`module.exports = { slug, title, … }`) |
| `src/blog-data.js` | Ordered array of 25 posts + `findBySlug` |
| `src/blog-render.js` | `renderBody(lines)` → HTML |

### Post object shape

```js
{
  slug, title, date, author, excerpt,
  meta_description, meta_keywords,
  tldr: [string, …],          // bullet summary
  body: [string, …],          // lines for renderer
  faq: [{ q, a }, …]          // optional FAQPage schema
}
```

### Renderer dialect (`blog-render.js`)

Supports only:

- `## ` / `### ` headings  
- `> ` blockquotes (consecutive)  
- `- ` unordered lists  
- `|…|` tables with `|---|` separator row  
- `**bold**` inline  
- plain paragraphs  

HTML-escapes by default. **Not** full Markdown (no links syntax, no images in dialect).

### Adding a post

1. Create `src/blog/p26.js` exporting the object.  
2. `require` it in `src/blog-data.js` posts array.  
3. Sitemap picks it up automatically via `blog-data.posts`.

---

## 11. Views & partials

### Public pages

| View | Role |
|------|------|
| `home.ejs` | Hero, featured products, categories, CTAs |
| `products.ejs` | Filterable grid |
| `product.ejs` | Gallery/slider, specs, FAQ accordion, related, enquiry |
| `areas.ejs` / `area.ejs` / `sector.ejs` | Geo SEO landings |
| `blog.ejs` / `post.ejs` | Index + article |
| `about.ejs` / `contact.ejs` | Static + form |
| `404.ejs` | Not found |

### Partials (`views/partials/`)

| Partial | Role |
|---------|------|
| `_head.ejs` | Meta, OG, canonical, GA (if `gaId`), JSON-LD hooks, CSS |
| `_header.ejs` | Nav |
| `_footer.ejs` | Footer links, address, GST badge |
| `_stickybar.ejs` | Mobile sticky Call / WhatsApp |
| `_productcard.ejs` | Product card (uses `product.image` when set) |
| `_enquiry_guard.ejs` | CSRF + honeypot fields for enquiry forms |
| `_gst_badge.ejs` | GST Verified UI |
| `_icon.ejs` | Inline SVG icon helper |

**Convention:** Include `_enquiry_guard` in every public enquiry form. Never hardcode CSRF.

Admin templates live under `views/admin/` and do not use the public header/footer shell.

---

## 12. Frontend assets

### `public/css/style.css`

Single large stylesheet for public + shared components (header, product cards, accordion, slider, sector/blog typography, sticky bar). Prefer extending existing class patterns over inventing a parallel design system.

### `public/js/main.js`

IIFE vanilla JS:

- Sticky header shrink on scroll  
- Mobile nav drawer + backdrop  
- FAQ accordion (`.acc-head`)  
- Product image slider + thumbs + autoplay (respects `prefers-reduced-motion`)  
- IntersectionObserver reveal animations  
- GA4 event hooks via `data-ga` attributes when measurement ID present  

No build step — edit and refresh.

### Static caching

`/css`, `/js`, `/uploads` served with `maxAge: 1y, immutable`. Changing a CSS/JS file in production may need cache-busting (filename change or query param) if browsers already cached.

---

## 13. Security model

| Control | Implementation |
|---------|----------------|
| Session auth | `req.session.isAdmin`; gate via `requireAuth` |
| Password storage | bcrypt in `admin.password` |
| CSRF | Per-session token in `req.session.csrfToken`; forms send `_csrf`; `checkCsrf` on admin mutations; soft check on `/enquiry` |
| Rate limit | Login: 8 / 15 min; Enquiry: 10 / 15 min |
| Helmet CSP | Allows self + Google Fonts + GTM/GA + inline scripts (JSON-LD / gtag) |
| Session cookie | `sameSite: 'strict'`, `httpOnly`, `secure` when HTTPS/`production`, 8h maxAge; SQLite session store |
| Safe redirects | `safeRedirectPath()` allowlists relative `/…` paths only |
| Upload hardening | Extension whitelist + MIME match + image-size magic parse; `/uploads` forced `image/*` + `nosniff` |
| JSON-LD XSS | `safeJsonLd()` escapes `<`/`>`/`&` for script embedding |
| Uploads | MIME jpeg/png/webp only; 3MB; random `prod-{timestamp}-{rand}.ext` names |
| Honeypot | `company_website` on enquiry |
| robots | `/admin` disallowed |

**Production musts:**

- Set strong `SESSION_SECRET` (default in code is weak).  
- Set `SITE_URL` to https production origin.  
- Change default admin password if still default.

Agents must **not**:

- Disable CSRF “for convenience” on admin mutations.  
- Serve `/admin` without auth.  
- Commit secrets or put real GST/passwords into source.

---

## 14. Env vars

| Variable | Default | Effect |
|----------|---------|--------|
| `PORT` | `3000` | Listen port |
| `SITE_URL` | `http://localhost:3000` | Canonical, OG, sitemap, schema absolute URLs |
| `SESSION_SECRET` | derived local (dev) | **Required in production** (min 32 chars) |
| `ADMIN_PASSWORD` | unset | Bootstrap/rotate admin password (min 8); rotates published defaults |
| `SEED_REPAIR_SS_WELDED` | unset | Set `1` to allow one-shot SS Welded Mesh seed repair |
| `TRUST_PROXY` | unset | Set `1` (or use `NODE_ENV=production`) for reverse proxies |
| `GST_NUMBER` | unset | If set, shows `GSTIN: …` + Verified badge; if unset, badge only |
| `GA_MEASUREMENT_ID` | unset | If set, gtag loads in `_head.ejs` |

Trailing slashes on `SITE_URL` are stripped.

---

## 15. Scripts

Under `scripts/` — **not** wired into `package.json` boot. Run manually when needed.

| Script | Intent |
|--------|--------|
| `import-hires.js` | Import/attach higher-res product images into uploads + DB |
| `fix-ms-image.js` | One-off image fix |
| `check-imgs.js` | Verify image presence |
| `audit-screenshots.mjs` | Capture audit screenshots |

Treat these as ops tools; prefer understanding `server-*` + `db.js` for product features.

---

## 16. Conventions for agents

### Architecture

1. **Public route changes** → `src/server-public.js` + matching EJS under `views/`.  
2. **Admin CRUD changes** → `src/server-admin.js` + `views/admin/`.  
3. **Schema changes** → `src/db.js` with `addColumnIfMissing`; update seed/admin form/views as needed.  
4. **New seed products** → `src/seed-data.js` (name drives slug); rely on `ensureMissingProducts` for existing DBs.  
5. **New locality page** → append object to `sector-data.js` `sectors` array with unique slug; sitemap auto-includes.  
6. **New city** → extend `city-data.js` + areas route map + sitemap `cities` array.  
7. **New blog post** → new `src/blog/pXX.js` + register in `blog-data.js`.

### Style

- CommonJS only (`require` / `module.exports`).  
- Prefer small helpers colocated in the route file (existing pattern: `attachCoverImages`, `buildFaqJson`, `imageDims`).  
- Keep SEO copy unique — do not duplicate city/sector intros across localities.  
- Match existing EJS partial include style and class names from `style.css`.  
- Do not introduce React/Vite/TS unless explicitly requested.  
- Do not add markdown docs the user did not ask for (this `AGENTS.md` is an exception requested for agents).

### Naming

- Product URLs: `/products/{slug}`  
- City URLs: `/areas/{citySlug}`  
- Locality URLs: `/sectors/{slug}`  
- Upload URLs: `/uploads/{filename}`  

### Soft delete

Never hard-delete from public UX. Use `deleted=1` unless the admin “permanent delete” path is intentionally invoked.

---

## 17. Common change recipes

### A. Add a product (code seed)

1. Append object to `products` in `src/seed-data.js` (all fields + featured).  
2. Restart server → `ensureMissingProducts()` inserts by slug.  
3. Upload images via `/admin/products/:id/edit` (or a script).  
4. If localities should feature it, add the exact `name` string to relevant `sector.products` arrays.

### B. Add a product (admin only)

Use `/admin/products/new`. No code change required. Still update sector-data if local pages should highlight it.

### C. Add a Noida/Delhi locality page

1. Copy an existing sector object in `sector-data.js`.  
2. Change `slug`, `locality`, `city`, `citySlug`, titles, intro, zones, delivery, faq, products, related.  
3. Keep FAQ and intro unique (thin/duplicate content hurts SEO).  
4. Restart; visit `/sectors/{slug}`; confirm sitemap entry.

### D. Change business phone / address / WhatsApp

Primary source: `res.locals.site` block in `server-public.js`. Also grep for hardcoded `9910238277` / `919910238277` in seed FAQ strings, blog posts, and city/sector copy.

### E. Change admin password

```bash
node -e "const db=require('./src/db'); const b=require('bcryptjs'); db.prepare('UPDATE admin SET password=? WHERE username=?').run(b.hashSync('NEWPASSWORD',10),'admin');"
```

### F. Fix broken product images on listings

Ensure files exist under `public/uploads/` and DB `product_images` rows point at them; set `is_cover=1` on one. Listing cards use `attachCoverImages` + `existingImages`.

---

## 18. Gotchas & non-obvious rules

1. **Entry split:** `server.js` → `server-admin.js` → `server-public.js`. Listening only happens in admin file.  
2. **Sector product names must match DB `products.name` exactly** (string equality).  
3. **`data/site.db` is unused** — real DB is `data/garg.db`.  
4. **Soft-deleted products** vanish from public + sitemap but remain in admin trash.  
5. **CSP allows `'unsafe-inline'` scripts** — required for JSON-LD / some inline bits; don’t “tighten” without testing schema + GA.  
6. **Default session secret in source** — fine for local; must override in prod.  
7. **Blog body is an array of lines**, not a markdown file. Tables need a separator row.  
8. **Multer `fileFilter` calls `cb(null, false)`** on bad types (skips file) rather than throwing — uploads may silently omit bad files.  
9. **Flash messages** live in `req.session.flash` and are cleared into `res.locals.flash` once per request.  
10. **Image dimension reading** uses `image-size` on disk after upload — keep that for CLS-friendly width/height attributes in templates.  
11. **Do not commit** large regenerated DB dumps or secrets; `data/*.db*` may be local state.  
12. **README** is the human ops/deploy doc; **AGENTS.md** is the agent architecture map — keep both aligned when routes/schema change.

---

## 19. Glossary

| Term | Meaning |
|------|---------|
| Cover image | `product_images.is_cover = 1`; used on cards via `attachCoverImages` |
| Soft delete | `products.deleted = 1`; hidden publicly, restorable |
| Sector page | Hyperlocal landing at `/sectors/:slug` (not only Noida “sectors”) |
| City page | `/areas/:city` content from `city-data.js` |
| FAQ JSON | `products.faq` stringified `[{q,a}]` for UI accordion + FAQPage schema |
| `extraLd` | Array of JSON-LD objects passed into views for `_head` emission |
| `waText` / `waLink` | WhatsApp prefill helpers |
| Synchronizer CSRF | Session-stored token compared to form `_csrf` |

---

## Quick “where do I edit?” cheat sheet

| Goal | Edit |
|------|------|
| New public page | `server-public.js` + new `views/*.ejs` |
| New admin feature | `server-admin.js` + `views/admin/*` |
| DB column | `db.js` (`addColumnIfMissing`) |
| Default catalog | `seed-data.js` (+ restart) |
| City SEO copy | `city-data.js` |
| Locality SEO copy | `sector-data.js` |
| Blog article | `src/blog/pXX.js` + `blog-data.js` |
| Global styles / JS | `public/css/style.css`, `public/js/main.js` |
| Meta chrome / GA / JSON-LD shell | `views/partials/_head.ejs` |
| Site phone/address/GST/GA wiring | `server-public.js` `res.locals.site` + env |

---

*End of AGENTS.md. Prefer updating this index when you add routes, tables, or major modules.*
