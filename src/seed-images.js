/**
 * Copy perforated pattern images from PERFORATED SHEET/ into public/uploads
 * and link them to designs (material-tagged). Idempotent.
 */
const fs = require('fs');
const path = require('path');
const db = require('./db');
const { designSlug } = require('./seed-data');

const root = path.join(__dirname, '..');
const uploadsDir = path.join(root, 'public', 'uploads');
const copperDir = path.join(root, 'PERFORATED SHEET', 'copper perforated sheets', 'images', 'copper');
const brassDir = path.join(root, 'PERFORATED SHEET', 'garg-brass-perforated-sheet-buying-guide', 'images', 'brass');
const msDir = path.join(root, 'PERFORATED SHEET', 'ms ss gi perforated sheet', 'images');

/** design n → source filenames in each material folder */
const COPPER_BRASS = {
  1: '01_R2_P3.5_60deg_OA29.6.png',
  2: '02_R3_P5_60deg_OA32.7.png',
  3: '03_R4_P5.5_60deg_OA48.0.png',
  4: '04_R5_P8_60deg_OA35.4.png',
  5: '05_R6_P9_60deg_OA40.3.png',
  6: '06_R8_P11_60deg_OA48.0.png',
  7: '07_R10_P14_60deg_OA46.3.png',
  8: '08_R12_P16_60deg_OA51.0.png',
  9: '09_R15_P21_60deg_OA46.3.png',
  10: '10_R20_P28_60deg_OA46.3.png',
  11: '11_R25_P30_60deg_OA63.0.png',
  12: '12_R30_P40_60deg_OA51.0.png',
  13: '13_R3_P8_90deg_OA11.0.png',
  14: '14_R4_P9.5_90deg_OA13.9.png',
  15: '15_R5_P14_90deg_OA10.0.png',
  16: '16_R8_P16_90deg_OA19.6.png',
  17: '17_R10_P20_90deg_OA19.6.png',
  18: '18_R12_P26_90deg_OA16.7.png',
  19: '19_SQ4_P6_90deg_OA44.4.png',
  20: '20_SQ5_P7_90deg_OA51.0.png',
  21: '21_SQ6_P8_90deg_OA56.3.png',
  22: '22_SQ8_P11_90deg_OA52.9.png',
  23: '23_SQ10_P13_90deg_OA59.2.png',
  24: '24_SQ15_P21_90deg_OA51.0.png',
  25: '25_Hex6_P8_60deg_OA56.3.png',
  26: '26_Hex7_P10_60deg_OA49.0.png',
  27: '27_Hex8_P10_60deg_OA64.0.png',
  28: '28_Hex10_P12.5_60deg_OA64.0.png',
  29: '29_Hex12_P14_60deg_OA73.5.png'
};

const MS_FILES = {
  1: 'MS_SS_GI_ALU_Perforated_Sheet_H2_P3.5_OA29.6_Round_60.png',
  2: 'MS_SS_GI_ALU_Perforated_Sheet_H3_P5_OA32.6_Round_60.png',
  3: 'MS_SS_GI_ALU_Perforated_Sheet_H4_P5.5_OA48.0_Round_60.png',
  4: 'MS_SS_GI_ALU_Perforated_Sheet_H5_P8_OA35.4_Round_60.png',
  5: 'MS_SS_GI_ALU_Perforated_Sheet_H6_P9_OA40.3_Round_60.png',
  6: 'MS_SS_GI_ALU_Perforated_Sheet_H8_P11_OA48.0_Round_60.png',
  7: 'MS_SS_GI_ALU_Perforated_Sheet_H10_P14_OA46.3_Round_60.png',
  8: 'MS_SS_GI_ALU_Perforated_Sheet_H12_P16_OA51.0_Round_60.png',
  9: 'MS_SS_GI_ALU_Perforated_Sheet_H15_P21_OA46.3_Round_60.png',
  10: 'MS_SS_GI_ALU_Perforated_Sheet_H20_P28_OA46.3_Round_60.png',
  11: 'MS_SS_GI_ALU_Perforated_Sheet_H25_P30_OA63.0_Round_60.png',
  12: 'MS_SS_GI_ALU_Perforated_Sheet_H30_P40_OA51.0_Round_60.png',
  13: 'MS_SS_GI_ALU_Perforated_Sheet_H3_P8_OA11.0_Round_90.png',
  14: 'MS_SS_GI_ALU_Perforated_Sheet_H4_P9.5_OA13.9_Round_90.png',
  15: 'MS_SS_GI_ALU_Perforated_Sheet_H5_P14_OA10.0_Round_90.png',
  16: 'MS_SS_GI_ALU_Perforated_Sheet_H8_P16_OA19.6_Round_90.png',
  17: 'MS_SS_GI_ALU_Perforated_Sheet_H10_P20_OA19.6_Round_90.png',
  18: 'MS_SS_GI_ALU_Perforated_Sheet_H12_P26_OA16.7_Round_90.png',
  19: 'MS_SS_GI_ALU_Perforated_Sheet_H4_P6_OA44.4_Square_90.png',
  20: 'MS_SS_GI_ALU_Perforated_Sheet_H5_P7_OA51.0_Square_90.png',
  21: 'MS_SS_GI_ALU_Perforated_Sheet_H6_P8_OA56.2_Square_90.png',
  22: 'MS_SS_GI_ALU_Perforated_Sheet_H8_P11_OA52.9_Square_90.png',
  23: 'MS_SS_GI_ALU_Perforated_Sheet_H10_P13_OA59.2_Square_90.png',
  24: 'MS_SS_GI_ALU_Perforated_Sheet_H15_P21_OA51.0_Square_90.png',
  25: 'MS_SS_GI_ALU_Perforated_Sheet_H6_P8_OA56.3_Hex_60.png',
  26: 'MS_SS_GI_ALU_Perforated_Sheet_H7_P10_OA49.0_Hex_60.png',
  27: 'MS_SS_GI_ALU_Perforated_Sheet_H8_P10_OA64.0_Hex_60.png',
  28: 'MS_SS_GI_ALU_Perforated_Sheet_H10_P12.5_OA64.0_Hex_60.png',
  29: 'MS_SS_GI_ALU_Perforated_Sheet_H12_P14_OA73.5_Hex_60.png'
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyIfNeeded(src, destName) {
  const dest = path.join(uploadsDir, destName);
  if (!fs.existsSync(src)) return null;
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
  }
  return destName;
}

function ensureDesignImages() {
  ensureDir(uploadsDir);
  const getDesign = db.prepare(
    `SELECT d.id, d.name, d.slug FROM designs d
     JOIN categories c ON c.id = d.category_id
     WHERE c.slug = 'perforated-sheets' AND d.slug = ? AND d.deleted = 0`
  );
  const hasFile = db.prepare(
    'SELECT id FROM design_images WHERE design_id = ? AND filename = ?'
  );
  const hasCover = db.prepare(
    'SELECT COUNT(*) AS c FROM design_images WHERE design_id = ? AND is_cover = 1'
  );
  const insert = db.prepare(
    `INSERT INTO design_images
     (design_id, filename, caption, alt_text, sort_order, is_cover, width, height, material_slug)
     VALUES (?,?,?,?,?,?,?,?,?)`
  );
  const setCover = db.prepare(
    'UPDATE design_images SET is_cover = 1 WHERE design_id = ? AND filename = ?'
  );
  const clearCover = db.prepare('UPDATE design_images SET is_cover = 0 WHERE design_id = ?');

  let linked = 0;
  let copied = 0;

  const tx = db.transaction(() => {
    for (let n = 1; n <= 29; n++) {
      const slug = designSlug(n);
      const design = getDesign.get(slug);
      if (!design) continue;

      const jobs = [
        { material: 'copper', src: path.join(copperDir, COPPER_BRASS[n]), dest: `perf-${String(n).padStart(2, '0')}-copper.png`, sort: 2, cover: false },
        { material: 'brass', src: path.join(brassDir, COPPER_BRASS[n]), dest: `perf-${String(n).padStart(2, '0')}-brass.png`, sort: 3, cover: false },
        { material: 'mild-steel', src: path.join(msDir, MS_FILES[n]), dest: `perf-${String(n).padStart(2, '0')}-ms.png`, sort: 1, cover: true }
      ];

      for (const job of jobs) {
        const before = fs.existsSync(path.join(uploadsDir, job.dest));
        const filename = copyIfNeeded(job.src, job.dest);
        if (!filename) continue;
        if (!before) copied++;
        if (hasFile.get(design.id, filename)) continue;
        const alt = `${design.name} — ${job.material} perforated sheet — Garg Industrial Mesh`;
        insert.run(design.id, filename, '', alt, job.sort, 0, null, null, job.material);
        linked++;
      }

      // Also reuse MS image for gi / stainless-steel / aluminium until dedicated renders exist
      const msName = `perf-${String(n).padStart(2, '0')}-ms.png`;
      if (fs.existsSync(path.join(uploadsDir, msName))) {
        for (const mat of ['gi', 'stainless-steel', 'aluminium']) {
          if (hasFile.get(design.id, msName) && db.prepare(
            'SELECT id FROM design_images WHERE design_id = ? AND filename = ? AND material_slug = ?'
          ).get(design.id, msName, mat)) continue;
          // One row per material pointing at same file is OK for picker swap
          const existsMat = db.prepare(
            'SELECT id FROM design_images WHERE design_id = ? AND material_slug = ?'
          ).get(design.id, mat);
          if (existsMat) continue;
          const alt = `${design.name} — ${mat} perforated sheet — Garg Industrial Mesh`;
          insert.run(design.id, msName, '', alt, 1, 0, null, null, mat);
          linked++;
        }
      }

      if (!hasCover.get(design.id).c && fs.existsSync(path.join(uploadsDir, msName))) {
        clearCover.run(design.id);
        setCover.run(design.id, msName);
      }
    }
  });

  tx();

  // Extra sheet types from source/ (non-perforated hubs) — gallery / fallback
  const extra = ensureSourceCategoryImages();
  copied += extra.copied;
  linked += extra.linked;

  // Studio product covers (preferred for design cards)
  const studio = ensureStudioImages();
  copied += studio.copied;
  linked += studio.linked;

  if (copied || linked) {
    console.log(`Seed images: copied ${copied} file(s), linked ${linked} design image row(s).`);
  }
  return { copied, linked };
}

/**
 * Copy AI studio covers from assets/studio into uploads and set as design covers.
 * - SS welded: one unique cover per design
 * - Chain / Machhar / PVC / Bird: one shared cover for every design
 * - Expanded: front / back / light-through per design (front = cover)
 */
function ensureStudioImages() {
  const studioRoot = path.join(root, 'assets', 'studio');
  const hasFile = db.prepare(
    'SELECT id FROM design_images WHERE design_id = ? AND filename = ?'
  );
  const insert = db.prepare(
    `INSERT INTO design_images
     (design_id, filename, caption, alt_text, sort_order, is_cover, width, height, material_slug)
     VALUES (?,?,?,?,?,?,?,?,?)`
  );
  const clearCover = db.prepare('UPDATE design_images SET is_cover = 0 WHERE design_id = ?');
  const setCover = db.prepare(
    'UPDATE design_images SET is_cover = 1 WHERE design_id = ? AND filename = ?'
  );
  const getDesign = db.prepare(
    `SELECT d.id, d.name FROM designs d
     JOIN categories c ON c.id = d.category_id
     WHERE c.slug = ? AND d.slug = ? AND d.deleted = 0`
  );
  const getDesignsInCat = db.prepare(
    `SELECT d.id, d.name, d.slug FROM designs d
     JOIN categories c ON c.id = d.category_id
     WHERE c.slug = ? AND d.deleted = 0`
  );

  let copied = 0;
  let linked = 0;

  function linkCover(design, destName, alt, sortOrder, asCover) {
    if (!fs.existsSync(path.join(uploadsDir, destName))) return;
    if (!hasFile.get(design.id, destName)) {
      insert.run(design.id, destName, '', alt, sortOrder, 0, null, null, null);
      linked++;
    }
    if (asCover) {
      clearCover.run(design.id);
      setCover.run(design.id, destName);
    }
  }

  // SS Welded Mesh 01–29
  const ssDir = path.join(studioRoot, 'ss-welded');
  for (let n = 1; n <= 29; n++) {
    const pad = String(n).padStart(2, '0');
    const src = path.join(ssDir, `ss-welded-${pad}.png`);
    const dest = `studio-ss-welded-${pad}.png`;
    const before = fs.existsSync(path.join(uploadsDir, dest));
    const name = copyIfNeeded(src, dest);
    if (name && !before) copied++;
    const design = getDesign.get('ss-welded-mesh', `ss-welded-${pad}`);
    if (design && name) {
      linkCover(design, dest, `${design.name} — studio — Garg Industrial Mesh`, 0, true);
    }
  }

  // Shared one-image categories
  const shared = [
    { cat: 'chain-link-mesh', file: 'chain-link-shared.png', dest: 'studio-chain-link-shared.png' },
    { cat: 'door-machhar-jali', file: 'machhar-shared.png', dest: 'studio-machhar-shared.png' },
    { cat: 'pvc-plastic-jali', file: 'pvc-shared.png', dest: 'studio-pvc-shared.png' },
    { cat: 'bird-monkey-spikes', file: 'bird-spikes-shared.png', dest: 'studio-bird-spikes-shared.png' }
  ];
  const sharedDir = path.join(studioRoot, 'shared');
  for (const job of shared) {
    const src = path.join(sharedDir, job.file);
    const before = fs.existsSync(path.join(uploadsDir, job.dest));
    const name = copyIfNeeded(src, job.dest);
    if (name && !before) copied++;
    if (!name) continue;
    for (const design of getDesignsInCat.all(job.cat)) {
      linkCover(design, job.dest, `${design.name} — studio — Garg Industrial Mesh`, 0, true);
    }
  }

  // Expanded mesh — 3 views per design
  const expDir = path.join(studioRoot, 'expanded');
  const views = [
    { key: 'front', sort: 1, cover: true },
    { key: 'back', sort: 2, cover: false },
    { key: 'light-through', sort: 3, cover: false }
  ];
  for (const design of getDesignsInCat.all('expanded-mesh')) {
    for (const v of views) {
      const srcName = `${design.slug}-${v.key}.png`;
      const dest = `studio-expanded-${design.slug}-${v.key}.png`;
      const src = path.join(expDir, srcName);
      const before = fs.existsSync(path.join(uploadsDir, dest));
      const name = copyIfNeeded(src, dest);
      if (name && !before) copied++;
      if (!name) continue;
      linkCover(
        design,
        dest,
        `${design.name} — ${v.key} — Garg Industrial Mesh`,
        v.sort,
        v.cover
      );
    }
  }

  return { copied, linked };
}

/** Copy product images from source/<folder>/images and attach covers to designs. */
function ensureSourceCategoryImages() {
  const { extraCategories } = require('./catalog');
  const { uploadName } = require('./catalog/helpers');
  const hasFile = db.prepare(
    'SELECT id FROM design_images WHERE design_id = ? AND filename = ?'
  );
  const hasCover = db.prepare(
    'SELECT COUNT(*) AS c FROM design_images WHERE design_id = ? AND is_cover = 1'
  );
  const insert = db.prepare(
    `INSERT INTO design_images
     (design_id, filename, caption, alt_text, sort_order, is_cover, width, height, material_slug)
     VALUES (?,?,?,?,?,?,?,?,?)`
  );
  const clearCover = db.prepare('UPDATE design_images SET is_cover = 0 WHERE design_id = ?');
  const setCover = db.prepare(
    'UPDATE design_images SET is_cover = 1 WHERE design_id = ? AND filename = ?'
  );
  const getDesign = db.prepare(
    `SELECT d.id, d.name FROM designs d
     JOIN categories c ON c.id = d.category_id
     WHERE c.slug = ? AND d.slug = ? AND d.deleted = 0`
  );

  let copied = 0;
  let linked = 0;

  for (const cat of extraCategories()) {
    const folder = cat.content_folder;
    if (!folder) continue;
    const imgDir = path.join(root, 'source', folder, 'images');
    if (!fs.existsSync(imgDir)) continue;

    const files = fs.readdirSync(imgDir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f) && !/logo/i.test(f));
    const copiedNames = [];
    for (const f of files) {
      const dest = uploadName(folder, f);
      const before = fs.existsSync(path.join(uploadsDir, dest));
      const name = copyIfNeeded(path.join(imgDir, f), dest);
      if (name && !before) copied++;
      if (name) copiedNames.push(name);
    }

    // Prefer hero / closeup as cover for every design in the category
    const coverName =
      copiedNames.find((n) => /hero/i.test(n)) ||
      copiedNames.find((n) => /closeup|product|roll|weave/i.test(n)) ||
      copiedNames[0];
    if (!coverName) continue;

    for (const d of cat.designs) {
      const design = getDesign.get(cat.slug, d.slug);
      if (!design) continue;
      if (!hasFile.get(design.id, coverName)) {
        const matSlug = (d.materials && d.materials[0] && d.materials[0].slug) || null;
        insert.run(design.id, coverName, '', design.name + ' — Garg Industrial Mesh', 1, 0, null, null, matSlug);
        linked++;
      }
      // Attach a few more gallery images (shared) for picker variety
      let sort = 2;
      for (const fname of copiedNames.slice(0, 4)) {
        if (fname === coverName) continue;
        if (hasFile.get(design.id, fname)) continue;
        insert.run(design.id, fname, '', design.name + ' — Garg Industrial Mesh', sort++, 0, null, null, null);
        linked++;
      }
      if (!hasCover.get(design.id).c) {
        clearCover.run(design.id);
        setCover.run(design.id, coverName);
      }
    }
  }

  return { copied, linked };
}

/** @deprecated legacy product image linker — no-op */
function ensureProductImages() {
  return { linked: 0, skipped: 0 };
}

if (require.main === module) {
  console.log(ensureDesignImages());
}

module.exports = { ensureDesignImages, ensureProductImages };
