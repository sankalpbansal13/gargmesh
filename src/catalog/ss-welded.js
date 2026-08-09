const { loadContent, mat } = require('./helpers');

const content = loadContent('ss-welded');

const MATERIALS = [
  mat('ss-304', 'Stainless Steel 304', 'SS 304', 'Premium stainless weld mesh for coastal, food-adjacent and long-life outdoor duty.', {
    sort_order: 1,
    best_for: 'Guards, cages, fencing and railings where corrosion resistance matters.',
    detail: 'SS 304 is the premium stainless grade. Prefer 304 for coastal, washdown-adjacent and long outdoor life. Confirm opening, clear vs pitch, and wire mm/SWG on the RFQ.'
  }),
  mat('ss-201', 'Stainless Steel 201', 'SS 201 (SS 202 trade alias)', 'Economy stainless weld mesh for indoor and cost-sensitive stacks.', {
    sort_order: 2,
    best_for: 'Indoor / covered economy SS weldmesh where 304 is not required.',
    detail: 'SS 201 is our stocked economy stainless. “SS 202” in Indian trade often maps here — write the grade you need on the RFQ. Confirm aperture, wire and form (roll/panel).'
  }),
  mat('mild-steel', 'Mild Steel', 'MS', 'Mild steel welded mesh for economy industrial guards, cages and fencing.', {
    sort_order: 3,
    best_for: 'Economy guards, cages and site fencing where stainless is not required.',
    detail: 'MS welded mesh matches the same opening/wire matrix as stainless. Paint or coat for outdoor life. Confirm opening, wire and roll/panel on the RFQ.'
  }),
  mat('gi', 'GI (Galvanised)', 'GI / Galvanized Iron', 'Zinc-coated welded mesh for outdoor fencing and corrosion-prone sites.', {
    sort_order: 4,
    best_for: 'Outdoor fencing, compounds and damp sites needing zinc protection.',
    detail: 'GI welded mesh for outdoor duty. Published g/sqft is SS/MS reference — GI is typically ~5% heavier. Confirm opening, wire and form on the RFQ.'
  })
];

function parseWeight(line) {
  const m = String(line).match(/~([\d.]+)\s*g\/sqft/i);
  return m ? Number(m[1]) : null;
}

function parseRollKg(line) {
  const m = String(line).match(/~([\d.]+)\s*kg\/roll/i);
  return m ? Number(m[1]) : null;
}

function parseSku(line, index) {
  const n = index + 1;
  const pad = String(n).padStart(2, '0');
  const mm = line.match(/\((\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)(?:\s*[×x]\s*(\d+(?:\.\d+)?))?\s*mm\)/i);
  const openA = mm ? Number(mm[1]) : null;
  const openB = mm ? Number(mm[2]) : null;
  const wire = mm && mm[3] ? Number(mm[3]) : null;
  const square = openA && openB && openA === openB;
  const name = 'Welded Mesh ' + pad;
  const slug = 'ss-welded-' + pad;
  const weight_g_sqft = parseWeight(line);
  return {
    slug,
    name,
    hole_shape: square ? 'Square' : 'Rectangular',
    hole_mm: openA,
    pitch_mm: wire,
    angle_deg: openB && !square ? openB : null,
    open_area_pct: null,
    short_desc: line,
    weight_g_sqft,
    description: name + '. ' + line + ' Welded mesh from Garg Industrial Mesh, Sector 9 Noida — available in SS 304, SS 201, Mild Steel and GI.',
    applications: 'Guards, fencing, cages, railings, partitions',
    faq: JSON.stringify([
      { q: 'What is ' + name + '?', a: line },
      { q: 'Which materials / grades?', a: 'SS 304 (premium), SS 201 (economy), Mild Steel and GI. Confirm grade, clear vs pitch opening, wire mm/SWG, roll or panel on the RFQ.' },
      { q: 'What does the weight mean?', a: weight_g_sqft != null ? 'Published ≈' + weight_g_sqft + ' g/sqft is the SS/MS reference for a 4′×50′ roll. GI is typically about 5% heavier. Treat as planning weight.' : 'Weights are published as g/sqft and kg/roll for a 4′×50′ reference roll — confirm on RFQ.' },
      { q: 'Do you deliver in Delhi NCR?', a: 'Yes — from Sector 9, Noida across Noida, Greater Noida, Delhi, Ghaziabad, Faridabad and Gurugram.' }
    ]),
    meta_title: name + ' Noida | SS MS GI | Garg',
    meta_description: 'Buy ' + name + ' in Noida — ' + line.split('—')[0].trim() + '. SS 304, SS 201, MS & GI. Quote 9910238277.',
    meta_keywords: 'welded mesh, weldmesh, ' + name.toLowerCase() + ', ss welded mesh noida, ms welded mesh',
    sort_order: n,
    featured: n <= 4 ? 1 : 0,
    materials: MATERIALS.map((m) => ({ ...m })),
    spec_kind: 'welded',
    open_b_mm: openB
  };
}

function sizeWeightTable(itemList) {
  const header = ['Opening / SKU', 'Wire', '~g/sqft', '~kg/roll'];
  const rows = (itemList || []).map((line) => {
    const before = String(line).split('—')[0].trim();
    const mm = before.match(/\((\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)(?:\s*[×x]\s*(\d+(?:\.\d+)?))?\s*mm\)/i);
    const openLabel = mm
      ? (mm[3] ? mm[1] + ' × ' + mm[2] + ' mm' : mm[1] + ' × ' + mm[2] + ' mm')
      : before;
    const wire = mm && mm[3] ? mm[3] + ' mm' : (before.match(/×\s*(\d+g|[\d.]+\s*mm)/i) || [])[1] || 'See SKU';
    const g = parseWeight(line);
    const kg = parseRollKg(line);
    return [
      openLabel,
      wire,
      g != null ? String(g) : '—',
      kg != null ? String(kg) : '—'
    ];
  });
  return [header, ...rows];
}

function guideSections() {
  const items = content.itemList || [];
  return [
    {
      id: 'sizes',
      title: 'Size & weight',
      body: 'Stock welded-mesh SKUs with published planning weights for a 4 ft × 50 ft reference roll (≈200 sq ft). Approx. roll kg ≈ g/sqft × 0.2. GI is typically ~5% heavier than the SS/MS figure.',
      tables: [sizeWeightTable(items)]
    },
    {
      id: 'materials',
      title: 'Materials',
      body: 'Same opening/wire matrix across grades — choose material for corrosion life and budget.',
      tables: [[
        ['Material', 'Grades', 'Best for'],
        ['Stainless Steel 304', 'SS 304', 'Coastal, washdown, long outdoor life'],
        ['Stainless Steel 201', 'SS 201 (202 trade alias)', 'Indoor / economy stainless'],
        ['Mild Steel', 'MS', 'Economy industrial duty — coat for outdoors'],
        ['GI (Galvanised)', 'GI', 'Outdoor fencing and damp sites']
      ]]
    },
    {
      id: 'faq',
      title: 'Frequently asked questions',
      body: 'Short answers for welded mesh RFQs.',
      faqs: [
        {
          q: 'Which materials do you stock?',
          a: 'SS 304, SS 201, Mild Steel and GI on the same size matrix. Write the grade clearly on the RFQ (if your BOQ says SS 202, tell us — we map trade aliases).'
        },
        {
          q: 'Clear opening or pitch?',
          a: 'Say which you mean. Clear opening is the free space between wires; pitch is centre-to-centre. Wrong assumption changes the wire and the fit.'
        },
        {
          q: 'How do I use g/sqft?',
          a: 'Our roll reference is 4′×50′ = 200 sq ft, so approx. kg/roll ≈ g/sqft × 0.2. For panels: kg ≈ (g/sqft ÷ 1000) × (width_ft × length_ft). GI ≈ SS/MS × 1.05.'
        },
        {
          q: 'Rolls or panels?',
          a: 'Both. State form, opening, wire mm/SWG, grade and quantity on the RFQ.'
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
  const designs = (content.itemList || []).map(parseSku);
  return {
    slug: 'ss-welded-mesh',
    name: 'Welded Mesh',
    short_desc: '29 weldmesh SKUs in SS 304, SS 201, MS and GI — rolls and panels from Sector 9 Noida.',
    description: 'Welded mesh from Garg Industrial Mesh, Sector 9 Noida — stainless (SS 304 / SS 201), mild steel and GI on a published 29-SKU opening & wire matrix with g/sqft and roll weights.',
    guide_sections: JSON.stringify(guideSections()),
    meta_title: 'Welded Mesh Noida | SS MS GI | Garg Industrial Mesh',
    meta_description: 'Welded mesh supplier in Noida — SS 304, SS 201, MS & GI. 29 stock sizes with g/sqft weights. Quote 9910238277.',
    meta_keywords: 'welded mesh noida, ss welded mesh, ms welded mesh, gi weldmesh, weld mesh jali',
    sort_order: 4,
    featured: 1,
    group: 'sheet',
    designs,
    cover_image: content.images && content.images[0] ? content.images.find((i) => /hero/i.test(i)) || content.images[0] : null,
    content_folder: content.folder,
    materials_catalog: MATERIALS
  };
}

module.exports = { buildCategory, MATERIALS, parseWeight };
