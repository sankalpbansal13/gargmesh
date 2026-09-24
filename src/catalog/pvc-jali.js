const { loadContent, mat, sku, hub, NCR_FAQ } = require('./helpers');

const content = loadContent('pvc-jali');

const LIGHT = mat('light-green', 'Light green', 'Light green PVC', 'Light green PVC plastic mesh.', {
  sort_order: 1,
  best_for: 'Garden and site plastic mesh in light green.',
  detail: 'Light green PVC. Confirm roll width and length on the RFQ.'
});
const DARK = mat('dark-green', 'Dark green', 'Dark green PVC', 'Dark green RP plastic jali.', {
  sort_order: 1,
  best_for: 'RP jaali in dark green.',
  detail: 'Dark green RP jaali. Confirm roll width and length on the RFQ.'
});

const NET_COLOURS = [
  ['ivory', 'Ivory'],
  ['brown', 'Brown'],
  ['black', 'Black'],
  ['sky-blue', 'Sky blue'],
  ['grey', 'Grey'],
  ['pink', 'Pink'],
  ['green', 'Green']
].map(([slug, name], i) => mat(slug, name, name + ' plastic mosquito net', name + ' coloured plastic mosquito net, 6 ft stock.', {
  sort_order: i + 1,
  best_for: 'Coloured plastic mosquito net.',
  detail: name + ' plastic mosquito net. Stock height 6 ft. Typical roll 6 ft × 15 m. Listed as Garg stock.'
}));

function buildCategory() {
  const designs = [
    sku({
      slug: 'pvc-jali-01',
      name: 'Large mesh virgin',
      hole_shape: 'Hexagonal',
      short_desc: 'Large-mesh virgin PVC jali · light green',
      description: 'Large mesh virgin PVC plastic jali in light green. Garden, poultry and site screening. Confirm width and roll length on the RFQ. From Sector 9, Noida.',
      applications: 'Garden, poultry, site screening',
      meta_title: 'Large Mesh Virgin PVC Jali Noida | Garg',
      meta_description: 'Light green large-mesh virgin PVC jali from Noida. Quote 9910238277.',
      meta_keywords: 'pvc jali, large mesh virgin, plastic jali noida',
      sort_order: 1,
      featured: true,
      materials: [LIGHT],
      spec_kind: 'pvc'
    }),
    sku({
      slug: 'pvc-mini-hex',
      name: 'Mini hex virgin',
      hole_shape: 'Hexagonal',
      short_desc: 'Mini hex virgin PVC mesh · light green',
      description: 'Mini hex virgin PVC mesh in light green. Confirm width and roll length on the RFQ. From Sector 9, Noida.',
      applications: 'Garden and light screening',
      meta_title: 'Mini Hex PVC Mesh Noida | Garg',
      meta_description: 'Light green mini hex virgin PVC mesh from Noida. Quote 9910238277.',
      meta_keywords: 'mini hex pvc, plastic mesh noida, pvc jali',
      sort_order: 2,
      materials: [LIGHT],
      spec_kind: 'pvc'
    }),
    sku({
      slug: 'pvc-rp',
      name: 'RP jaali',
      hole_shape: 'Hexagonal',
      short_desc: 'RP plastic jaali · dark green',
      description: 'RP jaali in dark green. Confirm width and roll length on the RFQ. From Sector 9, Noida.',
      applications: 'Garden and compound screening',
      meta_title: 'RP Jaali Noida | Dark Green | Garg',
      meta_description: 'Dark green RP jaali from Noida. Quote 9910238277.',
      meta_keywords: 'rp jaali, dark green plastic jali, pvc mesh noida',
      sort_order: 3,
      materials: [DARK],
      spec_kind: 'pvc'
    }),
    sku({
      slug: 'pvc-mosquito-net',
      name: 'Mosquito plastic jali',
      hole_shape: 'Woven',
      short_desc: 'Coloured plastic mosquito net · 6 ft stock · ivory, brown, black, sky blue, grey, pink, green',
      description: 'Coloured plastic mosquito net, stocked at 6 ft height. Colours: ivory, brown, black, sky blue, grey, pink and green. Typical pack 6 ft × 15 m. Sold as Garg stock. From Sector 9, Noida.',
      applications: 'Windows, doors and verandah mosquito net',
      faqs: [
        { q: 'What height is in stock?', a: '6 ft. Typical roll is 6 ft × 15 m.' },
        { q: 'Which colours?', a: 'Ivory, brown, black, sky blue, grey, pink and green.' },
        NCR_FAQ
      ],
      meta_title: 'Plastic Mosquito Net 6 ft Noida | Garg',
      meta_description: '6 ft plastic mosquito net in ivory, brown, black, sky blue, grey, pink and green. Garg Industrial Mesh, Noida. Quote 9910238277.',
      meta_keywords: 'plastic mosquito net, 6 ft mosquito jali, coloured mosquito net noida',
      sort_order: 4,
      materials: NET_COLOURS,
      spec_kind: 'pvc'
    })
  ];

  return hub({
    slug: 'pvc-plastic-jali',
    name: 'PVC Plastic Jali',
    short_desc: 'Large mesh virgin and mini hex in light green. RP jaali in dark green. Coloured mosquito net in 6 ft stock.',
    description: 'PVC plastic jali from Garg Industrial Mesh, Sector 9 Noida. Large mesh virgin and mini hex virgin are light green. RP jaali is dark green. Mosquito plastic jali is 6 ft stock in ivory, brown, black, sky blue, grey, pink and green.',
    meta_title: 'PVC Plastic Jali Noida | Garg Industrial Mesh',
    meta_description: 'PVC jali in Noida — light green virgin mesh, dark green RP, and 6 ft coloured mosquito net. Quote 9910238277.',
    meta_keywords: 'pvc jali noida, plastic mesh, mosquito net, rp jaali',
    sort_order: 7,
    group: 'sheet',
    designs,
    cover_image: content.images.find((i) => /hero/i.test(i)) || content.images[0],
    content_folder: content.folder,
    materials: [LIGHT, DARK, ...NET_COLOURS],
    guide: [
      {
        id: 'range',
        title: 'Range and colour',
        body: 'Four listings. Colour is fixed on the virgin and RP lines. Mosquito net is chosen by colour.',
        tables: [[
          ['Listing', 'Colour', 'Notes'],
          ['Large mesh virgin', 'Light green', 'Virgin PVC mesh'],
          ['Mini hex virgin', 'Light green', 'Smaller hex PVC mesh'],
          ['RP jaali', 'Dark green', 'RP plastic jaali'],
          ['Mosquito plastic jali', 'Ivory, brown, black, sky blue, grey, pink, green', '6 ft stock. Typical roll 6 ft × 15 m']
        ]]
      },
      {
        id: 'faq',
        title: 'Frequently asked questions',
        body: 'Colour and pack.',
        faqs: [
          { q: 'Is the coloured mosquito net Garg stock?', a: 'Yes. It is listed as Garg stock. The 6 ft rolls are ivory, brown, black, sky blue, grey, pink and green.' },
          NCR_FAQ
        ]
      }
    ]
  });
}

module.exports = { buildCategory, MATERIALS: [LIGHT, DARK, ...NET_COLOURS] };
