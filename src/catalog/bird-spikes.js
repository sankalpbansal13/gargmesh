const { loadContent, guideFromContent, mat } = require('./helpers');

const content = loadContent('bird-spikes');

const MAT_PC = mat('polycarbonate', 'Polycarbonate', 'UV polycarbonate bird spikes', 'Plastic bird spikes for ledges, AC units and signage.', {
  sort_order: 1,
  best_for: 'Bird control on ledges, AC outdoor units, signage and parapets.',
  detail: 'Polycarbonate bird spikes — lightweight, UV-stable plastic base with pins. Confirm strip length and installation surface on the RFQ.'
});
const MAT_SS = mat('ss-304', 'Stainless Steel 304', 'SS 304 bird / monkey spikes', 'SS 304 spikes for long-life outdoor bird and monkey deterrence.', {
  sort_order: 2,
  best_for: 'Long-life outdoor spikes and heavier deterrent duty.',
  detail: 'SS 304 spike systems for durable outdoor install. Confirm product line (bird vs monkey), base type and run length.'
});
const MAT_NET = mat('nylon-net', 'UV Nylon Net', 'Anti-bird netting', 'UV-stabilised nylon anti-bird nets for balconies and façades.', {
  sort_order: 3,
  best_for: 'Balcony and façade bird exclusion nets.',
  detail: 'Anti-bird netting in UV nylon. Confirm mesh size (e.g. 25 mm / 50 mm if specified), colour and area on the RFQ.'
});

const LINES = [
  {
    line: 'Polycarbonate Bird Spikes',
    short_desc: 'UV polycarbonate bird spike strips for ledges and AC units',
    description: 'Polycarbonate bird spikes for humane deterrence on ledges, AC units, signage and parapets. From Garg Industrial Mesh, Sector 9 Noida.',
    materials: [MAT_PC],
    applications: 'Ledges, AC units, signage, parapets'
  },
  {
    line: 'SS 304 Bird Spikes',
    short_desc: 'Stainless steel 304 bird spikes for long outdoor life',
    description: 'SS 304 bird spikes for durable outdoor bird control. Confirm run length and fixings on the RFQ.',
    materials: [MAT_SS],
    applications: 'Outdoor ledges, rooftops, industrial sheds'
  },
  {
    line: 'Monkey Spikes',
    short_desc: 'Heavy-duty monkey deterrent spikes',
    description: 'Heavy-duty monkey spikes for Indian residential and commercial sites. Confirm length and mounting surface.',
    materials: [MAT_SS, MAT_PC],
    applications: 'Balconies, compound walls, rooftops'
  },
  {
    line: 'Anti-Bird Netting',
    short_desc: 'UV nylon balcony and façade bird nets',
    description: 'Anti-bird netting for balconies and façades. Confirm mesh size, colour and covered area on the RFQ.',
    materials: [MAT_NET],
    applications: 'Balconies, courtyards, façades'
  }
];

function buildCategory() {
  const designs = LINES.map((line, i) => {
    const n = i + 1;
    const pad = String(n).padStart(2, '0');
    const name = 'Bird & Monkey Spikes ' + pad;
    const slug = 'bird-spikes-' + pad;
    return {
      slug,
      name,
      hole_shape: null,
      hole_mm: null,
      pitch_mm: null,
      angle_deg: null,
      open_area_pct: null,
      short_desc: line.line + ' — ' + line.short_desc,
      description: name + ' (' + line.line + '). ' + line.description,
      applications: line.applications,
      faq: JSON.stringify((content.faqs || []).slice(0, 5)),
      meta_title: name + ' Noida | Garg Industrial Mesh',
      meta_description: line.line + '. ' + line.short_desc + '. Sector 9 Noida. Quote 9910238277.',
      meta_keywords: line.line.toLowerCase() + ', bird spikes noida, monkey spikes',
      sort_order: n,
      featured: n <= 2 ? 1 : 0,
      materials: line.materials.map((m) => ({ ...m })),
      spec_kind: 'spikes'
    };
  });

  return {
    slug: 'bird-monkey-spikes',
    name: 'Bird & Monkey Spikes',
    short_desc: 'Polycarbonate & SS bird spikes, monkey spikes and anti-bird nets.',
    description: content.meta_description || 'Bird spikes, monkey spikes and anti-bird nets from Noida.',
    guide_sections: JSON.stringify(guideFromContent(content)),
    meta_title: content.og_title || content.title || 'Bird & Monkey Spikes Noida | Garg',
    meta_description: content.meta_description,
    meta_keywords: content.meta_keywords || 'bird spikes noida, monkey spikes, anti bird net',
    sort_order: 7,
    featured: 1,
    designs,
    cover_image: content.images.find((i) => /hero/i.test(i)) || content.images[0],
    content_folder: content.folder,
    materials_catalog: [MAT_PC, MAT_SS, MAT_NET]
  };
}

module.exports = { buildCategory, MATERIALS: [MAT_PC, MAT_SS, MAT_NET] };
