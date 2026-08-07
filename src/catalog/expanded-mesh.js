const { mat } = require('./helpers');

// Specs from source/expanded mesh/<name>/data.txt (Triton has empty SPECS FILE).
const DESIGNS = [
  { name: 'Ariel', swd: 115, lwd: 55, strand: 20 },
  { name: 'Atlas', swd: 75, lwd: 25, strand: 20 },
  { name: 'Calypso', swd: 180, lwd: 55, strand: 43 },
  { name: 'Dione', swd: 115, lwd: 55, strand: 20 },
  { name: 'Europa', swd: 65, lwd: 30, strand: 20 },
  { name: 'Helene', swd: 40, lwd: 15, strand: 4 },
  { name: 'Janus', swd: 80, lwd: 15, strand: 5 },
  { name: 'Miranda', swd: 40, lwd: 20, strand: 15 },
  { name: 'Pan', swd: 25, lwd: 15, strand: 12 },
  { name: 'Phoebe', swd: 40, lwd: 15, strand: 3 },
  { name: 'Rhea', swd: 40, lwd: 15, strand: 12 },
  { name: 'Telesto', swd: 25, lwd: 7, strand: 5 },
  { name: 'Tethys', swd: 25, lwd: 15, strand: 8 },
  { name: 'Titan', swd: 18, lwd: 9, strand: 4 },
  { name: 'Triton', swd: null, lwd: null, strand: null }
];

const MATERIALS = [
  mat('mild-steel', 'Mild Steel', 'MS', 'Mild steel expanded mesh for industrial guards, walkways and economy cladding.', {
    sort_order: 1,
    best_for: 'Guards, walkways, machine protection and general industrial screens.',
    detail: 'MS expanded mesh is the everyday industrial choice. Confirm SWD/LWD/strand, thickness and sheet size on the RFQ. Paint or powder-coat for outdoor life.'
  }),
  mat('aluminium', 'Aluminium', 'Aluminium', 'Lightweight aluminium expanded mesh for facades, grilles and architectural screens.', {
    sort_order: 2,
    best_for: 'Facades, grilles, sunscreens and lightweight architectural work.',
    detail: 'Aluminium expanded mesh is light and corrosion-resistant. State alloy/temper if required, plus SWD/LWD/strand and sheet size.'
  }),
  mat('stainless-steel', 'Stainless Steel', 'SS 304 / SS', 'Stainless expanded mesh for corrosive and long-life outdoor duty.', {
    sort_order: 3,
    best_for: 'Coastal, washdown-adjacent and long outdoor life screens.',
    detail: 'Stainless expanded mesh for corrosion resistance. Confirm grade (e.g. 304), SWD/LWD/strand, thickness and sheet size on the RFQ.'
  })
];

function padSpec(v) {
  return v == null || Number.isNaN(Number(v)) ? null : Number(v);
}

function shortFor(d) {
  if (d.swd == null) return 'Expanded metal mesh — confirm SWD, LWD and strand width on RFQ';
  return `SWD ${d.swd} mm · LWD ${d.lwd} mm · Strand ${d.strand} mm`;
}

function guideSections() {
  return [
    {
      id: 'what-is',
      title: 'What is expanded mesh?',
      body: 'Expanded metal mesh is slit and stretched from a solid sheet — no welds. The diamond openings are defined by SWD (short way of diamond), LWD (long way of diamond) and strand width. Garg Industrial Mesh supplies named stock patterns from Sector 9, Noida across Delhi NCR.'
    },
    {
      id: 'glossary',
      title: 'SWD, LWD & strand width',
      body: 'Use these three numbers when ordering. They come from our measured stock patterns — not invented sizes.',
      bullets: [
        'SWD — Short Way of Diamond: the shorter centre-to-centre distance across the diamond (mm)',
        'LWD — Long Way of Diamond: the longer centre-to-centre distance across the diamond (mm)',
        'Strand width — width of the metal strand forming the diamond edge (mm)',
        'Also state thickness, sheet size, material (MS / aluminium / SS) and quantity on the RFQ'
      ]
    },
    {
      id: 'stock',
      title: 'Stock patterns',
      body: 'Each design keeps its source name. Specs below are from our pattern data sheets.',
      tables: [[
        ['Design', 'SWD (mm)', 'LWD (mm)', 'Strand (mm)'],
        ...DESIGNS.map((d) => [
          d.name,
          d.swd != null ? String(d.swd) : 'Confirm on RFQ',
          d.lwd != null ? String(d.lwd) : 'Confirm on RFQ',
          d.strand != null ? String(d.strand) : 'Confirm on RFQ'
        ])
      ]]
    },
    {
      id: 'materials',
      title: 'Materials',
      body: 'Expanded mesh is available in Mild Steel, Aluminium and Stainless Steel. Finish (mill, painted, powder-coated) on request.',
      bullets: [
        'Mild Steel — economy industrial duty',
        'Aluminium — lightweight facades and grilles',
        'Stainless Steel — corrosive / long outdoor life'
      ]
    },
    {
      id: 'faq',
      title: 'Frequently asked questions',
      body: 'Common questions for expanded mesh orders.',
      faqs: [
        {
          q: 'How do I specify an expanded mesh order?',
          a: 'Name the design (e.g. Ariel), confirm SWD / LWD / strand from our table, then material, thickness, sheet size and quantity.'
        },
        {
          q: 'Do you deliver in Delhi NCR?',
          a: 'Yes — from Sector 9, Noida across Noida, Greater Noida, Delhi, Ghaziabad, Faridabad and Gurugram.'
        }
      ]
    }
  ];
}

function buildCategory() {
  const designs = DESIGNS.map((d, i) => {
    const slug = d.name.toLowerCase();
    const short = shortFor(d);
    const faq = [
      { q: 'What is ' + d.name + '?', a: d.swd != null ? d.name + ' expanded mesh: ' + short + '.' : d.name + ' expanded mesh — confirm SWD, LWD and strand on the RFQ (specs file pending).' },
      { q: 'Which materials?', a: 'Mild Steel, Aluminium and Stainless Steel. Confirm thickness and sheet size on the RFQ.' },
      { q: 'NCR delivery?', a: 'Yes — Garg Industrial Mesh supplies from Sector 9, Noida across Delhi NCR.' }
    ];
    return {
      slug,
      name: d.name,
      hole_shape: 'Diamond',
      hole_mm: padSpec(d.swd),
      pitch_mm: padSpec(d.lwd),
      angle_deg: null,
      open_area_pct: padSpec(d.strand),
      short_desc: short,
      description: d.name + ' expanded metal mesh. ' + short + '. Mild Steel, Aluminium or Stainless Steel from Garg Industrial Mesh, Sector 9 Noida.',
      applications: 'Guards, walkways, facades, grilles, machine protection, screens',
      faq: JSON.stringify(faq),
      meta_title: d.name + ' Expanded Mesh Noida | Garg',
      meta_description: 'Buy ' + d.name + ' expanded mesh in Noida — ' + short + '. MS, aluminium, SS. Quote 9910238277.',
      meta_keywords: 'expanded mesh, ' + d.name.toLowerCase() + ' expanded mesh, expanded metal noida',
      sort_order: i + 1,
      featured: i < 4 ? 1 : 0,
      materials: MATERIALS.map((m) => ({ ...m })),
      spec_kind: 'expanded',
      studio_slug: slug
    };
  });

  return {
    slug: 'expanded-mesh',
    name: 'Expanded Mesh',
    short_desc: 'Named expanded metal patterns (SWD / LWD / strand) in MS, aluminium and stainless — Noida.',
    description: 'Expanded metal mesh from Garg Industrial Mesh, Sector 9 Noida. Stock patterns named Ariel through Triton with measured SWD, LWD and strand width.',
    guide_sections: JSON.stringify(guideSections()),
    meta_title: 'Expanded Mesh Noida | SWD LWD Strand | Garg Industrial Mesh',
    meta_description: 'Expanded mesh supplier in Noida — named stock patterns with SWD/LWD/strand specs. MS, aluminium, SS. Quote 9910238277.',
    meta_keywords: 'expanded mesh noida, expanded metal mesh, SWD LWD strand, aluminium expanded mesh',
    sort_order: 3,
    featured: 1,
    designs,
    content_folder: null,
    materials_catalog: MATERIALS
  };
}

module.exports = { buildCategory, MATERIALS, DESIGNS };
