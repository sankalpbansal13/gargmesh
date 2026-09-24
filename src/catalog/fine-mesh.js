const { mat, sku, hub, NCR_FAQ } = require('./helpers');

const MATERIALS = [
  mat('ss-304', 'Stainless Steel 304', 'SS 304', 'SS 304 wire cloth for atta, maida, spice sifters and wet filters.', {
    sort_order: 1,
    best_for: 'Food sifters and wet filters, where the screen must not rust.',
    detail: 'SS 304 fine mesh is the wire cloth flour mills, spice grinders and filter makers ask for. Same mesh counts as brass and copper: 20×30 up to 150×46.'
  }),
  mat('brass', 'Brass', 'Brass', 'Brass wire mesh for oil filters, fuel filters and brass sifters.', {
    sort_order: 2,
    best_for: 'Oil and fuel filters, and sifters that already run a brass screen.',
    detail: 'Brass wire mesh (brass jali) is woven filter and sifter cloth. Mills order it when the existing screen is brass, and workshops order it for oil and fuel filters.'
  }),
  mat('copper', 'Copper', 'Copper', 'Copper wire cloth for chemical filters and copper sifter screens.', {
    sort_order: 3,
    best_for: 'Chemical and liquid filters specified in copper.',
    detail: 'Copper wire mesh is the same woven cloth in copper. It is used where the filter or sifter drawing says copper, not as a punched mill screen.'
  }),
  mat('gi', 'GI (Galvanised)', 'GI', 'GI woven fine mesh for dry sifters.', { sort_order: 4 }),
  mat('mild-steel', 'Mild Steel', 'MS', 'MS woven fine mesh for dry sifters.', { sort_order: 5 })
];

/** Mesh count × wire SWG. Wire SWG here is finer than the structural gauge chart. */
const CLOTHS = [
  ['20x30', '20 × 30', 'Coarse vibro-sifter and pre-screen cloth', 'coarse spice pre-screen'],
  ['30x32', '30 × 32', 'Medium sifter and filter cloth', 'general sifter'],
  ['40x36', '40 × 36', 'Atta channi and flour sifter cloth', 'atta channi'],
  ['60x38', '60 × 38', 'Maida, besan and fine spice cloth', 'maida and besan'],
  ['80x42', '80 × 42', 'Fine powder sifter cloth', 'fine powder'],
  ['100x44', '100 × 44', 'Fine filter and powder cloth', 'fine filters'],
  ['150x46', '150 × 46', 'Extra-fine powder and filter cloth', 'extra-fine powder']
];

function buildCategory() {
  const designs = CLOTHS.map(([slug, label, use, searchUse], i) => sku({
    slug: 'fine-' + slug,
    name: 'Fine mesh ' + label,
    hole_shape: 'Woven',
    short_desc: label + ' mesh × SWG · SS 304 wire cloth, brass jali, copper mesh · ' + searchUse,
    description: 'Woven fine mesh ' + label + ' (mesh count × wire SWG) in SS 304, brass and copper. ' + use + '. Also called SS wire cloth, brass wire mesh and copper wire cloth. Rolls 3 ft and 4 ft; other widths on order. GI and MS are available for dry sifters. This is not door mosquito mesh and not a punched hopper screen. From Sector 9, Noida.',
    applications: 'Atta channi, maida, besan, spice powder, vibro sifter, plansifter and filter cloth',
    faqs: [
      { q: 'What is ' + label + ' fine mesh called?', a: 'Trade name is mesh count × wire SWG. Buyers also call it SS 304 wire cloth, brass wire mesh, copper wire mesh, sifter jali and filter cloth. ' + label + ' is used for ' + searchUse + '.' },
      { q: 'SS 304, brass or copper?', a: 'SS 304 for food sifters and wet filters. Brass wire mesh where the screen or the oil and fuel filter is brass. Copper wire cloth where the drawing says copper. GI and MS are for dry sifters.' },
      { q: 'Is this hopper mesh or rice mill jali?', a: 'No. Hopper mesh and rice mill jali are number-perforated sheet. This page is woven sifter and filter cloth.' },
      NCR_FAQ
    ],
    meta_title: label + ' SS 304, Brass & Copper Mesh | Noida',
    meta_description: label + ' woven fine mesh in SS 304, brass and copper for ' + searchUse + '. Sifter and filter cloth from Noida. Call 9910238277.',
    meta_keywords: 'ss 304 wire mesh, brass wire mesh, copper wire mesh, ' + label + ' mesh, sifter jali, filter cloth, atta channi, fine mesh noida',
    sort_order: i + 1,
    featured: i === 0,
    materials: MATERIALS,
    spec_kind: 'fine-mesh'
  }));

  return hub({
    slug: 'fine-mesh',
    name: 'Fine Mesh',
    short_desc: 'SS 304, brass and copper wire cloth for sifters and filters. 20×30 to 150×46.',
    description: 'Fine mesh is woven wire cloth from Garg Industrial Mesh, Sector 9 Noida. Mills and filter makers ask for it as SS 304 wire mesh, brass wire mesh (brass jali) and copper wire mesh. Counts are mesh × SWG: 20×30, 30×32, 40×36, 60×38, 80×42, 100×44 and 150×46. Uses include atta channi, maida, besan, spice powder, vibro sifters and filter cloth. Rolls are 3 ft and 4 ft. Hopper mesh and rice mill screens are Number Perforated, not this cloth.',
    meta_title: 'SS 304, Brass & Copper Fine Mesh Noida | Garg',
    meta_description: 'SS 304, brass and copper fine mesh in Noida for atta channi, spice sifters and filters. 20×30 to 150×46. Call 9910238277.',
    meta_keywords: 'ss 304 wire mesh noida, brass wire mesh, brass jali, copper wire mesh, copper wire cloth, fine mesh, sifter jali, filter cloth, atta channi, vibro sifter mesh',
    sort_order: 14,
    group: 'sheet',
    designs,
    materials: MATERIALS,
    guide: [
      {
        id: 'cloths',
        title: 'Mesh × SWG',
        body: 'Read each line as mesh count × wire SWG. SS 304, brass and copper are the metals buyers name most often; GI and MS are also made. These wires are finer than the structural gauge chart, so wire millimetres are confirmed on the RFQ. Rolls are 3 ft and 4 ft.',
        tables: [[
          ['Mesh × SWG', 'What buyers use it for'],
          ['20 × 30', 'Coarse vibro-sifter and spice pre-screen'],
          ['30 × 32', 'Medium sifter and filter cloth'],
          ['40 × 36', 'Atta channi and flour sifter'],
          ['60 × 38', 'Maida, besan and fine spice'],
          ['80 × 42', 'Fine powder grading'],
          ['100 × 44', 'Fine filter and powder cloth'],
          ['150 × 46', 'Extra-fine powder and filter cloth']
        ]]
      },
      {
        id: 'faq',
        title: 'Frequently asked questions',
        body: 'Names, metals, and the screen this cloth is not.',
        faqs: [
          { q: 'What should I search for — fine mesh or wire cloth?', a: 'Both. SS 304 wire cloth, brass wire mesh and copper wire mesh are the same woven product. The count is mesh × SWG, from 20×30 to 150×46.' },
          { q: 'Where is the demand?', a: 'Atta and maida plants, spice grinders, vibro sifters and filter workshops. They replace screens by mesh count and metal.' },
          { q: 'Is this rice mill jali or hopper mesh?', a: 'No. Hopper mesh, rice mill jali, atta chakki jali, dal and spice chamber screens are number-perforated sheet. This cloth is the woven channi and filter.' },
          NCR_FAQ
        ]
      }
    ]
  });
}

module.exports = { buildCategory, MATERIALS };
