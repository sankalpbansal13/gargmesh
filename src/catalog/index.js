const ssWelded = require('./ss-welded');
const expanded = require('./expanded-mesh');
const chainLink = require('./chain-link');
const machhar = require('./machhar-jali');
const pvc = require('./pvc-jali');
const bird = require('./bird-spikes');

function extraCategories() {
  return [
    ssWelded.buildCategory(),
    expanded.buildCategory(),
    chainLink.buildCategory(),
    machhar.buildCategory(),
    pvc.buildCategory(),
    bird.buildCategory()
  ];
}

function allExtraMaterials() {
  const map = {};
  for (const mod of [ssWelded, expanded, chainLink, machhar, pvc, bird]) {
    for (const m of mod.MATERIALS || []) map[m.slug] = m;
  }
  return map;
}

module.exports = { extraCategories, allExtraMaterials };
