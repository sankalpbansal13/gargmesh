const { mat, sku, hub, NCR_FAQ } = require('./helpers');

const GI = mat('gi', 'GI (Galvanised)', 'GI hexagonal chicken mesh', 'Galvanised hexagonal chicken mesh, also called murga jali.', {
  sort_order: 1,
  best_for: 'Poultry runs, garden fencing and light enclosures.',
  detail: 'Hexagonal GI chicken mesh. This is not square POP plaster jali. Opening and roll width are confirmed on the RFQ.'
});

function buildCategory() {
  const designs = [
    sku({
      slug: 'chicken-mesh-gi',
      name: 'Chicken mesh (murga jali)',
      hole_shape: 'Hexagonal',
      short_desc: 'Hexagonal GI chicken mesh · murga jali',
      description: 'Galvanised hexagonal chicken mesh (murga jali) from Garg Industrial Mesh, Sector 9 Noida. For poultry runs and light garden fencing. Square plaster mesh is a different product: POP plaster jali. Confirm opening and roll width on the RFQ.',
      applications: 'Poultry, garden fencing, light enclosures',
      faqs: [
        { q: 'Is this the same as POP jali?', a: 'No. Chicken mesh is hexagonal murga jali. POP plaster jali is square mesh in ½″, ¾″ and 1″.' },
        { q: 'Which metal?', a: 'GI (galvanised).' },
        NCR_FAQ
      ],
      meta_title: 'Chicken Mesh Noida | Murga Jali | Garg',
      meta_description: 'GI chicken mesh (murga jali) in Noida. Hexagonal poultry net, separate from square POP jali. Quote 9910238277.',
      meta_keywords: 'chicken mesh noida, murga jali, hexagonal gi net, poultry mesh delhi',
      sort_order: 1,
      featured: true,
      materials: [GI],
      spec_kind: 'chicken-mesh'
    })
  ];

  return hub({
    slug: 'chicken-mesh',
    name: 'Chicken Mesh',
    short_desc: 'Hexagonal GI chicken mesh, also called murga jali. Not the same as square POP plaster jali.',
    description: 'Chicken mesh from Garg Industrial Mesh, Sector 9 Noida. Hexagonal galvanised murga jali for poultry and light fencing, supplied across Delhi NCR. POP plaster jali is the square plaster mesh and is listed separately.',
    meta_title: 'Chicken Mesh & Murga Jali Noida | Garg',
    meta_description: 'Chicken mesh (murga jali) supplier in Noida. Hexagonal GI net for poultry and gardens across Delhi NCR. Quote 9910238277.',
    meta_keywords: 'chicken mesh noida, murga jali delhi, gi chicken wire, poultry mesh ghaziabad',
    sort_order: 21,
    group: 'sheet',
    designs,
    materials: [GI],
    guide: [
      {
        id: 'what',
        title: 'Chicken mesh and POP jali',
        body: 'Chicken mesh is hexagonal GI wire, also asked for as murga jali. POP plaster jali is square, in ½″, ¾″ and 1″, GI or mild steel. Order them as separate products.',
        tables: [[
          ['Product', 'Opening', 'Metal'],
          ['Chicken mesh', 'Hexagonal', 'GI'],
          ['POP plaster jali', 'Square ½″, ¾″, 1″', 'GI or MS']
        ]]
      },
      {
        id: 'faq',
        title: 'Frequently asked questions',
        faqs: [
          { q: 'What should I send for a quote?', a: 'Say chicken mesh or murga jali, the opening if you know it, the roll width, and the quantity.' },
          NCR_FAQ
        ]
      }
    ]
  });
}

module.exports = { buildCategory, MATERIALS: [GI] };
