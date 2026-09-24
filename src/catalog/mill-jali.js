const { mat, sku, hub, NCR_FAQ } = require('./helpers');

const MATERIALS = [
  mat('ss-304', 'Stainless Steel 304', 'SS 304', 'SS 304 hopper mesh and rice mill jali.', {
    sort_order: 1,
    best_for: 'Rice mill, hopper and food screens that stay wet.',
    detail: 'SS 304 is the metal rice mills and atta plants usually name for hopper mesh and chamber jali. Hole numbers run from 3 No. (0.60 mm) to 15 No.'
  }),
  mat('brass', 'Brass', 'Brass', 'Brass mill jali for hopper and spice screens.', {
    sort_order: 2,
    best_for: 'Hopper and spice screens ordered in brass.',
    detail: 'Brass number jali is the same hole chart in brass. Spice and mill workshops order it when the existing screen is brass.'
  }),
  mat('copper', 'Copper', 'Copper', 'Copper mill screen where the drawing says copper.', {
    sort_order: 3,
    best_for: 'Mill screens specified in copper.',
    detail: 'Copper perforated mill sheet uses the same hole numbers. Order it when the hopper or chamber screen is specified in copper.'
  })
];

/** Garg hole chart. Number on the left, hole size on the right. */
const HOLES = [
  ['3', '3 No.', 0.6, '0.60 mm', 'Micro hole hopper mesh and fine rice or spice screen'],
  ['4', '4 No.', 0.8, '0.80 mm', 'Fine hopper jali and small-hole mill screen'],
  ['5', '5 No.', 1, '1 mm', 'Fine mill screen and hopper mesh'],
  ['5h', '5½ No.', 1.2, '1.2 mm', 'Fine hole rice mill and chamber jali'],
  ['6', '6 No.', 1.4, '1.4 mm', 'Fine hole mill jali'],
  ['6h', '6½ No.', 1.5, '1.5 mm', 'Fine hole hopper and cleaner screen'],
  ['7h', '7½ No.', 2, '2 mm', 'Rice mill and atta chakki chamber screen'],
  ['8h', '8½ No.', 2.5, '2.5 mm', 'Mill chamber and grader screen'],
  ['10', '10 No.', 3, '3 mm', 'Hopper and cleaner screen'],
  ['11', '11 No.', 4, '4 mm', 'Rice mill and dal mill screen'],
  ['12', '12 No.', 5, '5 mm', 'Grader and cleaner jali'],
  ['13', '13 No.', 6, '6 mm', 'Coarser mill and hopper screen'],
  ['14', '14 No.', 7, '7 mm', 'Coarse cleaner screen'],
  ['15', '15 No.', 8, '8 mm', 'Coarse mill screen']
];

function buildCategory() {
  const designs = HOLES.map(([slug, name, mm, label, use], i) => {
    const micro = mm <= 1.5;
    return sku({
      slug: 'mill-' + slug,
      name: name,
      hole_shape: 'Round',
      hole_mm: mm,
      short_desc: name + ' · ' + label + (micro ? ' micro hole' : '') + ' · hopper mesh, rice mill jali · SS 304, brass, copper',
      description: name + ' is a ' + label + ' round-hole perforated sheet. Mills call it hopper mesh, hopper jali, rice mill jali and number jali. ' + use + '. Metals: SS 304, brass and copper. Also used as atta chakki jali, dal mill jali and spice mill screen. Plate size and thickness are confirmed on the RFQ. From Sector 9, Noida.',
      applications: 'Hopper mesh, rice mill jali, atta chakki jali, dal mill jali, spice mill screen',
      faqs: [
        { q: 'What do mills call ' + name + '?', a: 'Hopper mesh, hopper jali, rice mill screen and number jali. The hole is ' + label + ' on the Garg chart.' + (micro ? ' Holes at 1.5 mm and below are the micro hole / fine hole perforated sheets.' : '') },
        { q: 'Where is it used?', a: use + '. The same sheet is fitted in rice mill hoppers, atta chakki chambers, dal mills and spice mills. Send the hole number, or a sample, plus metal and thickness.' },
        { q: 'Which metal?', a: 'SS 304 is the usual food and wet-screen metal. Brass and copper are made to the same hole number when the mill already runs that metal.' },
        { q: 'Is this woven atta channi?', a: 'No. Atta channi and filter cloth are Fine Mesh (mesh × SWG). This is punched sheet.' },
        NCR_FAQ
      ],
      meta_title: name + ' Hopper Mesh ' + label + ' | Noida',
      meta_description: name + ' hopper mesh, hole ' + label + ', in SS 304, brass and copper. Rice mill, atta, dal and spice jali. Noida. Call 9910238277.',
      meta_keywords: 'hopper mesh, hopper jali, rice mill jali, ' + name + ' mill screen, micro hole perforated, atta chakki jali, number jali noida',
      sort_order: i + 1,
      featured: i === 0,
      materials: MATERIALS,
      spec_kind: 'mill'
    });
  });

  return hub({
    slug: 'number-perforated',
    name: 'Hopper Mesh & Mill Jali',
    short_desc: 'Micro hole and mill screens by hole number, 3 No. (0.60 mm) to 15 No. SS 304, brass, copper.',
    description: 'Hopper mesh and mill jali from Garg Industrial Mesh, Sector 9 Noida. Rice mills, atta plants, dal mills and spice grinders order this punched sheet by hole number: 3 No. (0.60 mm) through 15 No. (8 mm). The fine end — 3 No. to 6½ No., 0.60 mm to 1.5 mm — is what buyers call micro hole perforated sheet or fine hole jali. Metals are SS 304, brass and copper. Also called rice mill jali, hopper jali, atta chakki jali, dal mill jali and spice mill screen. This is not architectural Perforated 01–29, and not woven atta channi.',
    meta_title: 'Hopper Mesh & Micro Hole Mill Jali Noida | Garg',
    meta_description: 'Hopper mesh and rice mill jali in Noida. Micro holes from 0.60 mm, 3 No. to 15 No., SS 304, brass and copper. Call 9910238277.',
    meta_keywords: 'hopper mesh, hopper jali, rice mill jali, micro hole perforated sheet, fine hole jali, atta chakki jali, dal mill jali, spice mill screen, number jali noida',
    sort_order: 15,
    group: 'sheet',
    designs,
    materials: MATERIALS,
    guide: [
      {
        id: 'chart',
        title: 'Hole number chart',
        body: 'Garg chart: number on the left, hole size on the right. Round holes in SS 304, brass and copper. 3 No. to 6½ No. (0.60 mm to 1.5 mm) are the micro hole sheets. Thickness and plate size are confirmed on the RFQ.',
        tables: [[
          ['No.', 'Hole size', 'What mills call it'],
          ...HOLES.map((row) => [row[1], row[3], row[2] <= 1.5 ? 'Micro hole / fine hopper mesh' : 'Hopper mesh / mill screen'])
        ]]
      },
      {
        id: 'use',
        title: 'Names and where the demand is',
        body: 'Replacement screens are bought by rice mills, atta chakki plants, dal mills and spice grinders. They ask for hopper mesh, rice mill jali or a hole number. Woven sifter cloth is Fine Mesh.',
        faqs: [
          { q: 'What is hopper mesh?', a: 'The perforated sheet in the mill hopper. Order it by hole number (3 No. to 15 No.), metal and thickness. SS 304, brass and copper.' },
          { q: 'What is a micro hole perforated sheet?', a: 'The fine end of this chart: 3 No. is 0.60 mm, 4 No. is 0.80 mm, 5 No. is 1 mm, up to 6½ No. at 1.5 mm. Larger numbers are still mill jali, just coarser.' },
          { q: 'Atta chakki jali versus atta channi?', a: 'Chakki and chamber screens are this punched sheet. Atta channi, maida and spice powder cloth are woven Fine Mesh.' },
          NCR_FAQ
        ]
      }
    ]
  });
}

module.exports = { buildCategory, MATERIALS, HOLES };
