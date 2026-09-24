const { mat, sku, hub, NCR_FAQ } = require('./helpers');

const MATERIALS = [
  mat('gi', 'GI (Galvanised)', 'GI', 'GI POP plaster jali.', { sort_order: 1, best_for: 'Plaster reinforcement in GI.' }),
  mat('mild-steel', 'Mild Steel', 'MS', 'MS POP plaster jali.', { sort_order: 2, best_for: 'Plaster reinforcement in MS.' })
];

const SIZES = [
  ['pop-half', '½″', 'Half-inch square POP plaster jali'],
  ['pop-three-quarter', '¾″', 'Three-quarter-inch square POP plaster jali'],
  ['pop-one', '1″', 'One-inch square POP plaster jali']
];

function buildCategory() {
  const designs = SIZES.map(([slug, label, desc], i) => sku({
    slug,
    name: 'POP plaster jali ' + label,
    hole_shape: 'Square',
    short_desc: label + ' square · GI and MS',
    description: desc + '. Metals: GI and mild steel. Confirm roll width on the RFQ. From Sector 9, Noida.',
    applications: 'POP and plaster reinforcement',
    meta_title: label + ' POP Plaster Jali Noida | Garg',
    meta_description: label + ' POP plaster jali in GI and MS. Noida. Quote 9910238277.',
    meta_keywords: 'pop jali, plaster mesh noida, ' + label + ' pop mesh',
    sort_order: i + 1,
    featured: i === 0,
    materials: MATERIALS,
    spec_kind: 'pop'
  }));

  return hub({
    slug: 'pop-plaster-jali',
    name: 'POP Plaster Jali',
    short_desc: 'Square plaster mesh in ½″, ¾″ and 1″. GI and mild steel.',
    description: 'POP plaster jali from Garg Industrial Mesh, Sector 9 Noida. Square openings ½″, ¾″ and 1″. Metals: GI and mild steel. Hexagonal poultry net is a different product: chicken mesh (murga jali).',
    meta_title: 'POP Plaster Jali Noida | GI & MS | Garg',
    meta_description: 'POP plaster jali in 1/2, 3/4 and 1 inch. GI and MS. Noida. Quote 9910238277.',
    meta_keywords: 'pop jali noida, plaster mesh, gi pop jali',
    sort_order: 17,
    group: 'sheet',
    designs,
    materials: MATERIALS,
    guide: [
      {
        id: 'sizes',
        title: 'Openings',
        body: 'Three square sizes. Choose GI or mild steel on the next step. Roll width is confirmed on the RFQ.',
        tables: [[
          ['Opening', 'Metals'],
          ['½″', 'GI · MS'],
          ['¾″', 'GI · MS'],
          ['1″', 'GI · MS']
        ]]
      },
      {
        id: 'faq',
        title: 'Frequently asked questions',
        faqs: [NCR_FAQ]
      }
    ]
  });
}

module.exports = { buildCategory, MATERIALS };
