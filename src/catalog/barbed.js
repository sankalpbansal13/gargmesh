const { mat, sku, hub, NCR_FAQ } = require('./helpers');

const GI = mat('gi', 'GI (Galvanised)', 'GI', 'Galvanised fencing wire.', {
  sort_order: 1,
  best_for: 'Outdoor barbed wire, concertina and razor barbed tape.',
  detail: 'GI only. State type, gauge or coil size, and quantity on the RFQ.'
});

const LINES = [
  {
    slug: 'barbed-type-a-12',
    name: 'Barbed wire Type A · 12 SWG',
    short: 'Type A (common twist) · line and barb 12 SWG (2.5 mm) · GI',
    use: 'Line fencing'
  },
  {
    slug: 'barbed-type-a-14',
    name: 'Barbed wire Type A · 14 SWG',
    short: 'Type A (common twist) · line and barb 14 SWG (2 mm) · GI',
    use: 'Line fencing'
  },
  {
    slug: 'barbed-type-a-16',
    name: 'Barbed wire Type A · 16 SWG',
    short: 'Type A (common twist) · line and barb 16 SWG (1.5 mm) · GI',
    use: 'Line fencing'
  },
  {
    slug: 'barbed-type-b-12',
    name: 'Barbed wire Type B · 12 SWG',
    short: 'Type B (reverse twist) · line and barb 12 SWG (2.5 mm) · GI',
    use: 'Line fencing'
  },
  {
    slug: 'barbed-type-b-14',
    name: 'Barbed wire Type B · 14 SWG',
    short: 'Type B (reverse twist) · line and barb 14 SWG (2 mm) · GI',
    use: 'Line fencing'
  },
  {
    slug: 'barbed-type-b-16',
    name: 'Barbed wire Type B · 16 SWG',
    short: 'Type B (reverse twist) · line and barb 16 SWG (1.5 mm) · GI',
    use: 'Line fencing'
  },
  {
    slug: 'concertina-1-5',
    name: 'Concertina 1.5 ft',
    short: 'GI concertina coil · 1.5 ft diameter',
    use: 'Coil topping and barriers'
  },
  {
    slug: 'concertina-2-5',
    name: 'Concertina 2.5 ft',
    short: 'GI concertina coil · 2.5 ft diameter',
    use: 'Coil topping and barriers'
  },
  {
    slug: 'rbt-2-5',
    name: 'RBT 2.5 ft',
    short: 'GI razor barbed tape · 2.5 ft · drawn straight',
    use: 'Straight razor tape runs'
  }
];

function buildCategory() {
  const designs = LINES.map((line, i) => sku({
    slug: line.slug,
    name: line.name,
    hole_shape: 'Barbed',
    short_desc: line.short,
    description: line.name + '. ' + line.short + '. GI only. From Sector 9, Noida.',
    applications: line.use,
    meta_title: line.name + ' Noida | Garg',
    meta_description: line.name + ' — GI, from Noida. Quote 9910238277.',
    meta_keywords: 'barbed wire noida, concertina coil, razor barbed tape, gi barbed wire',
    sort_order: i + 1,
    featured: i === 0,
    materials: [GI],
    spec_kind: 'barbed'
  }));

  return hub({
    slug: 'barbed-wire',
    name: 'Barbed Wire, Concertina & RBT',
    short_desc: 'GI barbed wire Type A and Type B in 12, 14 and 16 SWG. Concertina 1.5 and 2.5 ft. RBT 2.5 ft.',
    description: 'Galvanised barbed wire, concertina coil and razor barbed tape from Garg Industrial Mesh, Sector 9 Noida. Type A is common twist. Type B is reverse twist. Line and barb 12 SWG (2.5 mm), 14 SWG (2 mm) or 16 SWG (1.5 mm). Concertina coils 1.5 ft and 2.5 ft. RBT 2.5 ft, drawn straight.',
    meta_title: 'Barbed Wire, Concertina & RBT Noida | Garg',
    meta_description: 'GI barbed wire Type A and B, concertina 1.5 and 2.5 ft, RBT 2.5 ft. Noida. Quote 9910238277.',
    meta_keywords: 'barbed wire noida, concertina coil noida, rbt wire, gi barbed wire',
    sort_order: 13,
    group: 'sheet',
    designs,
    materials: [GI],
    guide: [
      {
        id: 'range',
        title: 'Range',
        body: 'GI only. On the Garg gauge chart, 12 SWG is 2.5 mm, 14 SWG is 2 mm, and 16 SWG is 1.5 mm.',
        tables: [[
          ['Product', 'Stock'],
          ['Barbed Type A', 'Common twist · 12 SWG (2.5 mm) / 14 SWG (2 mm) / 16 SWG (1.5 mm)'],
          ['Barbed Type B', 'Reverse twist · 12 SWG (2.5 mm) / 14 SWG (2 mm) / 16 SWG (1.5 mm)'],
          ['Concertina', '1.5 ft and 2.5 ft coils'],
          ['RBT', '2.5 ft, drawn straight']
        ]]
      },
      {
        id: 'faq',
        title: 'Frequently asked questions',
        body: 'This line is fencing wire, not tying wire.',
        faqs: [
          { q: 'Is this the same as binding wire?', a: 'No. Binding wire is soft tying wire in 18, 20 and 22 g. This line is barbed wire, concertina and razor tape.' },
          NCR_FAQ
        ]
      }
    ]
  });
}

module.exports = { buildCategory, MATERIALS: [GI] };
