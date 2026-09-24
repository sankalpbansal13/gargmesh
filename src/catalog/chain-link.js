const { loadContent, mat, sku, hub, NCR_FAQ } = require('./helpers');

const content = loadContent('chain-link');

const HEIGHTS = '3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 11 and 12 ft';
const PVC_COLOURS = 'Dark green, light green, black, blue and grey. Other colours on request.';

const MATERIALS = [
  mat('gi', 'GI (Galvanised)', 'GI / Galvanized Iron', 'Zinc-coated chain link for outdoor fencing.', {
    sort_order: 1,
    best_for: 'Outdoor boundary, compound and site fencing.',
    detail: 'GI chain link. Heights ' + HEIGHTS + '. Wire 2.5 / 3 / 4 mm. Standard roll 50 ft. State box size on the RFQ.'
  }),
  mat('pvc-coated', 'PVC powder coated', 'PVC powder coated over GI', 'Powder-coated chain link in stock colours, other colours on request.', {
    sort_order: 2,
    best_for: 'Society and compound fencing where a colour coat is specified.',
    detail: 'PVC powder coated chain link. Colours: ' + PVC_COLOURS + ' Same heights, wire and 50 ft rolls as GI.'
  })
];

const BOXES = [
  { slug: 'chain-link-01', mm: 50, inch: '2″', note: 'Tightest stock diamond — compounds and schools' },
  { slug: 'chain-link-03', mm: 75, inch: '3″', note: 'Wider diamond' },
  { slug: 'chain-link-04', mm: 100, inch: '4″', note: 'Largest stock diamond' }
];

function buildCategory() {
  const designs = BOXES.map((b, i) => {
    const n = i + 1;
    const name = 'Chain Link ' + b.inch;
    return sku({
      slug: b.slug,
      name,
      hole_shape: 'Diamond',
      hole_mm: b.mm,
      short_desc: b.inch + ' box (' + b.mm + ' mm clear) · heights ' + HEIGHTS + ' · wire 2.5/3/4 mm · 50 ft rolls',
      description: name + ' chain link. Clear box opening ' + b.inch + ' (' + b.mm + ' mm). ' + b.note + '. Heights ' + HEIGHTS + '. Wire 2.5 / 3 / 4 mm. Standard roll 50 ft. GI or PVC powder coated from Sector 9, Noida.',
      applications: 'Boundary fencing, compounds, sites',
      faqs: [
        { q: 'How is the box measured?', a: 'Clear inside opening of the diamond, not centre-to-centre. This design is ' + b.inch + ' (' + b.mm + ' mm clear).' },
        { q: 'Which heights and wire?', a: 'Heights ' + HEIGHTS + '. Wire 2.5 / 3 / 4 mm. Standard roll 50 ft.' },
        { q: 'Which materials and PVC colours?', a: 'GI or PVC powder coated. PVC colours: ' + PVC_COLOURS },
        NCR_FAQ
      ],
      meta_title: name + ' Chain Link Noida | Garg',
      meta_description: name + ' chain link — GI or PVC powder coated, heights to 12 ft, 50 ft rolls. Noida. Quote 9910238277.',
      meta_keywords: 'chain link mesh, ' + b.inch + ' chain link, gi chain link noida, pvc coated chain link',
      sort_order: n,
      featured: n === 1,
      materials: MATERIALS,
      spec_kind: 'chain-link'
    });
  });

  return hub({
    slug: 'chain-link-mesh',
    name: 'Chain Link Mesh',
    short_desc: 'GI and PVC powder coated diamond fencing. Boxes 2″, 3″ and 4″. Heights 3–12 ft including half-feet. 50 ft rolls.',
    description: 'Chain link from Garg Industrial Mesh, Sector 9 Noida — GI or PVC powder coated. Boxes 2″, 3″ and 4″. Heights ' + HEIGHTS + '. Wire 2.5 / 3 / 4 mm. Standard roll 50 ft.',
    meta_title: 'Chain Link Mesh Noida | GI & PVC Coated | Garg',
    meta_description: 'GI and PVC powder coated chain link in Noida. Boxes 2, 3 and 4 inch. Heights 3 to 12 ft. Quote 9910238277.',
    meta_keywords: 'chain link mesh noida, gi chain link, pvc coated chain link, diamond jali',
    sort_order: 6,
    group: 'sheet',
    designs,
    cover_image: content.images.find((i) => /closeup|weave|available/i.test(i)) || content.images[0],
    content_folder: content.folder,
    materials: MATERIALS,
    guide: [
      {
        id: 'sizes',
        title: 'Sizes',
        body: 'Stock chain link is GI or PVC powder coated. Box size is the clear diamond opening. Standard roll is 50 ft. Wire is 2.5 mm, 3 mm or 4 mm.',
        tables: [[
          ['Spec', 'Options'],
          ['Material', 'GI (galvanised) or PVC powder coated'],
          ['PVC colours', PVC_COLOURS],
          ['Box', '2″ (50 mm) · 3″ (75 mm) · 4″ (100 mm)'],
          ['Height', HEIGHTS],
          ['Wire', '2.5 mm · 3 mm · 4 mm'],
          ['Roll', '50 ft']
        ]]
      },
      {
        id: 'faq',
        title: 'Frequently asked questions',
        body: 'What to send with a chain link enquiry.',
        faqs: [
          { q: 'Do you still supply mild steel chain link?', a: 'No. Stock chain link is GI or PVC powder coated.' },
          { q: 'Is 2.2 inch / 55 mm a stock box?', a: 'No. Stock boxes are 2″, 3″ and 4″.' },
          { q: 'Can I get a PVC colour that is not on the card?', a: 'Yes — other colours on request. Name the colour on the RFQ.' },
          NCR_FAQ
        ]
      }
    ]
  });
}

module.exports = { buildCategory, MATERIALS };
