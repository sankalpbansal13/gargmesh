const fs = require('fs');
const path = require('path');
const db = require('../src/db');

const srcDir = 'C:\\Users\\bhavy\\Downloads\\website images high res';
const destDir = path.join(__dirname, '..', 'public', 'uploads');
const galleryDir = path.join(__dirname, '..', 'public');
fs.mkdirSync(destDir, { recursive: true });

function extOf(name) {
  const e = path.extname(name).toLowerCase();
  if (e) return e;
  // "perforated sheet" has no extension — treat as jpeg
  return '.jpg';
}

function copyTo(srcName, destName) {
  const src = path.join(srcDir, srcName);
  if (!fs.existsSync(src)) {
    console.log('MISSING', srcName);
    return null;
  }
  const dest = path.join(destDir, destName);
  fs.copyFileSync(src, dest);
  return destName;
}

function getProduct(slug) {
  return db.prepare('SELECT id FROM products WHERE slug = ? AND deleted = 0').get(slug);
}

function nextSort(productId) {
  const row = db.prepare('SELECT COALESCE(MAX(sort_order), 0) AS m FROM product_images WHERE product_id = ?').get(productId);
  return (row?.m || 0) + 1;
}

function addImage(slug, destName, alt, makeCover) {
  const prod = getProduct(slug);
  if (!prod) {
    console.log('NO PRODUCT', slug);
    return;
  }
  const exists = db.prepare('SELECT id FROM product_images WHERE product_id = ? AND filename = ?').get(prod.id, destName);
  if (exists) {
    console.log('SKIP exists', slug, destName);
    return;
  }
  if (makeCover) {
    db.prepare('UPDATE product_images SET is_cover = 0 WHERE product_id = ?').run(prod.id);
  }
  const sort = nextSort(prod.id);
  db.prepare(
    'INSERT INTO product_images (product_id, filename, caption, alt_text, sort_order, is_cover, width, height) VALUES (?,?,?,?,?,?,?,?)'
  ).run(prod.id, destName, alt, alt, sort, makeCover ? 1 : 0, null, null);
  console.log('ADD', slug, destName, makeCover ? '[COVER]' : '');
}

const mapping = [
  // Aluminium door mesh
  { file: 'alu door mesh.jpg', dest: 'hr-alu-door-mesh-cover.jpg', slug: 'aluminium-door-mesh', cover: true, alt: 'Aluminium door mesh / jaali — high res' },
  { file: 'alu door mesh 2.jpeg', dest: 'hr-alu-door-mesh-2.jpeg', slug: 'aluminium-door-mesh', cover: false, alt: 'Aluminium door mesh stock — high res' },

  // Bird mesh
  { file: 'bird mesh images.jpg', dest: 'hr-bird-mesh-cover.jpg', slug: 'bird-mesh', cover: true, alt: 'Bird mesh netting — high res' },
  { file: 'bird mesh image 2.jpg', dest: 'hr-bird-mesh-2.jpg', slug: 'bird-mesh', cover: false, alt: 'Bird mesh detail — high res' },

  // Bird spikes
  { file: 'ss bird spikes.jpg', dest: 'hr-bird-spikes-ss-cover.jpg', slug: 'bird-spikes', cover: true, alt: 'SS bird spikes — high res' },
  { file: 'bird spikes images.jpg', dest: 'hr-bird-spikes-2.jpg', slug: 'bird-spikes', cover: false, alt: 'Bird spikes assortment — high res' },

  // Chain link
  { file: 'chain link mesh.jpg', dest: 'hr-chain-link-cover.jpg', slug: 'chain-link-fence', cover: true, alt: 'Chain link fence mesh — high res' },
  { file: 'chain link mesh 2.jpg', dest: 'hr-chain-link-2.jpg', slug: 'chain-link-fence', cover: false, alt: 'Chain link mesh close-up — high res' },

  // Monkey spikes
  { file: 'monkey spike.jpg', dest: 'hr-monkey-spikes-cover.jpg', slug: 'monkey-spikes', cover: true, alt: 'Monkey spikes polycarbonate — high res' },

  // Perforated (MS/SS/GI share visuals)
  { file: 'perforated sheet', dest: 'hr-perforated-cover.jpg', slug: 'ms-perforated-sheet', cover: true, alt: 'Perforated sheet — high res' },
  { file: 'perforated sheet 2.jpg', dest: 'hr-perforated-2.jpg', slug: 'ms-perforated-sheet', cover: false, alt: 'Perforated sheet detail — high res' },
  { file: 'perforated sheet', dest: 'hr-ss-perforated-cover.jpg', slug: 'ss-perforated-sheet', cover: true, alt: 'SS perforated sheet — high res' },
  { file: 'perforated sheet 2.jpg', dest: 'hr-ss-perforated-2.jpg', slug: 'ss-perforated-sheet', cover: false, alt: 'SS perforated sheet detail — high res' },
  { file: 'perforated sheet', dest: 'hr-gi-perforated-cover.jpg', slug: 'gi-perforated-sheet', cover: true, alt: 'GI perforated sheet — high res' },

  // PVC
  { file: 'pvc mesh.jpg', dest: 'hr-pvc-mesh-cover.jpg', slug: 'pvc-mesh', cover: true, alt: 'PVC coated mesh — high res' },

  // SS wire mesh
  { file: 'ss wire mesh.webp', dest: 'hr-ss-wire-mesh-cover.webp', slug: 'ss-wire-mesh', cover: true, alt: 'SS wire mesh — high res' },
  { file: 'ss wire mesh 2.jpg', dest: 'hr-ss-wire-mesh-2.jpg', slug: 'ss-wire-mesh', cover: false, alt: 'SS wire mesh detail — high res' },

  // Welded mesh → SS / GI / MS
  { file: 'welded mesh.webp', dest: 'hr-ss-welded-cover.webp', slug: 'ss-welded-mesh', cover: true, alt: 'SS welded mesh — high res' },
  { file: 'welded mesh.jpg', dest: 'hr-ss-welded-2.jpg', slug: 'ss-welded-mesh', cover: false, alt: 'Welded mesh roll — high res' },
  { file: 'welded mesh.webp', dest: 'hr-gi-welded-cover.webp', slug: 'gi-welded-mesh', cover: true, alt: 'GI welded mesh — high res' },
  { file: 'welded mesh.jpg', dest: 'hr-ms-welded-cover.jpg', slug: 'ms-welded-mesh', cover: true, alt: 'MS welded mesh — high res' },
];

for (const m of mapping) {
  const name = copyTo(m.file, m.dest);
  if (name) addImage(m.slug, name, m.alt, m.cover);
}

// Gallery assets (expanded / barfi jali + key hero shots)
const galleryCopies = [
  ['barfi jali 3 expanded mesh.jpg', 'gallery-expanded-mesh.jpg'],
  ['barfi jali.jpeg', 'gallery-barfi-jali.jpg'],
  ['barfi jali 2.jpg', 'gallery-barfi-jali-2.jpg'],
  ['welded mesh.webp', 'gallery-ss-welded.jpg'],
  ['pvc mesh.jpg', 'gallery-pvc-mesh.jpg'],
  ['chain link mesh.jpg', 'gallery-chain-link.jpg'],
  ['perforated sheet', 'gallery-perforated.jpg'],
  ['alu door mesh.jpg', 'gallery-alu-jaali.jpg'],
  ['ss bird spikes.jpg', 'gallery-bird-spikes.jpg'],
  ['monkey spike.jpg', 'gallery-monkey-spikes.jpg'],
  ['bird mesh images.jpg', 'gallery-bird-mesh.jpg'],
];

for (const [srcName, destName] of galleryCopies) {
  const src = path.join(srcDir, srcName);
  if (!fs.existsSync(src)) {
    console.log('GALLERY MISSING', srcName);
    continue;
  }
  fs.copyFileSync(src, path.join(galleryDir, destName));
  console.log('GALLERY', destName);
}

console.log('DONE');
const counts = db.prepare(`
  SELECT p.slug, COUNT(i.id) AS imgs, SUM(i.is_cover) AS covers
  FROM products p LEFT JOIN product_images i ON i.product_id = p.id
  WHERE p.deleted = 0 GROUP BY p.id ORDER BY p.slug
`).all();
console.table(counts);
