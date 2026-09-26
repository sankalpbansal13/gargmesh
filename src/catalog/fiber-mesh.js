const { mat, sku, hub, NCR_FAQ } = require('./helpers');

const MAT = mat('fiberglass', 'AR fiberglass', 'Alkali-resistant fiberglass', 'Alkali-resistant fiberglass mesh for waterproofing coats.', {
  sort_order: 1,
  best_for: 'Waterproofing reinforcement.'
});

const WIDTHS = '4 inch, 6 inch, 8 inch, 12 inch and 1 m';

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
    short_desc: label + ' · 5×5 mm · widths ' + WIDTHS,
    description: 'Alkali-resistant fiberglass mesh, ' + label + ', 5×5 mm opening. Widths: ' + WIDTHS + '. The 1 m roll is 50 m long. For waterproofing coats. From Sector 9, Noida.',
    applications: 'Waterproofing coats and plaster reinforcement',
    faqs: [
      { q: 'Which widths?', a: '4 inch, 6 inch, 8 inch, 12 inch and 1 m. The 1 m roll is 50 m long.' },
      NCR_FAQ
    ],
    meta_title: label + ' Fiber Mesh Noida | Garg',
    meta_description: label + ' fiber mesh, 5×5 mm, widths 4 to 12 inch and 1 m. Noida. Call 9910238277.',
    meta_keywords: 'fiber mesh noida, waterproofing mesh, ' + label + ' fiberglass',
    sort_order: i + 1,
    featured: i === 0,
    materials: [MAT],
    spec_kind: 'fiber'
  }));

  return hub({
    slug: 'fiber-mesh',
    name: 'Fiber Mesh',
    short_desc: 'AR fiberglass waterproofing mesh in 45, 80 and 100 GSM. Widths 4, 6, 8 and 12 inch, and 1 m.',
    description: 'Fiber mesh from Garg Industrial Mesh, Sector 9 Noida. Alkali-resistant fiberglass for waterproofing coats. 45 GSM, 80 GSM and 100 GSM. Opening 5×5 mm. Widths: ' + WIDTHS + '. The 1 m roll is 50 m long.',
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
        body: 'Three weights. Opening is 5×5 mm on each. Widths are 4 inch, 6 inch, 8 inch, 12 inch and 1 m. The 1 m roll is 50 m long.',
        tables: [[
          ['GSM', 'Opening', 'Widths', 'Fibre'],
          ['45', '5×5 mm', WIDTHS, 'AR fiberglass'],
          ['80', '5×5 mm', WIDTHS, 'AR fiberglass'],
          ['100', '5×5 mm', WIDTHS, 'AR fiberglass']
        ]]
      },
      {
        id: 'faq',
        title: 'Frequently asked questions',
        faqs: [
          { q: 'Which widths are available?', a: '4 inch, 6 inch, 8 inch, 12 inch and 1 m. The 1 m roll is 50 m long.' },
          { q: 'Is 145 or 160 GSM on this list?', a: 'No. Stock fiber mesh is 45, 80 and 100 GSM.' },
          NCR_FAQ
        ]
      }
    ]
  });
}

module.exports = { buildCategory, MATERIALS: [MAT] };
