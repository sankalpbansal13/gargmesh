const fs = require('fs');
const path = require('path');
const db = require('../src/db');

const ms = db.prepare("SELECT id FROM products WHERE slug = 'ms-welded-mesh'").get();
if (!ms) {
  console.error('MS product not found');
  process.exit(1);
}

db.prepare('DELETE FROM product_images WHERE product_id = ?').run(ms.id);

const src = path.join(__dirname, '..', 'public', 'uploads', 'ss-welded-mesh-cover.jpeg');
const destName = 'ms-welded-mesh-cover.jpeg';
const dest = path.join(__dirname, '..', 'public', 'uploads', destName);
fs.copyFileSync(src, dest);

let w = 800;
let h = 600;
try {
  const sizeOf = require('image-size');
  const fn = sizeOf.imageSize || sizeOf;
  const d = fn(dest);
  w = d.width;
  h = d.height;
} catch (e) {
  console.log('sizeOf skip', e.message);
}

db.prepare(
  'INSERT INTO product_images (product_id, filename, caption, alt_text, sort_order, is_cover, width, height) VALUES (?,?,?,?,?,?,?,?)'
).run(ms.id, destName, 'MS welded mesh', 'MS welded mesh — Garg Industrial Mesh', 1, 1, w, h);

const expSrc = 'C:\\Users\\bhavy\\Downloads\\website images\\expanded mesh design.jpeg';
const expDest = path.join(__dirname, '..', 'public', 'gallery-expanded-mesh.jpg');
if (fs.existsSync(expSrc)) {
  fs.copyFileSync(expSrc, expDest);
  console.log('Gallery: gallery-expanded-mesh.jpg');
}

console.log('MS images now:', db.prepare('SELECT filename, alt_text, is_cover FROM product_images WHERE product_id = ?').all(ms.id));
