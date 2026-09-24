const ssWelded = require('./ss-welded');
const expanded = require('./expanded-mesh');
const chainLink = require('./chain-link');
const machhar = require('./machhar-jali');
const pvc = require('./pvc-jali');
const bird = require('./bird-spikes');
const powderWelded = require('./powder-welded');
const barbed = require('./barbed');
const fineMesh = require('./fine-mesh');
const millJali = require('./mill-jali');
const acoustic = require('./acoustic');
const popJali = require('./pop-jali');
const fiberMesh = require('./fiber-mesh');
const bindingWire = require('./binding-wire');
const constructionNet = require('./construction-net');
const chickenMesh = require('./chicken-mesh');

const EXTRA_MODULES = [
  ssWelded, expanded, chainLink, machhar, pvc, bird,
  powderWelded, barbed, fineMesh, millJali, acoustic, popJali, fiberMesh, bindingWire,
  constructionNet, chickenMesh
];

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
    bird.buildNetCategory(),
    powderWelded.buildCategory(),
    barbed.buildCategory(),
    fineMesh.buildCategory(),
    millJali.buildCategory(),
    acoustic.buildCategory(),
    popJali.buildCategory(),
    fiberMesh.buildCategory(),
    bindingWire.buildCategory(),
    constructionNet.buildCategory(),
    chickenMesh.buildCategory()
  ];
}

function allExtraMaterials() {
  const map = {};
  for (const mod of EXTRA_MODULES) {
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
  'anti-bird-net': 'animal',
  'powder-coated-welded-mesh': 'sheet',
  'barbed-wire': 'sheet',
  'fine-mesh': 'sheet',
  'number-perforated': 'sheet',
  'acoustic-perforated': 'sheet',
  'pop-plaster-jali': 'sheet',
  'fiber-mesh': 'sheet',
  'binding-wire': 'sheet',
  'construction-net': 'sheet',
  'chicken-mesh': 'sheet'
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
