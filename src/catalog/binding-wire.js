const { mat, sku, hub, NCR_FAQ } = require('./helpers');
const { gaugeTable } = require('./gauges');

const MATERIALS = [
  mat('ms-annealed', 'MS annealed', 'Soft annealed mild steel', 'Soft black annealed binding wire for tying rebar and mesh.', {
    sort_order: 1,
    best_for: 'TMT and mesh tying. Easy to twist.',
    detail: 'MS binding wire is soft annealed. Brands are Tata, Bansal and other brands. 25 kg coils. It is not sold as a polished or unpolished choice.'
  }),
  mat('gi', 'GI (Galvanised)', 'GI', 'Zinc-coated binding wire for outdoor tying.', {
    sort_order: 2,
    best_for: 'Outdoor and fencing ties.',
    detail: 'GI binding wire, 25 kg coils. Brands are Tata, Bansal and other brands. Not barbed wire.'
  })
];

const GAUGES = [
  ['bind-18', '18 g (1.2 mm)'],
  ['bind-20', '20 g (0.80 mm)'],
  ['bind-22', '22 g (0.60 mm)']
];

function buildCategory() {
  const designs = GAUGES.map(([slug, label], i) => sku({
    slug,
    name: 'Binding wire ' + label,
    short_desc: label + ' · MS annealed or GI · Tata, Bansal and other brands · 25 kg coils',
    description: 'Binding wire ' + label + '. MS soft annealed or GI. Brands: Tata, Bansal and other brands. Packed in 25 kg coils. For rebar tying, tying mesh and chain link, and general bundling. Not barbed wire. From Sector 9, Noida.',
    applications: 'Rebar tying, mesh tying, bundling',
    faqs: [
      { q: 'Which brands?', a: 'Tata, Bansal and other brands. Name the brand with the gauge on the quote.' },
      { q: 'What pack?', a: '25 kg coils.' },
      { q: 'Polished or unpolished?', a: 'That is not a choice on this line. MS is soft annealed. GI is zinc-coated.' },
      NCR_FAQ
    ],
    meta_title: label + ' Binding Wire Noida | Garg',
    meta_description: 'Binding wire ' + label + ' in MS annealed and GI, 25 kg coils. Noida. Quote 9910238277.',
    meta_keywords: 'binding wire noida, ' + label + ' binding wire, annealed binding wire, gi binding wire',
    sort_order: i + 1,
    featured: i === 0,
    materials: MATERIALS,
    spec_kind: 'binding'
  }));

  return hub({
    slug: 'binding-wire',
    name: 'Binding Wire',
    short_desc: '18 g (1.2 mm), 20 g (0.80 mm) and 22 g (0.60 mm). MS annealed and GI. Tata, Bansal and other brands. 25 kg coils.',
    description: 'Binding wire from Garg Industrial Mesh, Sector 9 Noida. 18 g (1.2 mm), 20 g (0.80 mm) and 22 g (0.60 mm). MS is soft annealed. GI is zinc-coated. Brands are Tata, Bansal and other brands. 25 kg coils. Used to tie rebar, mesh and chain link. This is not barbed wire, and polished / unpolished is not a website choice.',
    meta_title: 'Binding Wire Noida | 18 20 22 g | Garg',
    meta_description: 'MS annealed and GI binding wire in Noida — 18 g, 20 g and 22 g, 25 kg coils. Quote 9910238277.',
    meta_keywords: 'binding wire noida, 20 gauge binding wire, gi binding wire, annealed binding wire',
    sort_order: 19,
    group: 'sheet',
    designs,
    materials: MATERIALS,
    guide: [
      {
        id: 'gauges',
        title: 'Gauges and pack',
        body: 'Millimetres are the Garg gauge chart. MS is soft annealed (easy to twist). GI is zinc-coated for outdoor ties. Brands are Tata, Bansal and other brands. Coils are 25 kg. Polished and unpolished are not options.',
        tables: [
          [
            ['Gauge', 'Size', 'Pack'],
            ['18 g', '1.2 mm', '25 kg coil'],
            ['20 g', '0.80 mm', '25 kg coil'],
            ['22 g', '0.60 mm', '25 kg coil'],
            ['Brands', 'Tata, Bansal, other', 'Name the brand on the quote']
          ],
          gaugeTable()
        ]
      },
      {
        id: 'faq',
        title: 'Frequently asked questions',
        faqs: [
          { q: 'Which brands of binding wire?', a: 'Tata, Bansal and other brands, in 18 g, 20 g and 22 g, MS annealed or GI.' },
          { q: 'Is this barbed wire?', a: 'No. Barbed wire, concertina and RBT are a separate product.' },
          { q: 'Can I order polished binding wire?', a: 'Polished / unpolished is not a choice. Order MS annealed or GI.' },
          NCR_FAQ
        ]
      }
    ]
  });
}

module.exports = { buildCategory, MATERIALS };
