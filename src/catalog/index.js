const ssWelded = require('./ss-welded');
const expanded = require('./expanded-mesh');
const chainLink = require('./chain-link');
const machhar = require('./machhar-jali');
const pvc = require('./pvc-jali');
const bird = require('./bird-spikes');

/** UI / nav grouping for category objects (not a DB column). */
const CATEGORY_GROUPS = {
  sheet: 'sheet',
  animal: 'animal'
};

function extraCategories() {
  return [
    ssWelded.buildCategory(),
    expanded.buildCategory(),
    chainLink.buildCategory(),
    machhar.buildCategory(),
    pvc.buildCategory(),
    bird.buildBirdCategory(),
    bird.buildMonkeyCategory(),
    bird.buildNetCategory()
  ];
}

function allExtraMaterials() {
  const map = {};
  for (const mod of [ssWelded, expanded, chainLink, machhar, pvc, bird]) {
    for (const m of mod.MATERIALS || []) map[m.slug] = m;
  }
  return map;
}

const GROUP_LABELS = {
  sheet: 'Sheet & mesh',
  animal: 'Animal prevention'
};

/** Static slug → group (avoid rebuilding catalog on every request). */
const GROUP_BY_SLUG = {
  'perforated-ms-gi-ss-al': 'sheet',
  'perforated-copper': 'sheet',
  'perforated-brass': 'sheet',
  'ss-welded-mesh': 'sheet',
  'expanded-mesh': 'sheet',
  'chain-link-mesh': 'sheet',
  'pvc-plastic-jali': 'sheet',
  'door-machhar-jali': 'animal',
  'bird-spikes': 'animal',
  'monkey-spikes': 'animal',
  'anti-bird-net': 'animal'
};

function categoryGroup(slug) {
  return GROUP_BY_SLUG[slug] || 'sheet';
}

module.exports = {
  extraCategories,
  allExtraMaterials,
  CATEGORY_GROUPS,
  categoryGroup,
  GROUP_LABELS
};
