const { loadContent, guideFromContent, mat } = require('./helpers');

const content = loadContent('ss-welded');

const MATERIALS = [
  mat('ss-304', 'Stainless Steel 304', 'SS 304', 'Premium stainless weld mesh for coastal, food-adjacent and long-life outdoor duty.', {
    sort_order: 1,
    best_for: 'Guards, cages, fencing and railings where corrosion resistance matters.',
    detail: 'SS 304 is the premium stainless grade on our weldmesh sheet. Prefer 304 for coastal, washdown-adjacent and long outdoor life. Confirm opening (inch+mm), clear vs pitch, and wire mm/SWG on the RFQ.'
  }),
  mat('ss-201', 'Stainless Steel 201', 'SS 201 (SS 202 trade alias)', 'Economy stainless weld mesh for indoor and cost-sensitive stacks.', {
    sort_order: 2,
    best_for: 'Indoor / covered economy SS weldmesh where 304 is not required.',
    detail: 'SS 201 is our stocked economy stainless. “SS 202” in Indian trade often maps here — write the grade you need on the RFQ. Confirm aperture, wire and form (roll/panel).'
  })
];

function parseSku(line, index) {
  const n = index + 1;
  const pad = String(n).padStart(2, '0');
  const mm = line.match(/\((\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)(?:\s*[×x]\s*(\d+(?:\.\d+)?))?\s*mm\)/i);
  const openA = mm ? Number(mm[1]) : null;
  const openB = mm ? Number(mm[2]) : null;
  const wire = mm && mm[3] ? Number(mm[3]) : null;
  const square = openA && openB && openA === openB;
  const name = 'SS Welded Mesh ' + pad;
  const slug = 'ss-welded-' + pad;
  return {
    slug,
    name,
    hole_shape: square ? 'Square' : 'Rectangular',
    hole_mm: openA,
    pitch_mm: wire,
    angle_deg: openB && !square ? openB : null,
    open_area_pct: null,
    short_desc: line,
    description: name + '. ' + line + ' Stainless steel welded mesh from Garg Industrial Mesh, Sector 9 Noida. Available in SS 304 and SS 201.',
    applications: 'Guards, fencing, cages, railings, partitions',
    faq: JSON.stringify([
      { q: 'What is ' + name + '?', a: line },
      { q: 'Which grades?', a: 'SS 304 (premium) and SS 201 (economy). Confirm grade, clear vs pitch opening, wire mm/SWG, roll or panel on the RFQ.' },
      { q: 'Do you deliver in Delhi NCR?', a: 'Yes — from Sector 9, Noida across Noida, Greater Noida, Delhi, Ghaziabad, Faridabad and Gurugram.' }
    ]),
    meta_title: name + ' Noida | Garg',
    meta_description: 'Buy ' + name + ' in Noida — ' + line.split('—')[0].trim() + '. SS 304 & SS 201. Quote 9910238277.',
    meta_keywords: 'ss welded mesh, weldmesh, ' + name.toLowerCase() + ', ss 304 welded mesh noida',
    sort_order: n,
    featured: n <= 4 ? 1 : 0,
    materials: MATERIALS.map((m) => ({ ...m })),
    spec_kind: 'welded',
    open_b_mm: openB
  };
}

function buildCategory() {
  const designs = (content.itemList || []).map(parseSku);
  return {
    slug: 'ss-welded-mesh',
    name: 'SS Welded Mesh',
    short_desc: '29 SS weldmesh SKUs in SS 304 & SS 201 — rolls and panels from Sector 9 Noida.',
    description: content.meta_description || 'Stainless steel welded mesh in SS 304 and SS 201 from Garg Industrial Mesh, Noida.',
    guide_sections: JSON.stringify(guideFromContent(content)),
    meta_title: content.og_title || content.title,
    meta_description: content.meta_description,
    meta_keywords: content.meta_keywords,
    sort_order: 2,
    featured: 1,
    designs,
    cover_image: content.images && content.images[0] ? content.images.find((i) => /hero/i.test(i)) || content.images[0] : null,
    content_folder: content.folder,
    materials_catalog: MATERIALS
  };
}

module.exports = { buildCategory, MATERIALS };
