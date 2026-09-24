const { mat, sku, hub, NCR_FAQ } = require('./helpers');
const { gaugeTable } = require('./gauges');

const MATERIALS = [
  mat('mild-steel', 'Mild Steel', 'MS', 'Mild steel welded mesh. Coat for outdoor life.', {
    sort_order: 1,
    best_for: 'Economy guards, cages and panels.',
    detail: 'MS on the five stock openings. Usual rolls 3, 4 and 5 ft. Specials on order.'
  }),
  mat('gi', 'GI (Galvanised)', 'GI', 'Zinc-coated welded mesh for outdoor use.', {
    sort_order: 2,
    best_for: 'Outdoor fencing and damp sites.',
    detail: 'GI on the five stock openings. Usual rolls 3, 4 and 5 ft. Specials on order.'
  }),
  mat('ss-304', 'Stainless Steel 304', 'SS 304', 'SS 304 welded mesh.', {
    sort_order: 3,
    best_for: 'Long-life and washdown-adjacent mesh.',
    detail: 'SS 304 on the five stock openings. Usual rolls 3, 4 and 5 ft. Specials on order.'
  }),
  mat('ss-201', 'Stainless Steel 201', 'SS 201', 'SS 201 welded mesh.', {
    sort_order: 4,
    best_for: 'Economy stainless welded mesh.',
    detail: 'SS 201 on the five stock openings. Usual rolls 3, 4 and 5 ft. Specials on order.'
  })
];

const OPENINGS = [
  { slug: 'ss-welded-01', name: '1″ × 1″ × 10 g', shape: 'Square', spec: '1″×1″ × 10g (3 mm)' },
  { slug: 'ss-welded-02', name: '1″ × 1″ × 12 g', shape: 'Square', spec: '1″×1″ × 12g (2.5 mm)' },
  { slug: 'ss-welded-03', name: '2″ × 2″ × 10 g', shape: 'Square', spec: '2″×2″ × 10g (3 mm)' },
  { slug: 'ss-welded-04', name: '1″ × 3″ × 8 g', shape: 'Rectangular', spec: '1″×3″ × 8g (4 mm)' },
  { slug: 'ss-welded-05', name: '4″ × 4″ × 10 g', shape: 'Square', spec: '4″×4″ × 10g (3 mm)' }
];

function buildCategory() {
  const designs = OPENINGS.map((o, i) => sku({
    slug: o.slug,
    name: 'Welded Mesh ' + o.spec,
    hole_shape: o.shape,
    short_desc: o.spec + ' · MS, GI, SS 304, SS 201 · rolls 3 / 4 / 5 ft',
    description: 'Welded mesh ' + o.spec + '. Metals: mild steel, GI, SS 304 and SS 201. Usual roll widths 3, 4 and 5 ft. Other sizes on order. From Sector 9, Noida.',
    applications: 'Fencing, guards, cages, partitions',
    faqs: [
      { q: 'Which opening is this?', a: o.spec + '.' },
      { q: 'Which metals and roll widths?', a: 'MS, GI, SS 304 and SS 201. Usual rolls 3, 4 and 5 ft. Specials on order.' },
      NCR_FAQ
    ],
    meta_title: o.spec + ' Welded Mesh Noida | Garg',
    meta_description: 'Welded mesh ' + o.spec + ' in MS, GI, SS 304 and SS 201. Noida. Quote 9910238277.',
    meta_keywords: 'welded mesh noida, ' + o.spec + ', gi weld mesh, ms welded mesh',
    sort_order: i + 1,
    featured: i < 2,
    materials: MATERIALS,
    spec_kind: 'welded'
  }));

  return hub({
    slug: 'ss-welded-mesh',
    name: 'Welded Mesh',
    short_desc: 'Five openings in MS, GI, SS 304 and SS 201. Usual rolls 3, 4 and 5 ft.',
    description: 'Welded mesh from Garg Industrial Mesh, Sector 9 Noida. Five stock openings only, in mild steel, GI, SS 304 and SS 201. Usual roll widths 3, 4 and 5 ft. Specials on order.',
    meta_title: 'Welded Mesh Noida | MS GI SS | Garg',
    meta_description: 'Welded mesh in Noida — five openings in MS, GI, SS 304 and SS 201. Quote 9910238277.',
    meta_keywords: 'welded mesh noida, weldmesh, gi welded mesh, ss welded mesh',
    sort_order: 4,
    group: 'sheet',
    designs,
    materials: MATERIALS,
    guide: [
      {
        id: 'openings',
        title: 'Five stock openings',
        body: 'These five openings replace the old long size list. Wire size uses the Garg gauge chart. Usual rolls are 3, 4 and 5 ft. Specials on order.',
        tables: [
          [
            ['Opening', 'Wire'],
            ['1″ × 1″', '10 g (3 mm)'],
            ['1″ × 1″', '12 g (2.5 mm)'],
            ['2″ × 2″', '10 g (3 mm)'],
            ['1″ × 3″', '8 g (4 mm)'],
            ['4″ × 4″', '10 g (3 mm)']
          ],
          gaugeTable(),
          [
            ['Also state', 'Options'],
            ['Metal', 'MS · GI · SS 304 · SS 201'],
            ['Roll width', '3 ft · 4 ft · 5 ft usual. Specials on order.']
          ]
        ]
      },
      {
        id: 'faq',
        title: 'Frequently asked questions',
        body: 'What to send with a welded mesh enquiry.',
        faqs: [
          { q: 'How many openings are in stock?', a: 'Five: 1″×1″×10g, 1″×1″×12g, 2″×2″×10g, 1″×3″×8g and 4″×4″×10g.' },
          { q: 'Is powder-coated welded mesh the same list?', a: 'Yes. Powder-coated welded mesh uses these same five openings. It is a separate product type.' },
          NCR_FAQ
        ]
      }
    ]
  });
}

module.exports = { buildCategory, MATERIALS, OPENINGS };
