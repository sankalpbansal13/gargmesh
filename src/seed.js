const db = require('./db');
const { buildCatalog } = require('./seed-data');
const { ensureDesignImages } = require('./seed-images');
const { ensureBlogPosts } = require('./seed-blog');

function tableHasColumn(table, column) {
  return db.prepare(`PRAGMA table_info(${table})`).all().some((c) => c.name === column);
}

function retireLegacyCategories() {
  if (!tableHasColumn('categories', 'deleted')) return;
  const r = db.prepare(
    `UPDATE categories SET deleted = 1 WHERE slug IN ('perforated-sheets', 'bird-monkey-spikes') AND deleted = 0`
  ).run();
  if (r.changes) {
    console.log(`Seed: soft-deleted ${r.changes} legacy categor${r.changes === 1 ? 'y' : 'ies'}.`);
  }
}

/** Ensure seed materials exist; soft-delete design_materials not in the seed list for that design. */
function syncDesignMaterials(catalog) {
  const getCat = db.prepare('SELECT id FROM categories WHERE slug = ?');
  const getDesign = db.prepare(
    'SELECT id, COALESCE(admin_edited, 0) AS admin_edited, COALESCE(custom, 0) AS custom FROM designs WHERE category_id = ? AND slug = ? AND deleted = 0'
  );
  const hasMatDeleted = tableHasColumn('design_materials', 'deleted');
  const getMat = hasMatDeleted
    ? db.prepare('SELECT id, deleted FROM design_materials WHERE design_id = ? AND slug = ?')
    : db.prepare('SELECT id, 0 AS deleted FROM design_materials WHERE design_id = ? AND slug = ?');
  const insertMat = db.prepare(`
    INSERT INTO design_materials
    (design_id, slug, name, price_from, grades, short_desc, sort_order)
    VALUES (@design_id, @slug, @name, @price_from, @grades, @short_desc, @sort_order)
  `);
  const updateMat = db.prepare(`
    UPDATE design_materials SET name = ?, grades = ?, short_desc = ?, sort_order = ?
    WHERE id = ?
  `);
  const restoreMat = hasMatDeleted
    ? db.prepare('UPDATE design_materials SET deleted = 0 WHERE id = ?')
    : null;
  const softDeleteMat = hasMatDeleted
    ? db.prepare('UPDATE design_materials SET deleted = 1 WHERE design_id = ? AND slug = ? AND deleted = 0')
    : null;
  const listMats = db.prepare('SELECT id, slug FROM design_materials WHERE design_id = ?');

  let matsAdded = 0;
  let matsRestored = 0;
  let matsRetired = 0;

  const tx = db.transaction(() => {
    for (const cat of catalog.categories) {
      const catRow = getCat.get(cat.slug);
      if (!catRow) continue;
      for (const d of cat.designs) {
        const designRow = getDesign.get(catRow.id, d.slug);
        if (!designRow || designRow.admin_edited || designRow.custom) continue;
        const seedSlugs = new Set((d.materials || []).map((m) => m.slug));
        for (const m of d.materials || []) {
          const existing = getMat.get(designRow.id, m.slug);
          if (!existing) {
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
          } else {
            updateMat.run(m.name, m.grades, m.short_desc, m.sort_order, existing.id);
            if (hasMatDeleted && existing.deleted) {
              restoreMat.run(existing.id);
              matsRestored++;
            }
          }
        }
        if (softDeleteMat) {
          for (const row of listMats.all(designRow.id)) {
            if (!seedSlugs.has(row.slug)) {
              const r = softDeleteMat.run(designRow.id, row.slug);
              if (r.changes) matsRetired++;
            }
          }
        }
      }
    }
  });
  tx();

  if (matsAdded || matsRestored || matsRetired) {
    console.log(
      `Seed: materials synced (+${matsAdded} added, ${matsRestored} restored, ${matsRetired} soft-deleted).`
    );
  }
}

/** Soft-delete designs whose slugs are no longer in the seed list for that category. */
function retireDesignsNotInCatalog(catalog) {
  if (!tableHasColumn('designs', 'deleted')) return;
  const getCat = db.prepare('SELECT id FROM categories WHERE slug = ?');
  const list = db.prepare(
    'SELECT id, slug, COALESCE(custom, 0) AS custom FROM designs WHERE category_id = ? AND deleted = 0'
  );
  const retire = db.prepare('UPDATE designs SET deleted = 1 WHERE id = ? AND deleted = 0');
  let n = 0;
  const tx = db.transaction(() => {
    for (const cat of catalog.categories) {
      const row = getCat.get(cat.slug);
      if (!row) continue;
      const keep = new Set((cat.designs || []).map((d) => d.slug));
      for (const d of list.all(row.id)) {
        if (d.custom) continue;
        if (!keep.has(d.slug)) {
          if (retire.run(d.id).changes) n++;
        }
      }
    }
  });
  tx();
  if (n) console.log(`Seed: soft-deleted ${n} design${n === 1 ? '' : 's'} no longer in the catalogue.`);
}

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
  const getDesign = db.prepare(
    'SELECT id, slug, COALESCE(admin_edited, 0) AS admin_edited, COALESCE(custom, 0) AS custom FROM designs WHERE category_id = ? AND slug = ?'
  );
  const getDesignBySort = db.prepare(
    `SELECT id, slug, COALESCE(admin_edited, 0) AS admin_edited, COALESCE(custom, 0) AS custom
     FROM designs WHERE category_id = ? AND sort_order = ? AND deleted = 0
       AND COALESCE(admin_edited, 0) = 0 AND COALESCE(custom, 0) = 0`
  );
  const retiredSlug = db.prepare(
    'SELECT id, slug FROM designs WHERE category_id = ? AND deleted = 1'
  );
  const updateDesign = db.prepare(`
    UPDATE designs SET
      slug = @slug, name = @name, hole_shape = @hole_shape, hole_mm = @hole_mm, pitch_mm = @pitch_mm,
      angle_deg = @angle_deg, open_area_pct = @open_area_pct, short_desc = @short_desc,
      description = @description, applications = @applications, faq = @faq,
      meta_title = @meta_title, meta_description = @meta_description, meta_keywords = @meta_keywords,
      sort_order = @sort_order, featured = @featured, deleted = 0
    WHERE id = @id
  `);
  const insertMat = db.prepare(`
    INSERT INTO design_materials
    (design_id, slug, name, price_from, grades, short_desc, sort_order)
    VALUES (@design_id, @slug, @name, @price_from, @grades, @short_desc, @sort_order)
  `);
  const getMat = db.prepare('SELECT id FROM design_materials WHERE design_id = ? AND slug = ?');
  const hasCatDeleted = tableHasColumn('categories', 'deleted');

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
        if (hasCatDeleted) {
          db.prepare(`
            UPDATE categories SET guide_sections = ?, short_desc = ?, description = ?,
              meta_title = ?, meta_description = ?, meta_keywords = ?, featured = ?, sort_order = ?, name = ?, deleted = 0
            WHERE id = ?
          `).run(
            cat.guide_sections || null, cat.short_desc, cat.description,
            cat.meta_title, cat.meta_description, cat.meta_keywords, cat.featured, cat.sort_order, cat.name,
            catRow.id
          );
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
      }
      for (const d of cat.designs) {
        let designRow = getDesign.get(catRow.id, d.slug);
        if (!designRow) {
          const bySort = getDesignBySort.get(catRow.id, d.sort_order);
          if (bySort) designRow = bySort;
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
          const buried = retiredSlug.all(catRow.id).some((r) => r.slug === d.slug + '-deleted-' + r.id);
          if (buried) continue;
          insertDesign.run(payload);
          designRow = getDesign.get(catRow.id, d.slug);
          designsAdded++;
        } else if (!designRow.admin_edited && !designRow.custom) {
          updateDesign.run({ ...payload, id: designRow.id });
          designsUpdated++;
        }
        if (designRow.admin_edited || designRow.custom) continue;
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

  retireLegacyCategories();
  syncDesignMaterials(catalog);
  retireDesignsNotInCatalog(catalog);

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
