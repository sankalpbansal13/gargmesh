const db = require('./db');
const { products, slugify, buildFaq } = require('./seed-data');

/**
 * Optional one-shot repair for SS Welded Mesh corruption.
 * Gated behind SEED_REPAIR_SS_WELDED=1 so normal boots never overwrite admin edits.
 */
function repairSsWeldedMesh() {
  if (process.env.SEED_REPAIR_SS_WELDED !== '1') return;
  const seed = products.find(p => slugify(p.name) === 'ss-welded-mesh');
  if (!seed) return;
  const row = db.prepare('SELECT id, description, meta_title, meta_description, meta_keywords, price_from, faq FROM products WHERE slug = ?').get('ss-welded-mesh');
  if (!row) return;
  const broken =
    !row.description || row.description.trim().length < 40 ||
    !row.meta_title || row.meta_title.trim().length < 10 ||
    !row.meta_description || row.meta_description.trim().length < 40 ||
    !row.meta_keywords || row.meta_keywords.trim().length < 10;
  if (!broken) return;
  db.prepare(`
    UPDATE products SET
      short_desc = ?, description = ?, materials = ?, sizes = ?, grades = ?, applications = ?,
      price_from = ?, faq = ?, meta_title = ?, meta_description = ?, meta_keywords = ?, featured = ?
    WHERE slug = ?
  `).run(
    seed.short_desc, seed.description, seed.materials, seed.sizes, seed.grades, seed.applications,
    seed.price_from, buildFaq(seed), seed.meta_title, seed.meta_description, seed.meta_keywords, seed.featured,
    'ss-welded-mesh'
  );
  console.log('Seed: repaired corrupted SS Welded Mesh content from seed-data (SEED_REPAIR_SS_WELDED=1).');
}

/** Insert any seed products that are missing from the DB (by slug). */
function ensureMissingProducts() {
  const exists = db.prepare('SELECT id FROM products WHERE slug = ?');
  // Soft-deleted rows use slug "...-deleted-{id}" — do not re-insert those products.
  const softDeleted = db.prepare(
    "SELECT id FROM products WHERE deleted = 1 AND (slug = ? OR slug LIKE ? OR name = ?)"
  );
  const insert = db.prepare(`
    INSERT INTO products
    (slug, name, category, short_desc, description, materials, sizes, grades, applications, price_from, faq, meta_title, meta_description, meta_keywords, featured)
    VALUES (@slug, @name, @category, @short_desc, @description, @materials, @sizes, @grades, @applications, @price_from, @faq, @meta_title, @meta_description, @meta_keywords, @featured)
  `);
  let added = 0;
  const tx = db.transaction((items) => {
    for (const p of items) {
      const slug = slugify(p.name);
      if (exists.get(slug)) continue;
      if (softDeleted.get(slug, slug + '-deleted-%', p.name)) continue;
      insert.run({ ...p, slug, faq: buildFaq(p) });
      added++;
      console.log(`Seed: added missing product ${p.name} (${slug}).`);
    }
  });
  tx(products);
  return added;
}

function run() {
  const count = db.prepare('SELECT COUNT(*) as c FROM products').get();
  if (count.c > 0) {
    console.log(`Seed: products already present (${count.c}). Checking for missing…`);
    repairSsWeldedMesh();
    ensureMissingProducts();
    return;
  }
  const insert = db.prepare(`
    INSERT INTO products
    (slug, name, category, short_desc, description, materials, sizes, grades, applications, price_from, faq, meta_title, meta_description, meta_keywords, featured)
    VALUES (@slug, @name, @category, @short_desc, @description, @materials, @sizes, @grades, @applications, @price_from, @faq, @meta_title, @meta_description, @meta_keywords, @featured)
  `);
  const tx = db.transaction((items) => {
    for (const p of items) {
      insert.run({ ...p, slug: slugify(p.name), faq: buildFaq(p) });
    }
  });
  tx(products);
  console.log(`Seed: inserted ${products.length} products.`);
}

if (require.main === module) run();
module.exports = { run, repairSsWeldedMesh, ensureMissingProducts };
