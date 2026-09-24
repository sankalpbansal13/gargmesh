const { mat, sku, hub, NCR_FAQ } = require('./helpers');
const { OPENINGS } = require('./ss-welded');
const { gaugeTable } = require('./gauges');

const COLOURS = [
  ['pvc-dark-green', 'Dark green'],
  ['pvc-light-green', 'Light green'],
  ['pvc-black', 'Black'],
  ['pvc-blue', 'Blue'],
  ['pvc-grey', 'Grey']
].map(([slug, name], i) => mat(slug, name, name + ' powder coat', 'Powder-coated welded mesh in ' + name.toLowerCase() + '.', {
  sort_order: i + 1,
  best_for: name + ' powder-coated welded mesh.',
  detail: 'MS welded mesh with ' + name.toLowerCase() + ' powder coat. Other colours on request.'
}));

function buildCategory() {
  const designs = OPENINGS.map((o, i) => sku({
    slug: 'pc-' + o.slug,
    name: 'Powder-coated ' + o.spec,
    hole_shape: o.shape,
    short_desc: o.spec + ' · powder coat · dark/light green, black, blue, grey',
    description: 'Powder-coated welded mesh ' + o.spec + ' on a mild steel base. Colours: dark green, light green, black, blue and grey. Other colours on request. Usual rolls 3, 4 and 5 ft. From Sector 9, Noida.',
    applications: 'Coloured fencing, cages and guards',
    faqs: [
      { q: 'Which opening is this?', a: o.spec + ', same as plain welded mesh.' },
      { q: 'Which colours?', a: 'Dark green, light green, black, blue and grey. Other colours on request.' },
      NCR_FAQ
    ],
    meta_title: 'Powder-coated ' + o.spec + ' Noida | Garg',
    meta_description: 'Powder-coated welded mesh ' + o.spec + ' in Noida. Quote 9910238277.',
    meta_keywords: 'powder coated welded mesh, pvc coated weld mesh noida',
    sort_order: i + 1,
    featured: i === 0,
    materials: COLOURS,
    spec_kind: 'welded-coated'
  }));

  return hub({
    slug: 'powder-coated-welded-mesh',
    name: 'Powder-coated Welded Mesh',
    short_desc: 'Same five welded openings, powder coated. Colours match chain-link PVC.',
    description: 'Powder-coated welded mesh from Garg Industrial Mesh, Sector 9 Noida. Same five openings as plain welded mesh, on mild steel, in dark green, light green, black, blue or grey. Other colours on request.',
    meta_title: 'Powder-coated Welded Mesh Noida | Garg',
    meta_description: 'Powder-coated welded mesh in Noida — five openings, PVC colours. Quote 9910238277.',
    meta_keywords: 'powder coated welded mesh noida, coloured weld mesh',
    sort_order: 12,
    group: 'sheet',
    designs,
    materials: COLOURS,
    guide: [
      {
        id: 'openings',
        title: 'Openings and colours',
        body: 'Openings match plain welded mesh. Base metal is mild steel. Other powder-coat colours on request.',
        tables: [
          [
            ['Opening', 'Wire'],
            ['1″ × 1″', '10 g (3 mm)'],
            ['1″ × 1″', '12 g (2.5 mm)'],
            ['2″ × 2″', '10 g (3 mm)'],
            ['1″ × 3″', '8 g (4 mm)'],
            ['4″ × 4″', '10 g (3 mm)']
          ],
          [
            ['Colour', 'Note'],
            ['Dark green', 'Stock colour'],
            ['Light green', 'Stock colour'],
            ['Black', 'Stock colour'],
            ['Blue', 'Stock colour'],
            ['Grey', 'Stock colour'],
            ['Other', 'On request']
          ],
          gaugeTable()
        ]
      }
    ]
  });
}

module.exports = { buildCategory, MATERIALS: COLOURS };
