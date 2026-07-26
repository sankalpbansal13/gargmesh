# GARG INDUSTRIAL MESH — Production Website

SEO-optimized, server-rendered (EJS + Express + SQLite) website with a password-protected admin portal for **Garg Industrial Mesh**, a wire mesh & perforated sheet supplier in Noida serving Delhi NCR.

> Address: G-25, G Block, Sector 9, Noida, Uttar Pradesh 201301
> Phone / WhatsApp: 9910238277 · Suggested domain: `gargindustrialmesh.com`

---

## Tech Stack
- **Node.js + Express** — server-rendered for SEO (Google indexes every page)
- **better-sqlite3** — file-based SQLite (`data/garg.db`)
- **EJS** templates with shared partials (head, header, footer, stickybar, productcard)
- **Multer** for product image uploads → `public/uploads/`
- **express-session** for admin auth · **method-override** for PUT/DELETE from forms

## Quick Start (local)

```bash
npm install
npm start
# open http://localhost:3000
```

The first run auto-creates `data/garg.db` and seeds **14 products** with full SEO meta + FAQ schema if the products table is empty.

---

## Docker (production)

Single prod stack only. Requires Docker Engine + Compose plugin on a Linux host (or compatible).

### 1. Configure env

```bash
cp .env.prod.example .env.prod
# Edit .env.prod — set SESSION_SECRET (min 32 chars), ADMIN_PASSWORD, SITE_URL=https://your-domain
```

### 2. Start / stop / restart

```bash
./scripts/docker/start.sh      # build + up -d
./scripts/docker/stop.sh       # compose down
./scripts/docker/restart.sh    # restart (or start if down)
```

App listens on host port `3000` by default (`PORT` in `.env.prod`). Put Nginx/Caddy in front for TLS; `TRUST_PROXY=1` is set in the example env.

### 3. Nightly restart (03:00 local)

```bash
./scripts/docker/setup-nightly.sh   # installs user crontab → nightly-restart.sh
```

Logs append to `logs/nightly-restart.log`.

### Volumes (persist across rebuilds)

| Volume | Mount | Contents |
|--------|--------|----------|
| `gargmesh-data` | `/app/data` | SQLite DB + sessions |
| `gargmesh-uploads` | `/app/public/uploads` | Product images (seeded from repo on first start; admin uploads persist) |

Product cover photos live in `public/uploads/` and are linked into SQLite on boot via `src/seed-images.js`. Docker entrypoint copies bundled photos into the uploads volume without overwriting newer admin uploads.

Backup example: `docker run --rm -v gargmesh-data:/data -v "$(pwd):/backup" alpine tar czf /backup/gargmesh-data-backup.tgz -C /data .`

### Environment variables
| Var | Default | Purpose |
|-----|---------|---------|
| `PORT` | `3000` | Server port |
| `SITE_URL` | `http://localhost:3000` | Canonical/OG base URL. **Required in production** (`NODE_ENV=production`): must be HTTPS and not localhost. |
| `SESSION_SECRET` | derived local secret | Session signing secret. **Required in production** (min 32 chars). Never use a published default. |
| `ADMIN_PASSWORD` | *(unset)* | If set (min 8 chars), used when creating/rotating the admin password. Rotates known published defaults on boot. |
| `SEED_REPAIR_SS_WELDED` | unset | Set to `1` only to one-shot repair corrupted `ss-welded-mesh` content from seed data. |
| `TRUST_PROXY` | unset | Set to `1` (or use `NODE_ENV=production`) so Express trusts `X-Forwarded-*` behind a reverse proxy. |
| `GST_NUMBER` | *(unset)* | Your real GSTIN (e.g. `09ABCDE1234F1Z5`). When set, the site shows `GSTIN: {number}` **plus** a **GST Verified** badge. When unset, only the **GST Verified** badge is shown (no underscore placeholder). |
| `GA_MEASUREMENT_ID` | *(unset)* | GA4 Measurement ID (`G-XXXXXXX`). When set, the gtag snippet loads in `_head.ejs` and `data-ga` CTA events fire. When unset, no gtag is loaded (nothing broken). |

Set the real values in production:
```bash
# Linux/Mac
export SITE_URL="https://gargindustrialmesh.com"
export SESSION_SECRET="a-long-random-secret"
export GST_NUMBER="09XXXXXXXXXXZ5"          # real GSTIN when you have it
export GA_MEASUREMENT_ID="G-XXXXXXXXXX"    # optional until GA4 is ready
# Windows PowerShell
$env:SITE_URL="https://gargindustrialmesh.com"
$env:SESSION_SECRET="a-long-random-secret"
$env:GST_NUMBER="09XXXXXXXXXXZ5"
$env:GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

> **Deploy reminder:** always set `SITE_URL=https://gargindustrialmesh.com` in production. Leaving the localhost default breaks canonical URLs, Open Graph, and the sitemap.
---

## Admin Portal

- **URL:** `/admin/login`
- **Username:** `admin`
- **Password:** set via `ADMIN_PASSWORD` env (recommended). On a fresh DB without that env, a one-time random password is printed to the server console. If an old published default is still in the DB, set `ADMIN_PASSWORD` and restart to rotate it.

> Password is bcrypt-hashed. To change manually:
> `node -e "const db=require('./src/db'); const b=require('bcryptjs'); db.prepare('UPDATE admin SET password=? WHERE username=?').run(b.hashSync('NEWPASSWORD',10),'admin');"`
> Always set a strong `SESSION_SECRET` and HTTPS `SITE_URL` in production.
### Admin features
- Dashboard: product & enquiry counts + recent enquiries
- Products list with search + category filter, **duplicate**, **soft-delete** (with restore + permanent-delete), edit (all with confirm steps)
- Add/Edit product form: name, category, slug (auto from name, editable), short desc, full description, materials, sizes, grades, applications, price-from, **FAQ repeater** (question/answer pairs saved as JSON to the `faq` column → powers the on-page FAQ accordion + FAQPage schema), SEO meta title/description/keywords, featured toggle
- **Image management:** upload multiple photos per product (pixel **width/height read at upload** and stored to prevent CLS), **reorder (up/down)**, set caption + **SEO alt text**, mark one as **cover**, delete photos. The product page route also filters out any image row whose file is missing on disk (no broken `<img>`).
- Enquiries inbox: all submissions (name, phone, email, product, message, date) with **single delete**, **bulk delete (checkboxes)**, and **CSV export** (`/admin/enquiries.csv`)
- Flash messages on every action
- Login is **rate-limited** (8 attempts / 15 min) to slow brute-force
- **CSRF protection** on every admin mutation (synchronizer-token pattern); all admin forms carry a per-session `_csrf` token. Session cookie is `SameSite=strict`.

---

## All Routes

### Public
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Home |
| GET | `/products` | Product listing (filter by category/material/application) |
| GET | `/products/:slug` | Product detail (dynamic) |
| GET | `/areas` | Areas we serve |
| GET | `/areas/:city` | City landing page (noida, greater-noida, delhi, ghaziabad, faridabad, gurugram) — unique local content + LocalBusiness schema |
| GET | `/sectors/:slug` | Hyper-local locality page across Delhi NCR (Noida sectors + Greater Noida / Delhi / Ghaziabad / Faridabad / Gurugram localities) |
| GET | `/about` | About / E-E-A-T |
| GET | `/contact` | Contact + map + form |
| GET | `/blog` | Blog list (paginated, 9/page) |
| GET | `/blog/:slug` | Blog post (Article + FAQPage + BreadcrumbList schema, TL;DR, comparison tables, FAQ accordion) |
| POST | `/enquiry` | Submit enquiry (honeypot + CSRF + rate-limited) |
| GET | `/sitemap.xml` | Auto-generated sitemap (static + products + cities + localities + blog) |
| GET | `/robots.txt` | Robots (disallow `/admin`, points to sitemap) |
| GET | `/favicon.svg`, `/logo.png`, `/css/style.css`, `/js/main.js`, `/uploads/*` | Static (long-cache for css/js/uploads) |

### Admin
| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/admin/login` | Login |
| GET | `/admin/logout` | Logout |
| GET | `/admin/dashboard` | Dashboard (auth) |
| GET | `/admin/products` | Products list (auth, search + filter + deleted view) |
| GET | `/admin/products/new` | Add form (auth) |
| POST | `/admin/products` | Create + upload photos (auth) |
| GET | `/admin/products/:id/edit` | Edit form (auth) |
| PUT | `/admin/products/:id` | Update + upload photos (auth) |
| DELETE | `/admin/products/:id` | **Soft-delete** product (auth) |
| POST | `/admin/products/:id/duplicate` | Duplicate product as draft (auth) |
| POST | `/admin/products/:id/restore` | Restore a soft-deleted product (auth) |
| POST | `/admin/products/:id/permdelete` | Permanent delete product + photos (auth) |
| POST | `/admin/images/:id` | Update caption + alt text (auth) |
| POST | `/admin/images/:id/cover` | Set cover (auth) |
| POST | `/admin/images/:id/move` | Reorder image up/down (auth) |
| DELETE | `/admin/images/:id` | Delete photo (auth) |
| GET | `/admin/enquiries` | Enquiries inbox (auth) |
| GET | `/admin/enquiries.csv` | Export enquiries to CSV (auth) |
| POST | `/admin/enquiries/bulk` | Bulk delete enquiries (auth) |
| DELETE | `/admin/enquiries/:id` | Delete enquiry (auth) |

---

## SEO Features Implemented

- ✅ Unique meta title + description + keywords per product & city page (targeting Noida / Greater Noida / Delhi NCR)
- ✅ JSON-LD schema: **LocalBusiness (HardwareStore)** (with `areaServed` on city pages), **Organization**, **WebSite** (with SearchAction), **Product** (with `offers`/`price`/`priceCurrency: INR`), **FAQPage**, **BreadcrumbList**, **Article** (blog posts), **ContactPage** (contact page)
- ✅ `AggregateRating`/`Review` schema placeholder wired in `product.ejs` (disabled until real Google reviews exist — uncomment + set `rating_value`/`review_count` columns)
- ✅ Per-product FAQ section (3–5 Q&A) with FAQPage schema — for "People Also Ask" snippets
- ✅ Per-city FAQ with FAQPage schema + unique local content (sectors, landmarks, delivery)
- ✅ Canonical URLs on every page (driven by `SITE_URL` env var)
- ✅ Open Graph + Twitter Card meta
- ✅ Semantic URL slugs (`/products/ss-welded-mesh`, `/areas/noida`, `/sectors/sector-62-noida`, `/blog/:slug`)
- ✅ Auto `sitemap.xml` (static + product + city + locality + blog pages) and `robots.txt` (allows all, disallows `/admin`, points to sitemap)
- ✅ Breadcrumbs on every interior page
- ✅ Internal linking: related products, category links, city pages, locality pages (grouped by city), blog
- ✅ Image alt-text field in admin (SEO alt text per uploaded photo)
- ✅ H1/H2 keyword structure, image alt text, lazy-loaded images with `width`/`height` (uploaded photos store real pixel dims → no CLS)
- ✅ Mobile-first, minimal CSS/JS, Sora + Inter via Google Fonts (non-blocking), no heavy frameworks
- ✅ Consistent NAP (Name/Address/Phone) in footer on every page
- ✅ 404 page + error handling (clean 404s, no 500 crashes)
- ✅ Price ranges ("Starting from ₹X — request quote") + Product schema `price`
- ✅ **44 hyper-local locality pages** under `/sectors/:slug` across 6 NCR cities (unique intro, zones, delivery, FAQ, LocalBusiness `areaServed`, related-locality links)

### Hyper-local coverage (`/sectors/:slug`)
URL pattern kept as `/sectors/:slug` for compatibility; content is city-aware localities (not Noida-only).

| City | Localities |
|------|------------|
| **Noida** (6) | Sector 62, 63, 68, 18, 12, 2 |
| **Greater Noida** (9) | Knowledge Park, Alpha, Beta, Gamma, Delta, Chi Phi, Ecotech Industrial Area, Greater Noida West, Pari Chowk |
| **Delhi** (10) | Okhla Industrial Area, Mayapuri, Wazirpur, Naraina, Bawana, Dwarka, Rohini, Lajpat Nagar / South Delhi, East Delhi, North Delhi |
| **Ghaziabad** (7) | Sahibabad Industrial Area, Site IV / Loni Road, Indirapuram, Vaishali, Crossings Republik, Mohan Nagar, Raj Nagar Extension |
| **Faridabad** (5) | Sector 15/16/27 Industrial, Ballabhgarh, Neharpar / Greater Faridabad, NIT Faridabad, Surajkund |
| **Gurugram** (7) | Udyog Vihar, Manesar, Sector 37/18 Industrial, IMT Manesar, Sohna Road, Golf Course Road, DLF / Cyber City |

Edit unique copy in `src/sector-data.js`. Routes, Areas page (grouped by city), city pages, sitemap and related-locality links pick them up automatically.

### Target keywords (seeded across products & city pages)
`ss welded mesh`, `gi welded mesh`, `ms welded mesh`, `ss perforated sheet`, `ms perforated sheet`, `gi perforated sheet`, `ss wire mesh`, `pvc mesh`, `aluminium door mesh`, `chain link fence`, `bird mesh`, `bird spikes`, `monkey spikes`, `construction net` — each combined with "supplier/manufacturer in Noida / Greater Noida / Delhi NCR".

---

## Design System

- **Direction:** "Modern Industrial Luxury" — a premium, masculine, high-end look suited to an industrial mesh supplier.
- **Colors (only):** Charcoal/graphite scale (`#1A1D21` family) + warm metallic bronze accent `#B8763E` (CTA, used sparingly) + crisp off-white `#FAFAF7` body / `#FFFFFF` cards / warm `#F2F1EC` alt sections + WhatsApp Green `#25D366` (WhatsApp buttons only). All via CSS variables.
- **Typography:** Sora (headings) + Inter (body) via Google Fonts (preconnect + non-blocking `media="print" onload` pattern). Fluid `clamp()` type scale, eyebrow labels, tight heading / generous body line-height.
- **Spacing scale:** 4/8/12/16/24/32/48/64px · **Type scale:** fluid `clamp()` · **Radius / shadows** as CSS variables (warm-tinted layered shadows).
- **Mobile-first:** shrinking sticky header (with blur), slide-in nav drawer, sticky bottom Call | WhatsApp bar (with body padding so it never overlaps the footer), floating WhatsApp button (desktop), floating enquiry-cart button + drawer, back-to-top button, 44px min tap targets.
- **Subtle motion only:** IntersectionObserver fade-in-up reveals (400–600ms, staggered, one-shot, respects `prefers-reduced-motion`), product image slider (auto-advance, pause on hover/touch, arrows + dots + swipe), small hover lifts, accordion expand, focus rings.
- **Accessibility:** semantic HTML, ARIA labels, skip-to-content link, keyboard-focusable, sufficient contrast (AA), alt text.
- **No placeholder/stock images:** product photo slots show a clean "Photo coming soon" state. Upload your real photos through the admin portal.

---

## Deployment

### Render
1. New → Web Service → connect repo
2. Build: `npm install` · Start: `npm start`
3. Add env vars: `PORT` (Render sets automatically), `SITE_URL=https://gargindustrialmesh.com`, `SESSION_SECRET`, `GST_NUMBER` (when you have GSTIN), optional `GA_MEASUREMENT_ID`
4. Note: better-sqlite3 is a native module — Render's Linux builder compiles it automatically. The SQLite file lives in `data/`; for persistence across deploys use a Render Disk mounted at `data/` (or move to a managed DB later).

### Railway
1. New project → deploy from repo
2. Railway auto-detects Node. Set `SESSION_SECRET` and `GST_NUMBER` vars.
3. Add a persistent volume for `data/` so `garg.db` survives redeploys.

### Vercel
> Vercel is serverless — better-sqlite3 (native, file-based) is **not ideal** here. If you must, use a persistent external volume or switch the DB to Postgres. Recommended: Render or Railway for this stack.

### Hostinger VPS / cPanel
1. Node.js app → upload project → `npm install` → `npm start`
2. Point domain `gargindustrialmesh.com` A record to the VPS IP
3. Enable SSL (Let's Encrypt via the panel)
4. Set `SESSION_SECRET` and `GST_NUMBER` env vars

### Domain setup (`gargindustrialmesh.com`)
1. Buy domain (GoDaddy / Namecheap / Hostinger).
2. Point DNS:
   - **A record** `@` → server IP (Render/Railway/VPS), or
   - **CNAME** `www` → your hosting hostname.
3. Enable HTTPS (free SSL via hosting panel / Let's Encrypt).
4. Update `site.domain` is already `gargindustrialmesh.com` in `server-public.js`; if you change the domain, update it there too (and in sitemap/robots which read from `site.domain`).

---

## Google Setup Checklist

### Google Search Console
1. Go to https://search.google.com/search-console → add property `https://gargindustrialmesh.com`.
2. Verify ownership (DNS TXT record or HTML file — place in `public/`).
3. Submit `https://gargindustrialmesh.com/sitemap.xml`.
4. Monitor Coverage, Performance, and "People Also Ask" appearances.

### Google Analytics 4
1. Create a GA4 property at https://analytics.google.com → get Measurement ID (`G-XXXXXXX`).
2. Set env `GA_MEASUREMENT_ID=G-XXXXXXX` and restart the server. The gtag snippet in `views/partials/_head.ejs` loads **only when this env is set** (no broken gtag when unset).
3. **Event hooks already wired:** every key CTA carries a `data-ga` attribute (`call`, `whatsapp`, `quote`, `enquiry_submit`, `add_to_enquiry`, `view_enquiry`, `leave_review`, `get_directions`). `public/js/main.js` dispatches these as GA4 events via `window.gtag('event', name, data)` **and** a `gim:analytics` CustomEvent on `window`.
4. Verify events in GA4 Realtime (click Call / WhatsApp / Add-to-Enquiry).
### Google Business Profile (critical for local ranking)
1. Go to https://business.google.com → "Add your business".
2. Name: **GARG INDUSTRIAL MESH** · Category: **Hardware Store** (also add "Building Materials Supplier").
3. Address: G-25, G Block, Sector 9, Noida 201301 · Service area: Noida, Greater Noida, Delhi, Ghaziabad, Faridabad, Gurugram.
4. Phone: 9910238277 · Hours: Mon–Sat 9:30 AM–7:30 PM.
5. Add photos (shop front, products, team), write a keyword-rich description, add services (each product), collect 5+ customer reviews, post weekly updates.
6. Keep NAP **identical** to the website footer.

### Google Ads (priority keywords)
Create a Search campaign targeting **Noida + Delhi NCR (radius)** with these exact/phrase match keywords:
- `[ss welded mesh supplier in noida]`, `[gi welded mesh in noida]`, `[ms welded mesh noida]`
- `[ss perforated sheet supplier]`, `[ms perforated sheet 4x8]`, `[gi perforated sheet]`
- `[ss wire mesh in noida]`, `[pvc mesh supplier]`, `[aluminium door mesh]`
- `[chain link fence noida]`, `[bird mesh]`, `[bird spikes noida]`, `[monkey spikes]`, `[construction safety net]`
- Add call extensions / call-only ads with 9910238277, sitelinks to top product pages, and a location asset for the Noida address. Use "Get Quote" / "Call Now" as conversion actions.

---

## Week-by-Week Launch Roadmap

**Week 1 — Go live**
- Deploy to Render/Railway, point domain, enable SSL.
- Set `SITE_URL=https://gargindustrialmesh.com`, `SESSION_SECRET`, `GST_NUMBER` (when ready), optional `GA_MEASUREMENT_ID`.
- Submit `sitemap.xml` to Search Console; verify GA4 firing.
- Complete Google Business Profile 100%.

**Week 2 — Add real photos**
- Upload real product & shop photos via admin (set cover + SEO alt text for each).
- Replace the home gallery placeholders.
- Collect first 5 Google reviews from existing customers.

**Week 3 — Content + links**
- Write 3 blog articles (use the blog scaffold); interlink to product pages.
- Add internal links from each city page to top products.
- Start Google Ads campaign with priority keywords + call assets.

**Week 4 — Optimize**
- Review Search Console queries; refine meta titles for low-hanging CTR wins.
- Add more city-specific FAQs; expand product FAQs.
- Monitor page speed (PageSpeed Insights); compress any large uploaded photos.

**Ongoing**
- Weekly GBP post · reply to every review · weekly enquiry follow-up via WhatsApp.
- Monthly: add 1–2 blog posts, refresh featured products, review enquiry conversion rate.

---

## Recommended Further Improvements

The site is production-ready and premium-grade. To push it further over time:

**Performance**
- Convert uploaded product photos to WebP/AVIF on upload (optional later: add `sharp` to the multer pipeline, write `.webp` alongside originals, serve `<picture>` / `srcset`). Uploaded images already store pixel **width/height** and use `loading="lazy"` (cover = eager) to limit CLS.
- Add a build step to inline critical CSS and defer non-critical font weights.
- (Done) Long-cache `Cache-Control: immutable` headers for `/css/`, `/js/`, `/uploads/`.
- (Done) Image dims captured at upload via `image-size`; product gallery applies `width`/`height` + lazy loading.
**SEO & Content**
- (Done) Per-locality landing pages (`/sectors/:slug`) with unique content across Delhi NCR cities (44 pages) for hyper-local long-tail capture.
- (Done) `Review`/`AggregateRating` schema placeholder wired (enable once real Google reviews exist).
- Add `hreflang` / multi-language support if expanding beyond English/Hindi.
- Add a JSON product feed (`/products.json`) for Google Merchant Center.

**UX & Conversion**
- (Done) "Add to enquiry" cart that bundles multiple products into one WhatsApp message (localStorage, floating button + drawer).
- (Done) Lightweight analytics event hooks for CTA clicks (call/WhatsApp/quote/enquiry) in GA4.
- (Done) Back-to-top button, loading state on enquiry submit, sticky-bar body padding.
- Replace the gallery placeholder grid with real before/after project photos once available.

**Admin**
- (Done) Image reorder (up/down `sort_order`) in the admin image manager.
- (Done) Enquiry export to CSV and bulk delete.
- (Done) Soft-delete products with restore + permanent-delete, plus a "duplicate product" action.
- Add a "starred / replied" status on enquiries for follow-up workflow.

**Infrastructure / Security**
- (Done) `helmet` security headers **with a permissive CSP** (`script-src 'self' 'unsafe-inline'`, `style-src 'self' 'unsafe-inline' fonts.googleapis.com`, `font-src 'self' fonts.gstatic.com`, `img-src 'self' data:`, `frame-src 'self' google.com` for the map) — keeps inline JSON-LD + Google Fonts + the maps iframe working.
- (Done) Rate-limiting on `/enquiry` (10/15min) and `/admin/login` (8/15min).
- (Done) Enquiry **honeypot** (`company_website` hidden field — rejected if filled) + **CSRF** on public enquiry forms (same session `_csrf` token as admin).
- (Done) Admin password stored as a bcrypt hash.
- (Done) CSRF protection (synchronizer token) on all admin mutations; `SameSite=strict` session cookie.
- (Done) Enquiry input sanitized server-side (parameterised SQLite inserts).
- (Done) Missing-file safety: product route skips image rows whose file is gone (no broken images).
- (Done) Sticky WhatsApp prefill is **context-aware** (product name on product pages; locality/city/blog title when relevant).
- Move to Postgres if scaling beyond a single instance (keep better-sqlite3 for dev).
- Add automated nightly DB backup of `data/garg.db` to cloud storage.
---

## File Structure

```
New folder/
├─ package.json
├─ .gitignore
├─ README.md
├─ data/                      # garg.db (auto-created)
├─ public/
│  ├─ logo.png               # monochrome GARG logo (provided)
│  ├─ css/style.css          # full design system
│  ├─ js/main.js             # nav drawer, accordion, gallery, sticky header
│  └─ uploads/               # product photos (multer) + .gitkeep
├─ src/
│  ├─ server.js              # entry (requires server-admin)
│  ├─ server-public.js       # app + public routes + sitemap/robots + helmet + rate-limit
│  ├─ server-admin.js        # admin routes + auth + multer + bcrypt login + listener
│  ├─ db.js                  # SQLite schema + bcrypt admin seed + column migrations
│  ├─ seed.js                # seeds 14 products if empty
│  ├─ seed-data.js          # product data + FAQ builder
│  ├─ blog-data.js          # Aggregator for 25 GEO-optimized blog posts
│  ├─ blog/                 # One file per blog post (p01.js … p25.js)
│  ├─ blog-render.js        # Lightweight markdown-ish renderer for post bodies
│  ├─ city-data.js          # unique content for 6 city landing pages
│  ├─ sector-data.js        # unique content for 44 NCR locality pages (/sectors/:slug)
│  └─ middleware/auth.js     # requireAuth session guard
└─ views/
   ├─ partials/  _head _header _footer _stickybar _productcard _icon
   ├─ home.ejs  products.ejs  product.ejs  areas.ejs  area.ejs  sector.ejs
   ├─ about.ejs  contact.ejs  blog.ejs  post.ejs  404.ejs
   └─ admin/  login  dashboard  products  product-form  enquiries
```

---

## Notes & Known Issues
- **No placeholder images** by design — product galleries show a clean empty state until you upload real photos via admin.
- `better-sqlite3` is a native module; on Windows it needs build tools (already installed here). On Linux hosts (Render/Railway) it compiles automatically.
- SQLite file at `data/garg.db` — back it up regularly and use a persistent volume in production.
- To reset the DB: stop the server, delete `data/garg.db` (and `-wal`, `-shm`), restart — it recreates and re-seeds. Set `ADMIN_PASSWORD` before first boot (or copy the one-time password printed to the console).
- The admin password is stored as a **bcrypt hash**. Published defaults are no longer auto-applied; set `ADMIN_PASSWORD` to create/rotate. In production, `NODE_ENV=production` also requires HTTPS `SITE_URL` and a strong `SESSION_SECRET` (min 32 chars) or the process exits.
- **GST:** set `GST_NUMBER` to your real GSTIN when available. Until then the UI shows a clear **GST Verified** badge (utility bar, footer, about, contact) with no underscore placeholder.
- **Security headers:** `helmet` is enabled with a **permissive CSP** that allows inline JSON-LD/scripts, Google Fonts, the maps iframe, and (when configured) Google Analytics / gtag.
- **CSRF:** all admin POST/PUT/DELETE forms require a per-session `_csrf` token (synchronizer pattern). Public enquiry forms also carry `_csrf` plus a honeypot field. If you add a new form, include `<input type="hidden" name="_csrf" value="<%= csrfToken %>">`. The session cookie is `SameSite=strict`.
- **Blog:** 25 original, GEO-optimized (Generative Engine Optimization) SEO posts. Each post lives in its own file under `src/blog/pNN.js` and is aggregated by `src/blog-data.js`. Each post has `slug`, `title`, `date`, `author`, `excerpt`, `meta_description`, `meta_keywords`, `tldr[]` (Key takeaways), `body[]` (markdown-ish: `## `/`### ` headings, `- ` bullets, `> ` blockquotes, `| ` tables, `**bold**`), and `faq[]` (rendered as an accordion + FAQPage JSON-LD). The `/blog/:slug` route pre-renders the body to HTML via `src/blog-render.js` and emits Article + BreadcrumbList + FAQPage schema. New posts appear automatically in `/blog` (paginated, 9 per page), the sitemap, and related-posts. **GEO approach:** each post leads with a definitive citable answer, uses Q&A H2s, comparison tables, entity-rich phrasing ("Garg Industrial Mesh" + "Noida Sector 9" + product + use-case), spec data, indicative ₹ price ranges, TL;DR bullets and PAA-style sub-questions — designed to be cited by Google AND AI/LLM assistants (ChatGPT, Gemini, Perplexity). The About page carries explicit E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) statements.
- **City/Locality content:** edit `src/city-data.js` and `src/sector-data.js` to refine local copy; routes, Areas page (grouped by city), city pages, related-locality links and sitemap pick them up automatically.

## License
Proprietary — © GARG INDUSTRIAL MESH.
