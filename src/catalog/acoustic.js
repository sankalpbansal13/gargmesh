const { mat, sku, hub, NCR_FAQ } = require('./helpers');
const { gaugeTable } = require('./gauges');

const GAUGES = [
  ['gi-22', 'GI 22 g (0.60 mm)'],
  ['gi-24', 'GI 24 g (0.50 mm)'],
  ['gi-26', 'GI 26 g (0.40 mm)']
].map(([slug, name], i) => mat(slug, name, name, 'Acoustic perforated GI sheet, ' + name + '.', {
  sort_order: i + 1,
  best_for: 'Acoustic ceiling and wall liners.'
}));

const PACK = mat('tissue-glass-wool', 'Tissue + glass wool', 'Acoustic pack', 'Tissue paper and glass wool to go with the perforated liner.', {
  sort_order: 1,
  best_for: 'Acoustic backing behind the perforated sheet.'
});

function buildCategory() {
  const sheets = [3, 4, 5].map((mm, i) => sku({
    slug: 'acoustic-' + mm + 'mm',
    name: 'Acoustic sheet ' + mm + ' mm holes',
    hole_shape: 'Round',
    hole_mm: mm,
    short_desc: mm + ' mm holes · GI 22 / 24 / 26 g',
    description: 'GI acoustic perforated sheet with ' + mm + ' mm holes. Gauges: 22 g (0.60 mm), 24 g (0.50 mm) and 26 g (0.40 mm). Rolls from 1 m to 4 ft. From Sector 9, Noida.',
    applications: 'Acoustic ceilings and wall liners',
    faqs: [
      { q: 'Which gauges?', a: 'GI 22 g (0.60 mm), 24 g (0.50 mm) and 26 g (0.40 mm).' },
      { q: 'Do you supply the backing?', a: 'Yes. Tissue paper and glass wool are a separate listing in this range.' },
      NCR_FAQ
    ],
    meta_title: mm + ' mm Acoustic Perforated GI Noida | Garg',
    meta_description: 'GI acoustic perforated sheet, ' + mm + ' mm holes, 22/24/26 g. Noida. Quote 9910238277.',
    meta_keywords: 'acoustic perforated sheet, gi acoustic sheet noida',
    sort_order: i + 1,
    featured: i === 0,
    materials: GAUGES,
    spec_kind: 'acoustic'
  }));

  sheets.push(sku({
    slug: 'acoustic-tissue-glass-wool',
    name: 'Tissue paper + glass wool',
    short_desc: 'Acoustic backing pack · tissue paper and glass wool',
    description: 'Tissue paper and glass wool supplied with acoustic perforated sheet. State area and thickness on the RFQ. From Sector 9, Noida.',
    applications: 'Backing for acoustic perforated liners',
    meta_title: 'Acoustic Tissue & Glass Wool Noida | Garg',
    meta_description: 'Tissue paper and glass wool for acoustic perforated sheet. Noida. Quote 9910238277.',
    meta_keywords: 'acoustic glass wool, tissue paper acoustic, noida',
    sort_order: 4,
    materials: [PACK],
    spec_kind: 'acoustic'
  }));

  return hub({
    slug: 'acoustic-perforated',
    name: 'Acoustic Perforated',
    short_desc: 'GI acoustic sheet in 22, 24 and 26 g. Holes 3, 4 and 5 mm. Tissue and glass wool with it.',
    description: 'Acoustic perforated sheet from Garg Industrial Mesh, Sector 9 Noida. GI 22 g (0.60 mm), 24 g (0.50 mm) and 26 g (0.40 mm). Holes 3 mm, 4 mm and 5 mm. Rolls 1 m to 4 ft. Tissue paper and glass wool are supplied as the backing pack.',
    meta_title: 'Acoustic Perforated Sheet Noida | Garg',
    meta_description: 'GI acoustic perforated sheet in Noida — 22/24/26 g, holes 3/4/5 mm, with tissue and glass wool. Quote 9910238277.',
    meta_keywords: 'acoustic perforated sheet noida, gi acoustic jali, glass wool',
    sort_order: 16,
    group: 'sheet',
    designs: sheets,
    materials: [...GAUGES, PACK],
    guide: [
      {
        id: 'spec',
        title: 'Sheet and backing',
        body: 'Pick the hole, then the GI gauge. Backing is listed separately.',
        tables: [
          [
            ['Item', 'Stock'],
            ['Metal', 'GI'],
            ['Gauge', '22 g (0.60 mm) · 24 g (0.50 mm) · 26 g (0.40 mm)'],
            ['Holes', '3 mm · 4 mm · 5 mm'],
            ['Rolls', '1 m to 4 ft'],
            ['Backing', 'Tissue paper + glass wool']
          ],
          gaugeTable()
        ]
      }
    ]
  });
}

module.exports = { buildCategory, MATERIALS: [...GAUGES, PACK] };
