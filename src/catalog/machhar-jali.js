const { loadContent, mat, sku, hub, NCR_FAQ } = require('./helpers');

const content = loadContent('machhar-jali');

const WIDTHS = '2, 2.5, 3, 3.5, 4 and 5 ft';

const MATERIALS = [
  mat('gi', 'GI (Galvanised)', 'GI', 'Zinc-coated woven door mesh.', {
    sort_order: 1,
    best_for: 'Door and window insect mesh where GI is specified.',
    detail: 'GI 14×14 machhar jali. Widths ' + WIDTHS + '.'
  }),
  mat('aluminium', 'Aluminium', 'Aluminium', 'Lightweight aluminium woven door mesh.', {
    sort_order: 2,
    best_for: 'Door and window mosquito mesh.',
    detail: 'Aluminium 14×14 machhar jali. Widths ' + WIDTHS + '.'
  }),
  mat('ss-304', 'Stainless Steel 304', 'SS 304', 'SS 304 woven door mesh, supplied in rolls with a grade sticker.', {
    sort_order: 3,
    best_for: 'Long-life door and window insect screens.',
    detail: 'SS 304 14×14 machhar jali in rolls. Each 304 roll carries a grade sticker. Widths ' + WIDTHS + '.'
  }),
  mat('ss-201', 'Stainless Steel 201', 'SS 201', 'SS 201 woven door mesh.', {
    sort_order: 4,
    best_for: 'Economy stainless door mesh.',
    detail: 'SS 201 14×14 machhar jali. Widths ' + WIDTHS + '.'
  }),
  mat('ss-202', 'Stainless Steel 202', 'SS 202', 'SS 202 woven door mesh.', {
    sort_order: 5,
    best_for: 'Economy stainless door mesh when 202 is written on the order.',
    detail: 'SS 202 14×14 machhar jali. Widths ' + WIDTHS + '.'
  })
];

function buildCategory() {
  const designs = [
    sku({
      slug: 'machhar-01',
      name: 'Door Machhar Jali 14×14',
      hole_shape: 'Woven',
      short_desc: '14×14 only · widths ' + WIDTHS + ' · GI, aluminium, SS 304, SS 201, SS 202',
      description: 'Woven door machhar jali (mosquito / wire mesh), 14×14 mesh only. Widths ' + WIDTHS + '. Metals: GI, aluminium, SS 304, SS 201 and SS 202. SS 304 is supplied in rolls with a grade sticker. From Sector 9, Noida.',
      applications: 'Doors, windows, kitchen and balcony insect screens',
      faqs: [
        { q: 'Which mesh counts do you stock?', a: '14×14 only.' },
        { q: 'Which widths?', a: WIDTHS + '.' },
        { q: 'How is SS 304 packed?', a: 'SS 304 machhar jali is supplied in rolls with a grade sticker.' },
        NCR_FAQ
      ],
      meta_title: '14×14 Door Machhar Jali Noida | Garg',
      meta_description: '14×14 door machhar jali in GI, aluminium, SS 304, 201 and 202. Widths 2 to 5 ft. Noida. Quote 9910238277.',
      meta_keywords: 'machhar jali, 14x14 door mesh, mosquito mesh noida, ss 304 machhar jali',
      sort_order: 1,
      featured: true,
      materials: MATERIALS,
      spec_kind: 'machhar'
    })
  ];

  return hub({
    slug: 'door-machhar-jali',
    name: 'Door Machhar Jali',
    short_desc: '14×14 woven door and window mesh in GI, aluminium, SS 304, SS 201 and SS 202. Widths 2–5 ft.',
    description: 'Door machhar jali from Garg Industrial Mesh, Sector 9 Noida. 14×14 mesh only. Widths ' + WIDTHS + '. GI, aluminium, SS 304, SS 201 and SS 202. SS 304 rolls include a grade sticker.',
    meta_title: 'Door Machhar Jali Noida | 14×14 | Garg',
    meta_description: '14×14 machhar jali in GI, aluminium and SS 304 / 201 / 202. Widths 2, 2.5, 3, 3.5, 4 and 5 ft. Quote 9910238277.',
    meta_keywords: 'machhar jali noida, door mesh, 14x14 mosquito mesh, wire mesh for door',
    sort_order: 11,
    group: 'animal',
    designs,
    cover_image: content.images.find((i) => /hero|roll|product/i.test(i)) || content.images[0],
    content_folder: content.folder,
    materials: MATERIALS,
    guide: [
      {
        id: 'sizes',
        title: 'Mesh and widths',
        body: 'One mesh count. Pick the metal on the next step. SS 304 leaves as rolls with a grade sticker.',
        tables: [[
          ['Spec', 'Stock'],
          ['Mesh', '14×14 only'],
          ['Widths', WIDTHS],
          ['Metals', 'GI · Aluminium · SS 304 · SS 201 · SS 202'],
          ['SS 304 pack', 'Rolls with grade sticker']
        ]]
      },
      {
        id: 'faq',
        title: 'Frequently asked questions',
        body: 'What to send with a machhar jali enquiry.',
        faqs: [
          { q: 'Do you stock 16×16, 18×18 or 20×20 door mesh?', a: 'No. Door machhar jali is 14×14 only.' },
          { q: 'Is 6 ft width a stock size?', a: 'Stock widths are ' + WIDTHS + '.' },
          NCR_FAQ
        ]
      }
    ]
  });
}

module.exports = { buildCategory, MATERIALS };
