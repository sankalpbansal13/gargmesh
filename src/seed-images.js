/**
 * Copy perforated pattern images from PERFORATED SHEET/ into public/uploads
 * and link them to designs (material-tagged). Idempotent.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
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

function copyIfNeeded(src, destName, force) {
  const dest = path.join(uploadsDir, destName);
  if (!fs.existsSync(src)) return null;
  const shouldForce = force || /^(1|true|yes)$/i.test(String(process.env.FORCE_STUDIO_COPY || ''));
  if (!fs.existsSync(dest) || shouldForce) {
    fs.copyFileSync(src, dest);
  }
  return destName;
}

function fileMd5(absPath) {
  try {
    if (!absPath || !fs.existsSync(absPath)) return null;
    return crypto.createHash('md5').update(fs.readFileSync(absPath)).digest('hex');
  } catch (e) {
    return null;
  }
}

function ensureDesignImages() {
  ensureDir(uploadsDir);
  const getDesignsBySlug = db.prepare(
    `SELECT d.id, d.name, d.slug, c.slug AS category_slug FROM designs d
     JOIN categories c ON c.id = d.category_id
     WHERE c.deleted = 0 AND d.deleted = 0 AND d.slug = ?
       AND (c.slug = 'perforated-sheets' OR c.slug LIKE 'perforated-%')`
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

  const matsForCategory = (catSlug) => {
    if (catSlug === 'perforated-copper') return ['copper'];
    if (catSlug === 'perforated-brass') return ['brass'];
    if (catSlug === 'perforated-ms-gi-ss-al' || catSlug === 'perforated-sheets') {
      return ['mild-steel', 'gi', 'stainless-steel', 'aluminium'];
    }
    return ['mild-steel', 'gi', 'stainless-steel', 'aluminium', 'copper', 'brass'];
  };

  const tx = db.transaction(() => {
    for (let n = 1; n <= 29; n++) {
      const slug = designSlug(n);
      const designs = getDesignsBySlug.all(slug);
      if (!designs.length) continue;

      // Copy source files once per pattern
      const fileJobs = {
        copper: { src: path.join(copperDir, COPPER_BRASS[n]), dest: `perf-${String(n).padStart(2, '0')}-copper.png` },
        brass: { src: path.join(brassDir, COPPER_BRASS[n]), dest: `perf-${String(n).padStart(2, '0')}-brass.png` },
        'mild-steel': { src: path.join(msDir, MS_FILES[n]), dest: `perf-${String(n).padStart(2, '0')}-ms.png` }
      };
      for (const job of Object.values(fileJobs)) {
        const before = fs.existsSync(path.join(uploadsDir, job.dest));
        const filename = copyIfNeeded(job.src, job.dest);
        if (filename && !before) copied++;
      }

      for (const design of designs) {
        const allowed = matsForCategory(design.category_slug);
        // One cover image per perforated design — same hole pattern in different
        // metals should not create a multi-image blinker on cards/step 3.
        const coverMat = allowed.includes('mild-steel')
          ? 'mild-steel'
          : allowed.includes('copper')
            ? 'copper'
            : allowed.includes('brass')
              ? 'brass'
              : allowed[0];
        let coverName;
        if (coverMat === 'copper') coverName = fileJobs.copper.dest;
        else if (coverMat === 'brass') coverName = fileJobs.brass.dest;
        else coverName = fileJobs['mild-steel'].dest;

        // One image only — wipe material variants of the same hole pattern
        db.prepare('DELETE FROM design_images WHERE design_id = ?').run(design.id);
        if (fs.existsSync(path.join(uploadsDir, coverName))) {
          const alt = `${design.name} — perforated sheet — Garg Industrial Mesh`;
          insert.run(design.id, coverName, '', alt, 1, 1, null, null, coverMat);
          linked++;
        }
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
 * Categories that get a curated studio gallery. Source-folder dumps must not
 * stack on top — that created near-identical multi-image blinkers.
 */
const STUDIO_OWNED_CATS = new Set([
  'ss-welded-mesh',
  'expanded-mesh',
  'chain-link-mesh',
  'door-machhar-jali',
  'pvc-plastic-jali',
  'bird-spikes',
  'monkey-spikes',
  'anti-bird-net'
]);

/**
 * Copy AI studio covers from assets/studio into uploads and set as design covers.
 * Each studio-owned category replaces its gallery (no leftover source duplicates).
 * - Welded: one product shot + measure diagram (skip near-same SKU+shape pair)
 * - Chain / Machhar / PVC / Monkey / Net: distinct studio pack only
 * - Bird spikes: one material-specific cover
 * - Expanded: front / back / light-through per design
 */
function ensureStudioImages() {
  const studioRoot = path.join(root, 'assets', 'studio');
  const insert = db.prepare(
    `INSERT INTO design_images
     (design_id, filename, caption, alt_text, sort_order, is_cover, width, height, material_slug)
     VALUES (?,?,?,?,?,?,?,?,?)`
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
  const clearDesignGallery = db.prepare('DELETE FROM design_images WHERE design_id = ?');

  let copied = 0;
  let linked = 0;

  function wipeCat(catSlug) {
    for (const design of getDesignsInCat.all(catSlug)) {
      clearDesignGallery.run(design.id);
    }
  }

  function addImage(design, destName, alt, sortOrder, asCover, seenHashes) {
    const abs = path.join(uploadsDir, destName);
    if (!fs.existsSync(abs)) return false;
    const hash = fileMd5(abs);
    if (hash && seenHashes) {
      if (seenHashes.has(hash)) return false; // identical bytes — skip near/exact dup
      seenHashes.add(hash);
    }
    insert.run(design.id, destName, '', alt, sortOrder, asCover ? 1 : 0, null, null, null);
    linked++;
    return true;
  }

  // Welded Mesh — one mesh photo + measure (shape OR per-SKU, never both — they look nearly identical)
  wipeCat('ss-welded-mesh');
  const ssDir = path.join(studioRoot, 'ss-welded');
  const squareDest = 'studio-welded-square.png';
  const rectDest = 'studio-welded-rect.png';
  const measureDest = 'studio-welded-measure.png';
  [
    ['welded-square.png', squareDest],
    ['welded-rect.png', rectDest],
    ['welded-measure.png', measureDest]
  ].forEach(([file, dest]) => {
    const src = path.join(ssDir, file);
    if (copyIfNeeded(src, dest, true)) copied++;
  });
  for (const design of getDesignsInCat.all('ss-welded-mesh')) {
    const seen = new Set();
    const shapeRow = db.prepare('SELECT hole_shape FROM designs WHERE id = ?').get(design.id);
    const isRect = shapeRow && /rect/i.test(shapeRow.hole_shape || '');
    const shapeFile = isRect ? rectDest : squareDest;
    const pad = (design.slug.match(/(\d+)$/) || [])[1];
    let coverFile = shapeFile;
    if (pad) {
      const src = path.join(ssDir, `ss-welded-${pad}.png`);
      const dest = `studio-ss-welded-${pad}.png`;
      if (copyIfNeeded(src, dest, true)) copied++;
      if (fs.existsSync(path.join(uploadsDir, dest))) coverFile = dest;
    }
    addImage(
      design,
      coverFile,
      `${design.name} — ${isRect ? 'rectangular' : 'square'} — Garg Industrial Mesh`,
      1,
      true,
      seen
    );
    addImage(design, measureDest, `${design.name} — how to measure — Garg Industrial Mesh`, 2, false, seen);
  }

  // Replace gallery with curated studio pack (distinct views only)
  function linkPack(catSlug, files) {
    wipeCat(catSlug);
    for (const design of getDesignsInCat.all(catSlug)) {
      const seen = new Set();
      let sort = 1;
      let coverSet = false;
      files.forEach((f) => {
        const src = path.isAbsolute(f.src) ? f.src : path.join(studioRoot, f.src);
        const dest = f.dest;
        if (copyIfNeeded(src, dest, true)) copied++;
        const ok = addImage(
          design,
          dest,
          `${design.name} — studio — Garg Industrial Mesh`,
          sort,
          !coverSet,
          seen
        );
        if (ok) {
          coverSet = true;
          sort++;
        }
      });
    }
  }

  linkPack('chain-link-mesh', [
    { src: 'shared/chain-link-shared.png', dest: 'studio-chain-link-shared.png' },
    { src: 'shared/chain-link-sizes.png', dest: 'studio-chain-link-sizes.png' },
    { src: 'shared/chain-link-roll.png', dest: 'studio-chain-link-roll.png' }
  ]);
  linkPack('door-machhar-jali', [
    { src: 'shared/machhar-shared.png', dest: 'studio-machhar-shared.png' },
    { src: 'shared/machhar-rolls.png', dest: 'studio-machhar-rolls.png' },
    { src: 'shared/machhar-weave.png', dest: 'studio-machhar-weave.png' },
    { src: 'shared/machhar-cartons.png', dest: 'studio-machhar-cartons.png' }
  ]);
  linkPack('pvc-plastic-jali', [
    { src: 'shared/pvc-closeup.png', dest: 'studio-pvc-closeup.png' },
    { src: 'shared/pvc-rolls.png', dest: 'studio-pvc-rolls.png' },
    { src: 'shared/pvc-hero-rolls.png', dest: 'studio-pvc-hero-rolls.png' },
    { src: 'shared/pvc-construction.png', dest: 'studio-pvc-construction.png' },
    { src: 'shared/pvc-tree-guard.png', dest: 'studio-pvc-tree-guard.png' },
    { src: 'shared/pvc-rain-fence.png', dest: 'studio-pvc-rain-fence.png' },
    { src: 'shared/pvc-garden.png', dest: 'studio-pvc-garden.png' }
  ]);

  // Bird spikes — one material-specific cover (no shared balcony dumps)
  wipeCat('bird-spikes');
  [
    ['polycarbonate-bird-spikes', 'shared/bird-spikes-pc.png', 'studio-bird-spikes-pc.png'],
    ['ss-304-bird-spikes', 'shared/bird-spikes-ss.png', 'studio-bird-spikes-ss.png']
  ].forEach(([slug, srcRel, dest]) => {
    const src = path.join(studioRoot, srcRel);
    if (copyIfNeeded(src, dest, true)) copied++;
    const design = getDesign.get('bird-spikes', slug);
    if (design) addImage(design, dest, `${design.name} — studio — Garg Industrial Mesh`, 1, true, new Set());
  });

  linkPack('monkey-spikes', [
    { src: 'shared/monkey-spikes-pc.png', dest: 'studio-monkey-spikes-pc.png' },
    { src: 'shared/monkey-spikes-installed.png', dest: 'studio-monkey-spikes-installed.png' }
  ]);
  linkPack('anti-bird-net', [
    { src: 'shared/bird-net-balcony.png', dest: 'studio-bird-net-balcony.png' },
    { src: 'shared/bird-net-view.png', dest: 'studio-bird-net-view.png' }
  ]);

  // Expanded mesh — 3 distinct views per design
  wipeCat('expanded-mesh');
  const expDir = path.join(studioRoot, 'expanded');
  const views = [
    { key: 'front', sort: 1, cover: true },
    { key: 'back', sort: 2, cover: false },
    { key: 'light-through', sort: 3, cover: false }
  ];
  for (const design of getDesignsInCat.all('expanded-mesh')) {
    const seen = new Set();
    for (const v of views) {
      const srcName = `${design.slug}-${v.key}.png`;
      const dest = `studio-expanded-${design.slug}-${v.key}.png`;
      const src = path.join(expDir, srcName);
      if (copyIfNeeded(src, dest, true)) copied++;
      addImage(design, dest, `${design.name} — ${v.key} — Garg Industrial Mesh`, v.sort, v.cover, seen);
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
    // Studio-owned categories get a curated gallery later — do not dump shared
    // source photos onto every design (causes near-same blinkers).
    if (STUDIO_OWNED_CATS.has(cat.slug)) continue;

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
      // One cover only — shared gallery dumps of the same product look nearly identical
      if (!hasFile.get(design.id, coverName)) {
        const matSlug = (d.materials && d.materials[0] && d.materials[0].slug) || null;
        insert.run(design.id, coverName, '', design.name + ' — Garg Industrial Mesh', 1, 0, null, null, matSlug);
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
