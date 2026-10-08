const { mat, sku, hub, NCR_FAQ } = require('./helpers');

const METALS = [
  mat('gi', 'GI (Galvanised)', 'GI', 'Galvanised corrugated perforated sheet.', {
    sort_order: 1,
    best_for: 'Sheds, cladding and outdoor screens.'
  }),
  mat('mild-steel', 'Mild Steel', 'MS', 'Mild steel corrugated perforated sheet.', {
    sort_order: 2,
    best_for: 'Indoor screens and painted jobs.'
  })
];

const SIZES = [
  ['corrugated-4x8', '4×8 ft', '8 ft'],
  ['corrugated-4x10', '4×10 ft', '10 ft'],
  ['corrugated-4x12', '4×12 ft', '12 ft'],
  ['corrugated-custom', 'Custom length', 'your length']
];

function buildCategory() {
  const designs = SIZES.map(([slug, label, length], i) => sku({
    slug,
    name: label === 'Custom length' ? 'Corrugated perforated — custom length' : 'Corrugated perforated ' + label,
    hole_shape: 'Round',
    short_desc: 'Finished 1 m × ' + length + ' · usual sheet ' + (label === 'Custom length' ? 'to order' : label),
    description: 'Corrugated perforated sheet, round holes, from Garg Industrial Mesh, Sector 9 Noida. Usual sheets are 4×8 ft, 4×10 ft and 4×12 ft. Finished size is 1 metre wide by ' + length + '. Other sizes are made to order. Thickness and hole size are confirmed on the quote.',
    applications: 'Shed cladding, boundary screens, ventilation and site covers',
    faqs: [
      { q: 'What sizes do you usually make?', a: '4×8 ft, 4×10 ft and 4×12 ft. Other sizes are made to order.' },
      { q: 'What is the finished size?', a: '1 metre wide by the length you need. The usual lengths are 8 ft, 10 ft and 12 ft.' },
      NCR_FAQ
    ],
    meta_title: 'Corrugated Perforated ' + label + ' Noida | Garg',
    meta_description: 'Corrugated perforated sheet, finished 1 m × ' + length + '. Usual sizes 4×8, 4×10 and 4×12 ft. Noida. Call 9910238277.',
    meta_keywords: 'corrugated perforated sheet, ' + label + ' perforated sheet noida, 1 metre corrugated sheet',
    sort_order: i + 1,
    featured: i === 0,
    materials: METALS,
    spec_kind: 'corrugated'
  }));

  return hub({
    slug: 'corrugated-perforated',
    name: 'Corrugated Perforated Sheet',
    short_desc: 'Round-hole corrugated sheet. Usual sizes 4×8, 4×10 and 4×12 ft. Finished size 1 m wide by custom length.',
    description: 'Corrugated perforated sheet from Garg Industrial Mesh, Sector 9 Noida. Round holes in a corrugated profile, in GI or mild steel. Usual sheets are 4×8 ft, 4×10 ft and 4×12 ft. Finished size is 1 metre wide by the length you need, including those usual lengths and other custom sizes. Thickness and hole size are confirmed on the quote.',
    meta_title: 'Corrugated Perforated Sheet Noida | Garg',
    meta_description: 'Corrugated perforated sheet in Noida — usual 4×8, 4×10 and 4×12 ft, finished 1 m wide by custom length. Quote 9910238277.',
    meta_keywords: 'corrugated perforated sheet noida, 4x8 corrugated sheet, 1 metre perforated sheet',
    sort_order: 22,
    group: 'sheet',
    designs,
    materials: METALS,
    guide: [
      {
        id: 'sizes',
        title: 'Sizes',
        body: 'Usual sheets are 4×8 ft, 4×10 ft and 4×12 ft. Finished width is 1 metre. Length is the size you order, including those three and any other length.',
        tables: [[
          ['Usual sheet', 'Finished size'],
          ['4×8 ft', '1 m × 8 ft'],
          ['4×10 ft', '1 m × 10 ft'],
          ['4×12 ft', '1 m × 12 ft'],
          ['Custom', '1 m × your length']
        ]]
      }
    ]
  });
}

module.exports = { buildCategory, MATERIALS: METALS };
