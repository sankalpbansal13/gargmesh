const { loadContent, guideFromContent, mat } = require('./helpers');

const content = loadContent('machhar-jali');

const MATERIALS = [
  mat('aluminium', 'Aluminium', 'Aluminium mosquito / door mesh', 'Lightweight aluminium machhar jali for doors and windows.', {
    sort_order: 1,
    best_for: 'Door and window mosquito mesh, channel widths 2–6 ft.',
    detail: 'Aluminium woven mosquito mesh (darwaze wali jali). Confirm mesh count, roll width (2–6 ft incl. half-feet) and quantity on the RFQ.'
  }),
  mat('ss-304', 'Stainless Steel 304', 'SS 304', 'Premium SS woven mosquito / insect screen for doors and balconies.', {
    sort_order: 2,
    best_for: 'Long-life door/window insect screens and balcony cloth.',
    detail: 'SS 304 woven machhar jali for durability. Confirm mesh count (e.g. 18×16, 18×18, 20×20), width and black coat if required.'
  }),
  mat('ss-202', 'Stainless Steel 202', 'SS 202 economy', 'Economy stainless machhar jali for cost-sensitive door/window jobs.', {
    sort_order: 3,
    best_for: 'Economy SS insect mesh where 304 is not specified.',
    detail: 'SS 202 economy woven mosquito mesh in common roll widths 2–6 ft. Confirm mesh count and width on the RFQ.'
  })
];

const MESHES = [
  { mesh: '14×14', short: '14×14 count — common ALU door/window mesh' },
  { mesh: '16×16', short: '16×16 count — denser insect screen' },
  { mesh: '18×16', short: '18×16 count — popular SS/ALU insect mesh' },
  { mesh: '18×18', short: '18×18 fine insect screen' },
  { mesh: '20×20', short: '20×20 fine insect screen' }
];

function buildCategory() {
  const designs = MESHES.map((m, i) => {
    const n = i + 1;
    const pad = String(n).padStart(2, '0');
    const name = 'Door Machhar Jali ' + pad;
    const slug = 'machhar-' + pad;
    return {
      slug,
      name,
      hole_shape: 'Woven',
      hole_mm: null,
      pitch_mm: null,
      angle_deg: null,
      open_area_pct: null,
      short_desc: m.mesh + ' mesh · ' + m.short + ' · roll widths 2–6 ft',
      description: name + ' — ' + m.mesh + ' woven machhar jali (mosquito / door mesh). ' + m.short + '. Available in Aluminium, SS 304 and SS 202. Roll widths 2–6 ft including half-foot sizes from Sector 9 Noida.',
      applications: 'Doors, windows, kitchen, balcony insect screens',
      faq: JSON.stringify([
        { q: 'What mesh count is this?', a: name + ' is ' + m.mesh + ' mesh. ' + m.short + '.' },
        { q: 'What widths?', a: 'Roll widths typically 2–6 ft including half-foot sizes (e.g. 2.5, 3.5, 4.5 ft). State width on the RFQ.' },
        { q: 'Which materials?', a: 'Aluminium, SS 304 and SS 202.' },
        { q: 'NCR delivery?', a: 'Yes — from Sector 9, Noida across Delhi NCR.' }
      ]),
      meta_title: name + ' Noida | Garg',
      meta_description: 'Buy ' + name + ' (' + m.mesh + ') aluminium & SS machhar jali in Noida. Quote 9910238277.',
      meta_keywords: 'machhar jali, mosquito mesh, ' + name.toLowerCase() + ', door mesh noida',
      sort_order: n,
      featured: n <= 2 ? 1 : 0,
      materials: MATERIALS.map((x) => ({ ...x })),
      spec_kind: 'machhar',
      mesh_label: m.mesh
    };
  });

  return {
    slug: 'door-machhar-jali',
    name: 'Door Machhar Jali',
    short_desc: 'Aluminium & SS woven mosquito / door mesh — mesh counts 14×14 to 20×20, widths 2–6 ft.',
    description: content.meta_description,
    guide_sections: JSON.stringify(guideFromContent(content)),
    meta_title: content.og_title || content.title,
    meta_description: content.meta_description,
    meta_keywords: content.meta_keywords || 'machhar jali noida, mosquito mesh, door mesh',
    sort_order: 5,
    featured: 1,
    designs,
    cover_image: content.images.find((i) => /hero|roll|product/i.test(i)) || content.images[0],
    content_folder: content.folder,
    materials_catalog: MATERIALS
  };
}

module.exports = { buildCategory, MATERIALS };
