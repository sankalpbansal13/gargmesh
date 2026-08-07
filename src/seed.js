const db = require('./db');
const { buildCatalog } = require('./seed-data');
const { ensureDesignImages } = require('./seed-images');
const { ensureBlogPosts } = require('./seed-blog');

function ensureCatalog() {
  const catalog = buildCatalog();
  const catCount = db.prepare('SELECT COUNT(*) AS c FROM categories').get().c;

  const insertCat = db.prepare(`
    INSERT INTO categories
    (slug, name, short_desc, description, guide_sections, meta_title, meta_description, meta_keywords, sort_order, featured)
    VALUES (@slug, @name, @short_desc, @description, @guide_sections, @meta_title, @meta_description, @meta_keywords, @sort_order, @featured)
  `);
  const getCat = db.prepare('SELECT id FROM categories WHERE slug = ?');
  const insertDesign = db.prepare(`
    INSERT INTO designs
    (category_id, slug, name, hole_shape, hole_mm, pitch_mm, angle_deg, open_area_pct,
     short_desc, description, applications, faq, meta_title, meta_description, meta_keywords, sort_order, featured)
    VALUES
    (@category_id, @slug, @name, @hole_shape, @hole_mm, @pitch_mm, @angle_deg, @open_area_pct,
     @short_desc, @description, @applications, @faq, @meta_title, @meta_description, @meta_keywords, @sort_order, @featured)
  `);
  const getDesign = db.prepare('SELECT id, slug FROM designs WHERE category_id = ? AND slug = ?');
  const getDesignBySort = db.prepare(
    'SELECT id, slug FROM designs WHERE category_id = ? AND sort_order = ? AND deleted = 0'
  );
  const updateDesign = db.prepare(`
    UPDATE designs SET
      slug = @slug, name = @name, hole_shape = @hole_shape, hole_mm = @hole_mm, pitch_mm = @pitch_mm,
      angle_deg = @angle_deg, open_area_pct = @open_area_pct, short_desc = @short_desc,
      description = @description, applications = @applications, faq = @faq,
      meta_title = @meta_title, meta_description = @meta_description, meta_keywords = @meta_keywords,
      sort_order = @sort_order, featured = @featured
    WHERE id = @id
  `);
  const insertMat = db.prepare(`
    INSERT INTO design_materials
    (design_id, slug, name, price_from, grades, short_desc, sort_order)
    VALUES (@design_id, @slug, @name, @price_from, @grades, @short_desc, @sort_order)
  `);
  const getMat = db.prepare('SELECT id FROM design_materials WHERE design_id = ? AND slug = ?');

  let catsAdded = 0;
  let designsAdded = 0;
  let designsUpdated = 0;
  let matsAdded = 0;

  const tx = db.transaction(() => {
    for (const cat of catalog.categories) {
      let catRow = getCat.get(cat.slug);
      if (!catRow) {
        insertCat.run({
          slug: cat.slug,
          name: cat.name,
          short_desc: cat.short_desc,
          description: cat.description,
          guide_sections: cat.guide_sections,
          meta_title: cat.meta_title,
          meta_description: cat.meta_description,
          meta_keywords: cat.meta_keywords,
          sort_order: cat.sort_order,
          featured: cat.featured
        });
        catRow = getCat.get(cat.slug);
        catsAdded++;
        console.log('Seed: added category', cat.name);
      } else {
        db.prepare(`
          UPDATE categories SET guide_sections = ?, short_desc = ?, description = ?,
            meta_title = ?, meta_description = ?, meta_keywords = ?, featured = ?, sort_order = ?, name = ?
          WHERE id = ?
        `).run(
          cat.guide_sections || null, cat.short_desc, cat.description,
          cat.meta_title, cat.meta_description, cat.meta_keywords, cat.featured, cat.sort_order, cat.name,
          catRow.id
        );
      }
      for (const d of cat.designs) {
        let designRow = getDesign.get(catRow.id, d.slug);
        if (!designRow) {
          designRow = getDesignBySort.get(catRow.id, d.sort_order);
        }
        const payload = {
          category_id: catRow.id,
          slug: d.slug,
          name: d.name,
          hole_shape: d.hole_shape,
          hole_mm: d.hole_mm,
          pitch_mm: d.pitch_mm,
          angle_deg: d.angle_deg,
          open_area_pct: d.open_area_pct,
          short_desc: d.short_desc,
          description: d.description,
          applications: d.applications,
          faq: d.faq,
          meta_title: d.meta_title,
          meta_description: d.meta_description,
          meta_keywords: d.meta_keywords,
          sort_order: d.sort_order,
          featured: d.featured
        };
        if (!designRow) {
          insertDesign.run(payload);
          designRow = getDesign.get(catRow.id, d.slug);
          designsAdded++;
        } else {
          updateDesign.run({ ...payload, id: designRow.id });
          designsUpdated++;
        }
        for (const m of d.materials) {
          if (getMat.get(designRow.id, m.slug)) continue;
          insertMat.run({
            design_id: designRow.id,
            slug: m.slug,
            name: m.name,
            price_from: m.price_from,
            grades: m.grades,
            short_desc: m.short_desc,
            sort_order: m.sort_order
          });
          matsAdded++;
        }
      }
    }
  });
  tx();

  if (catCount === 0) {
    console.log(`Seed: catalog inserted (${catsAdded} categories, ${designsAdded} designs, ${matsAdded} materials).`);
  } else if (catsAdded || designsAdded || matsAdded || designsUpdated) {
    console.log(`Seed: catalog ensured (+${catsAdded} cat, +${designsAdded} designs, ~${designsUpdated} updated, +${matsAdded} materials).`);
  } else {
    console.log('Seed: catalog already present.');
  }
}

function run() {
  ensureCatalog();
  ensureDesignImages();
  ensureBlogPosts();
}

if (require.main === module) run();
module.exports = { run, ensureCatalog };
