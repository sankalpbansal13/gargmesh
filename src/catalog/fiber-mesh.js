const { mat, sku, hub, NCR_FAQ } = require('./helpers');

const MAT = mat('fiberglass', 'AR fiberglass', 'Alkali-resistant fiberglass', 'Alkali-resistant fiberglass mesh for waterproofing coats.', {
  sort_order: 1,
  best_for: 'Waterproofing reinforcement.'
});

const GSM = [
  ['fiber-45', '45 GSM'],
  ['fiber-80', '80 GSM'],
  ['fiber-100', '100 GSM']
];

function buildCategory() {
  const designs = GSM.map(([slug, label], i) => sku({
    slug,
    name: 'Fiber mesh ' + label,
    hole_shape: 'Square',
    short_desc: label + ' · 5×5 mm · AR fiberglass · 1 m × 50 m rolls',
    description: 'Alkali-resistant fiberglass mesh, ' + label + ', 5×5 mm opening, rolls 1 m × 50 m. For waterproofing coats. From Sector 9, Noida.',
    applications: 'Waterproofing coats and plaster reinforcement',
    meta_title: label + ' Fiber Mesh Noida | Garg',
    meta_description: label + ' AR fiberglass mesh, 5×5 mm, 1 m × 50 m. Noida. Quote 9910238277.',
    meta_keywords: 'fiber mesh noida, waterproofing mesh, ' + label + ' fiberglass',
    sort_order: i + 1,
    featured: i === 0,
    materials: [MAT],
    spec_kind: 'fiber'
  }));

  return hub({
    slug: 'fiber-mesh',
    name: 'Fiber Mesh',
    short_desc: 'AR fiberglass waterproofing mesh in 45, 80 and 100 GSM. 5×5 mm. Rolls 1 m × 50 m.',
    description: 'Fiber mesh from Garg Industrial Mesh, Sector 9 Noida. Alkali-resistant fiberglass for waterproofing coats. 45 GSM, 80 GSM and 100 GSM. Opening 5×5 mm. Rolls 1 m × 50 m.',
    meta_title: 'Fiber Mesh Noida | 45 80 100 GSM | Garg',
    meta_description: 'Waterproofing fiber mesh in Noida — 45, 80 and 100 GSM AR fiberglass. Quote 9910238277.',
    meta_keywords: 'fiber mesh noida, waterproofing mesh, fiberglass mesh 45 gsm',
    sort_order: 18,
    group: 'sheet',
    designs,
    materials: [MAT],
    guide: [
      {
        id: 'gsm',
        title: 'GSM',
        body: 'Three weights. Opening and roll size are the same on each.',
        tables: [[
          ['GSM', 'Opening', 'Roll', 'Fibre'],
          ['45', '5×5 mm', '1 m × 50 m', 'AR fiberglass'],
          ['80', '5×5 mm', '1 m × 50 m', 'AR fiberglass'],
          ['100', '5×5 mm', '1 m × 50 m', 'AR fiberglass']
        ]]
      },
      {
        id: 'faq',
        title: 'Frequently asked questions',
        faqs: [
          { q: 'Is 145 or 160 GSM on this list?', a: 'No. Stock fiber mesh is 45, 80 and 100 GSM.' },
          NCR_FAQ
        ]
      }
    ]
  });
}

module.exports = { buildCategory, MATERIALS: [MAT] };
