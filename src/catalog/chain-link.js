const { loadContent, guideFromContent, mat } = require('./helpers');

const content = loadContent('chain-link');

const MATERIALS = [
  mat('gi', 'GI (Galvanised)', 'GI / Galvanized Iron', 'Zinc-coated chain link for outdoor fencing and boundary walls.', {
    sort_order: 1,
    best_for: 'Outdoor chain link fencing, compounds, site boundaries.',
    detail: 'GI chain link is the usual outdoor choice. Spec height (3–10 ft), wire (2.5/3/4 mm), box opening (50/55/75/100 mm clear), and 50 ft roll quantity on the RFQ.'
  }),
  mat('mild-steel', 'Mild Steel', 'MS', 'MS chain link for economy stacks — coat or paint for outdoor life.', {
    sort_order: 2,
    best_for: 'Economy fencing where GI is not specified.',
    detail: 'MS chain link for cost-sensitive jobs. Confirm height, wire, box (clear opening), roll length and whether PVC/green coat is required.'
  })
];

const BOXES = [
  { mm: 50, inch: '2″', note: 'Common residential / light compound box' },
  { mm: 55, inch: '2.2″', note: 'Intermediate clear opening' },
  { mm: 75, inch: '3″', note: 'Wider diamond — industrial / sports common' },
  { mm: 100, inch: '4″', note: 'Large box — maximum openness' }
];

function buildCategory() {
  const designs = BOXES.map((b, i) => {
    const n = i + 1;
    const pad = String(n).padStart(2, '0');
    const name = 'Chain Link Mesh ' + pad;
    const slug = 'chain-link-' + pad;
    return {
      slug,
      name,
      hole_shape: 'Diamond',
      hole_mm: b.mm,
      pitch_mm: null,
      angle_deg: null,
      open_area_pct: null,
      short_desc: b.mm + ' mm clear opening (' + b.inch + ') · heights 3–10 ft · wire 2.5/3/4 mm · 50 ft rolls',
      description: name + ' — chain link (diamond jali) with ' + b.mm + ' mm clear box opening (' + b.inch + '). ' + b.note + '. Heights 3–10 ft, wire 2.5 / 3 / 4 mm, standard 50 ft rolls. GI or MS from Sector 9 Noida.',
      applications: 'Boundary fencing, compounds, sports, site fencing',
      faq: JSON.stringify([
        { q: 'How is box size measured?', a: 'Clear inside opening between parallel wires of the diamond — not centre-to-centre. This design is ' + b.mm + ' mm clear.' },
        { q: 'What heights and wires?', a: 'Heights 3–10 ft; wire 2.5 / 3 / 4 mm; standard roll 50 ft. State all on the RFQ with GI or MS.' },
        { q: 'NCR delivery?', a: 'Yes — Garg Industrial Mesh supplies from Sector 9, Noida across Delhi NCR.' }
      ]),
      meta_title: name + ' Noida | Garg',
      meta_description: name + ' — GI & MS chain link, ' + b.mm + ' mm clear box, heights 3–10 ft. Noida. Quote 9910238277.',
      meta_keywords: 'chain link mesh, diamond jali, ' + name.toLowerCase() + ', gi chain link noida',
      sort_order: n,
      featured: n === 1 ? 1 : 0,
      materials: MATERIALS.map((m) => ({ ...m })),
      spec_kind: 'chain-link'
    };
  });

  return {
    slug: 'chain-link-mesh',
    name: 'Chain Link Mesh',
    short_desc: 'GI & MS diamond fencing — heights 3–10 ft, wire 2.5/3/4 mm, box 50–100 mm, 50 ft rolls.',
    description: content.meta_description,
    guide_sections: JSON.stringify(guideFromContent(content)),
    meta_title: content.og_title || content.title,
    meta_description: content.meta_description,
    meta_keywords: content.meta_keywords || 'chain link mesh noida, gi chain link, diamond jali',
    sort_order: 4,
    featured: 1,
    designs,
    cover_image: content.images.find((i) => /closeup|weave|available/i.test(i)) || content.images[0],
    content_folder: content.folder,
    materials_catalog: MATERIALS
  };
}

module.exports = { buildCategory, MATERIALS };
