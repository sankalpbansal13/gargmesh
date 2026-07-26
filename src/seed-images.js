/**
 * Ensure every seeded product has cover (+ gallery) images linked in product_images
 * for files that exist under public/uploads/. Idempotent — safe on every boot.
 */
const fs = require('fs');
const path = require('path');
const db = require('./db');

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

/** Prefer hi-res covers, then named covers, then extras. */
const PRODUCT_IMAGES = {
  'ss-welded-mesh': [
    'hr-ss-welded-cover.webp',
    'hr-ss-welded-2.jpg',
    'ss-welded-mesh-cover.jpeg',
    'ss-welded-mesh-img1.jpeg'
  ],
  'gi-welded-mesh': [
    'hr-gi-welded-cover.webp',
    'gi-welded-mesh-cover.jpeg'
  ],
  'ms-welded-mesh': [
    'hr-ms-welded-cover.jpg',
    'ms-welded-mesh-cover.jpeg'
  ],
  'ms-perforated-sheet': [
    'hr-perforated-cover.jpg',
    'hr-perforated-2.jpg',
    'ms-perforated-sheet-cover.jpeg'
  ],
  'ss-perforated-sheet': [
    'hr-ss-perforated-cover.jpg',
    'hr-ss-perforated-2.jpg',
    'ss-perforated-sheet-cover.jpeg'
  ],
  'gi-perforated-sheet': [
    'hr-gi-perforated-cover.jpg',
    'gi-perforated-sheet-cover.jpeg'
  ],
  'copper-perforated-sheet': [
    'copper-perforated-sheet-photo.png',
    'copper-perforated-sheet-cover.jpg'
  ],
  'brass-perforated-sheet': [
    'brass-perforated-sheet-photo.png',
    'brass-perforated-sheet-cover.jpg'
  ],
  'aluminium-perforated-sheet': [
    'aluminium-perforated-sheet-cover.jpg'
  ],
  'ms-expanded-mesh': [
    'ms-expanded-mesh-cover.jpg'
  ],
  'gi-expanded-mesh': [
    'gi-expanded-mesh-cover.jpg'
  ],
  'ss-expanded-mesh': [
    'ss-expanded-mesh-cover.jpg'
  ],
  'aluminium-expanded-mesh': [
    'aluminium-expanded-mesh-cover.jpg'
  ],
  'copper-expanded-mesh': [
    'copper-expanded-mesh-photo.png'
  ],
  'brass-expanded-mesh': [
    'brass-expanded-mesh-photo.png'
  ],
  'ss-wire-mesh': [
    'hr-ss-wire-mesh-cover.webp',
    'hr-ss-wire-mesh-2.jpg',
    'ss-wire-mesh-cover.jpeg'
  ],
  'pvc-mesh': [
    'hr-pvc-mesh-cover.jpg',
    'pvc-mesh-cover.jpeg',
    'pvc-mesh-img2.jpeg',
    'pvc-mesh-img3.jpeg'
  ],
  'aluminium-door-mesh': [
    'hr-alu-door-mesh-cover.jpg',
    'hr-alu-door-mesh-2.jpeg',
    'aluminium-door-mesh-cover.jpeg',
    'aluminium-door-mesh-img2.jpeg'
  ],
  'chain-link-fence': [
    'hr-chain-link-cover.jpg',
    'hr-chain-link-2.jpg',
    'chain-link-fence-cover.jpeg',
    'chain-link-fence-img1.jpeg'
  ],
  'bird-mesh': [
    'hr-bird-mesh-cover.jpg',
    'hr-bird-mesh-2.jpg',
    'bird-mesh-cover.jpeg'
  ],
  'bird-spikes': [
    'hr-bird-spikes-ss-cover.jpg',
    'hr-bird-spikes-2.jpg',
    'bird-spikes-cover.jpeg',
    'bird-spikes-img1.jpeg'
  ],
  'monkey-spikes': [
    'hr-monkey-spikes-cover.jpg',
    'monkey-spikes-cover.jpeg'
  ],
  'construction-net': [
    'construction-net-cover.jpeg',
    'construction-net-img2.jpeg'
  ]
};

function fileExists(filename) {
  try {
    return fs.existsSync(path.join(uploadsDir, filename));
  } catch (e) {
    return false;
  }
}

function ensureProductImages() {
  if (!fs.existsSync(uploadsDir)) {
    console.log('Seed images: uploads dir missing, skip.');
    return { linked: 0, skipped: 0 };
  }

  const getProduct = db.prepare('SELECT id, name FROM products WHERE slug = ? AND deleted = 0');
  const hasFile = db.prepare('SELECT id FROM product_images WHERE product_id = ? AND filename = ?');
  const hasCover = db.prepare('SELECT COUNT(*) AS c FROM product_images WHERE product_id = ? AND is_cover = 1');
  const maxSort = db.prepare('SELECT COALESCE(MAX(sort_order), -1) AS m FROM product_images WHERE product_id = ?');
  const insert = db.prepare(
    'INSERT INTO product_images (product_id, filename, caption, alt_text, sort_order, is_cover, width, height) VALUES (?,?,?,?,?,?,?,?)'
  );
  const clearCover = db.prepare('UPDATE product_images SET is_cover = 0 WHERE product_id = ?');
  const setCover = db.prepare('UPDATE product_images SET is_cover = 1 WHERE product_id = ? AND filename = ?');

  let linked = 0;
  let skipped = 0;

  const tx = db.transaction(() => {
    for (const [slug, files] of Object.entries(PRODUCT_IMAGES)) {
      const product = getProduct.get(slug);
      if (!product) {
        skipped++;
        continue;
      }
      const existing = files.filter(fileExists);
      if (!existing.length) {
        console.warn(`Seed images: no files on disk for ${slug}`);
        skipped++;
        continue;
      }

      let sort = maxSort.get(product.id).m;
      for (const filename of existing) {
        if (hasFile.get(product.id, filename)) continue;
        sort += 1;
        const alt = product.name + ' — Garg Industrial Mesh';
        insert.run(product.id, filename, '', alt, sort, 0, null, null);
        linked++;
      }

      // Ensure a cover: prefer first mapped file that exists
      if (!hasCover.get(product.id).c) {
        clearCover.run(product.id);
        setCover.run(product.id, existing[0]);
      }
    }
  });

  tx();
  if (linked) console.log(`Seed images: linked ${linked} new image row(s).`);
  return { linked, skipped };
}

if (require.main === module) {
  const r = ensureProductImages();
  console.log('Done', r);
}

module.exports = { ensureProductImages, PRODUCT_IMAGES };
