const { loadContent, guideFromContent, mat } = require('./helpers');

const content = loadContent('pvc-jali');

const MATERIALS = [
  mat('pvc-hdpe', 'PVC / HDPE', 'PVC plastic mesh / HDPE garden mesh', 'Green PVC / HDPE plastic jali for garden, poultry, sports and construction use.', {
    sort_order: 1,
    best_for: 'Garden fencing, poultry, sports nets, warehouse and construction screening.',
    detail: 'PVC / HDPE plastic mesh (hexagonal garden jali). Confirm hole size band, GSM, width (commonly 3–6 ft) and roll length on the RFQ — rates vary with specification.'
  })
];

function buildCategory() {
  const name = 'PVC Plastic Jali 01';
  const slug = 'pvc-jali-01';
  const designs = [{
    slug,
    name,
    hole_shape: 'Hexagonal',
    hole_mm: null,
    pitch_mm: null,
    angle_deg: null,
    open_area_pct: null,
    short_desc: 'Hexagonal PVC / HDPE plastic jali — garden, poultry, sports, construction',
    description: name + ' — PVC / HDPE plastic mesh for multipurpose outdoor and site use. Confirm width, hole size and GSM with your RFQ. Supplied from Sector 9 Noida across Delhi NCR.',
    applications: 'Garden, poultry, sports, warehouse, construction screening',
    faq: JSON.stringify(content.faqs && content.faqs.length ? content.faqs.slice(0, 8) : [
      { q: 'What is PVC plastic jali used for?', a: 'Garden fencing, poultry, sports, warehouse and construction screening — confirm size and GSM on the RFQ.' },
      { q: 'NCR delivery?', a: 'Yes — from Sector 9, Noida across Delhi NCR.' }
    ]),
    meta_title: name + ' Noida | Garg',
    meta_description: content.meta_description || 'PVC plastic mesh and HDPE garden jali from Noida. Quote 9910238277.',
    meta_keywords: content.meta_keywords || 'pvc mesh, plastic jali, hdpe mesh noida',
    sort_order: 1,
    featured: 1,
    materials: MATERIALS.map((m) => ({ ...m })),
    spec_kind: 'pvc'
  }];

  return {
    slug: 'pvc-plastic-jali',
    name: 'PVC Plastic Jali',
    short_desc: 'PVC / HDPE plastic mesh for garden, poultry, sports and construction.',
    description: content.meta_description || 'PVC plastic jali from Garg Industrial Mesh, Noida.',
    guide_sections: JSON.stringify(guideFromContent(content)),
    meta_title: content.og_title || content.title || 'PVC Plastic Jali Noida | Garg',
    meta_description: content.meta_description,
    meta_keywords: content.meta_keywords || 'pvc plastic jali, plastic mesh noida',
    sort_order: 6,
    featured: 1,
    designs,
    cover_image: content.images.find((i) => /hero/i.test(i)) || content.images[0],
    content_folder: content.folder,
    materials_catalog: MATERIALS
  };
}

module.exports = { buildCategory, MATERIALS };
