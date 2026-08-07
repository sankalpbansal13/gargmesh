const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Shared geometry for Perforated 01–29 (from PERFORATED SHEET copper table). */
const PERFORATED_DESIGNS = [
  { n: 1, hole_shape: 'Round', hole_mm: 2, pitch_mm: 3.5, angle_deg: 60, open_area_pct: 29.6 },
  { n: 2, hole_shape: 'Round', hole_mm: 3, pitch_mm: 5, angle_deg: 60, open_area_pct: 32.7 },
  { n: 3, hole_shape: 'Round', hole_mm: 4, pitch_mm: 5.5, angle_deg: 60, open_area_pct: 48.0 },
  { n: 4, hole_shape: 'Round', hole_mm: 5, pitch_mm: 8, angle_deg: 60, open_area_pct: 35.4 },
  { n: 5, hole_shape: 'Round', hole_mm: 6, pitch_mm: 9, angle_deg: 60, open_area_pct: 40.3 },
  { n: 6, hole_shape: 'Round', hole_mm: 8, pitch_mm: 11, angle_deg: 60, open_area_pct: 48.0 },
  { n: 7, hole_shape: 'Round', hole_mm: 10, pitch_mm: 14, angle_deg: 60, open_area_pct: 46.3 },
  { n: 8, hole_shape: 'Round', hole_mm: 12, pitch_mm: 16, angle_deg: 60, open_area_pct: 51.0 },
  { n: 9, hole_shape: 'Round', hole_mm: 15, pitch_mm: 21, angle_deg: 60, open_area_pct: 46.3 },
  { n: 10, hole_shape: 'Round', hole_mm: 20, pitch_mm: 28, angle_deg: 60, open_area_pct: 46.3 },
  { n: 11, hole_shape: 'Round', hole_mm: 25, pitch_mm: 30, angle_deg: 60, open_area_pct: 63.0 },
  { n: 12, hole_shape: 'Round', hole_mm: 30, pitch_mm: 40, angle_deg: 60, open_area_pct: 51.0 },
  { n: 13, hole_shape: 'Round', hole_mm: 3, pitch_mm: 8, angle_deg: 90, open_area_pct: 11.0 },
  { n: 14, hole_shape: 'Round', hole_mm: 4, pitch_mm: 9.5, angle_deg: 90, open_area_pct: 13.9 },
  { n: 15, hole_shape: 'Round', hole_mm: 5, pitch_mm: 14, angle_deg: 90, open_area_pct: 10.0 },
  { n: 16, hole_shape: 'Round', hole_mm: 8, pitch_mm: 16, angle_deg: 90, open_area_pct: 19.6 },
  { n: 17, hole_shape: 'Round', hole_mm: 10, pitch_mm: 20, angle_deg: 90, open_area_pct: 19.6 },
  { n: 18, hole_shape: 'Round', hole_mm: 12, pitch_mm: 26, angle_deg: 90, open_area_pct: 16.7 },
  { n: 19, hole_shape: 'Square', hole_mm: 4, pitch_mm: 6, angle_deg: 90, open_area_pct: 44.4 },
  { n: 20, hole_shape: 'Square', hole_mm: 5, pitch_mm: 7, angle_deg: 90, open_area_pct: 51.0 },
  { n: 21, hole_shape: 'Square', hole_mm: 6, pitch_mm: 8, angle_deg: 90, open_area_pct: 56.3 },
  { n: 22, hole_shape: 'Square', hole_mm: 8, pitch_mm: 11, angle_deg: 90, open_area_pct: 52.9 },
  { n: 23, hole_shape: 'Square', hole_mm: 10, pitch_mm: 13, angle_deg: 90, open_area_pct: 59.2 },
  { n: 24, hole_shape: 'Square', hole_mm: 15, pitch_mm: 21, angle_deg: 90, open_area_pct: 51.0 },
  { n: 25, hole_shape: 'Hexagonal', hole_mm: 6, pitch_mm: 8, angle_deg: 60, open_area_pct: 56.3 },
  { n: 26, hole_shape: 'Hexagonal', hole_mm: 7, pitch_mm: 10, angle_deg: 60, open_area_pct: 49.0 },
  { n: 27, hole_shape: 'Hexagonal', hole_mm: 8, pitch_mm: 10, angle_deg: 60, open_area_pct: 64.0 },
  { n: 28, hole_shape: 'Hexagonal', hole_mm: 10, pitch_mm: 12.5, angle_deg: 60, open_area_pct: 64.0 },
  { n: 29, hole_shape: 'Hexagonal', hole_mm: 12, pitch_mm: 14, angle_deg: 60, open_area_pct: 73.5 }
];

const MATERIALS = [
  {
    slug: 'mild-steel',
    name: 'Mild Steel',
    grades: 'MS / CRCA',
    short_desc: 'Cost-effective punched mild steel for guards, filters and industrial panels.',
    price_from: 'Ask for quote',
    sort_order: 1,
    best_for: 'Guards, industrial panels, filters, site safety where cost and strength matter more than corrosion resistance.',
    standards: 'Commercial MS / CRCA sheet as agreed on RFQ. Pattern from our stock table or your drawing.',
    temper_note: 'As-rolled / commercial temper unless you specify otherwise. Paint or powder-coat after punch if outdoor duty.',
    detail: 'Mild steel is the everyday industrial perforated sheet — strong, weldable and economical. Expect surface rust outdoors unless painted, powder-coated or kept dry. Tell us thickness in mm, sheet size, blank edge and end use so we can confirm punchability (hole ≥ thickness).'
  },
  {
    slug: 'gi',
    name: 'GI (Galvanised)',
    grades: 'GI / Galvanized Iron',
    short_desc: 'Zinc-coated perforated sheet for outdoor and corrosion-prone sites.',
    price_from: 'Ask for quote',
    sort_order: 2,
    best_for: 'Outdoor guards, HVAC, fencing panels and sites where zinc coating buys corrosion life vs bare MS.',
    standards: 'Galvanised steel sheet (GI) — coating mass / grade as agreed on RFQ.',
    temper_note: 'Punching cuts through zinc at hole edges; cut edges may need touch-up paint if aesthetics or longevity matter.',
    detail: 'GI perforated sheet is zinc-coated mild steel for outdoor and damp sites. Same hole patterns as MS. Confirm whether you need pre-galvanised blank punched, or MS punched then galvanised (process changes lead time and edge coverage).'
  },
  {
    slug: 'stainless-steel',
    name: 'Stainless Steel',
    grades: 'SS 304, SS 316 (304L/316L on request)',
    short_desc: 'Corrosion-resistant SS perforated sheet for food, pharma and facade work.',
    price_from: 'Ask for quote',
    sort_order: 3,
    best_for: 'Food / pharma adjacent panels, washdown, coastal facades, long-life architectural screens.',
    standards: 'SS 304 / 316 sheet (L grades on request). Pattern from stock table or drawing — not assumed from the alloy alone.',
    temper_note: 'Soft / annealed blanks punch cleaner on dense patterns; harder tempers stay flatter on large spans. Name temper if critical.',
    detail: 'Stainless holds up where MS/GI rust. 304 is the usual commercial default; 316 for chloride / coastal / chemical duty. Deburr and finish matter for hygiene — say so on the RFQ. Hole ≥ thickness still applies for conventional punching.'
  },
  {
    slug: 'aluminium',
    name: 'Aluminium',
    grades: '1100 / 3003 / 5052',
    short_desc: 'Lightweight aluminium perforated sheet for cladding, grilles and speakers.',
    price_from: 'Ask for quote',
    sort_order: 4,
    best_for: 'Lightweight cladding, speaker grilles, HVAC, interiors — where weight and corrosion resistance beat steel.',
    standards: 'Common alloys 1100 / 3003 / 5052 (or as named on RFQ). Confirm temper (O / H14 / H32 etc.) if forming after punch.',
    temper_note: 'Soft temper for curves; harder temper for flat panels that must not oil-can. Spec both alloy and temper.',
    detail: 'Aluminium perforated sheet is light and corrosion-resistant outdoors with the right alloy. 5052 is a common structural/marine-leaning choice; 1100/3003 for softer decorative work. State alloy + temper + thickness in mm — not gauge alone.'
  },
  {
    slug: 'copper',
    name: 'Copper',
    grades: 'C11000 ETP (also C12200, C10200 on request)',
    short_desc: 'Conductive copper perforated sheet for EMI vents, cladding and filters.',
    price_from: 'Ask for quote',
    sort_order: 5,
    best_for: 'EMI/RFI vent panels, architectural cladding, filters, HVAC where conductivity or copper look matters.',
    standards: 'ASTM B152 / B152M for the blank copper sheet. Pattern geometry is separate — from our stock table or your CAD.',
    temper_note: 'Soft / O60 wraps and forms; half-hard / hard holds flatter panels. ASTM B601 temper codes preferred (O60, H01, H02, H04…).',
    detail: 'Do not order “just copper” — name the UNS grade. C11000 (ETP) is the usual high-conductivity commercial default (~100% IACS annealed). C12200 (DHP) when brazing/welding is heavy. C10200/C10100 when oxygen-free is required (write the number, not only “OFHC”). Mill certs cover the blank; hole geometry is our punch work.'
  },
  {
    slug: 'brass',
    name: 'Brass',
    grades: 'C26000 cartridge (also C27000, C28000, C23000)',
    short_desc: 'Decorative brass perforated sheet for screens, elevators and architectural work.',
    price_from: 'Ask for quote',
    sort_order: 6,
    best_for: 'Elevator cladding, decorative screens, architectural interiors, premium visual panels.',
    standards: 'ASTM B36 family alloys common for brass sheet (e.g. C26000). Confirm alloy + temper on RFQ.',
    temper_note: 'Soft for formed wraps; harder for flat framed screens. Lacquer / clear coat if you want to slow tarnish.',
    detail: 'Brass perforated sheet is chosen for colour and finish as much as strength. C26000 (cartridge) is a common decorative default; other alloys on request. Fingerprints and tarnish show — state finish expectations (mill, lacquered, polished).'
  }
];

/** Buying-guide content distilled from PERFORATED SHEET HTML microsites (customer + technical). */
const GUIDE_SECTIONS = [
  {
    id: 'how-to-order',
    title: 'How to order — RFQ checklist',
    body: 'Send a complete RFQ once. Missing grade, thickness, size, hole/pitch/orientation, blank edge, qty or end use stalls every quote.',
    bullets: [
      'Material + grade (e.g. MS, GI, SS 304/316, Al 5052, Cu C11000, Brass C26000)',
      'Temper if it matters (soft / half-hard / hard — or ASTM temper code)',
      'Thickness in millimetres (not gauge alone)',
      'Finished sheet size (width × length; note long-edge / feed if it matters)',
      'Pattern: stock code (e.g. Perforated 02) or hole + pitch + orientation',
      'Open area target on perforated field — or “confirm from pattern”',
      'Blank edge 0–100 mm custom (equal or per side); wider on request',
      'Finish, quantity, packing, and one-sentence end use',
      'Attach PDF/DWG for custom patterns, cutouts or unequal margins'
    ]
  },
  {
    id: 'thickness',
    title: 'Thickness guide',
    body: 'Hard shop rule for conventional punching: hole size (minimum opening) should be ≥ sheet thickness. Soft metals can sometimes go tighter; hard temper and dense patterns push you back to 1:1 or above. Below 1:1 is a process discussion — not a silent RFQ assumption.',
    bullets: [
      'Thinner stock (~0.3–1.0 mm): grilles, speaker faces, light screens, EMI vents',
      'Mid band (~0.8–2.0 mm): facade screens, HVAC, framed panels',
      'Heavier (~1.5–3.0 mm+): guards, load-bearing, abuse-prone sites',
      'Your span, load and temper decide the number — these bands are guidance only'
    ]
  },
  {
    id: 'blank-edge',
    title: 'Blank edge / unperforated border',
    body: 'The blank edge is the solid strip where you clamp, weld, hem, gasket or hide fasteners. Pattern stops inside this margin. Finished cut size should include the blank edge — say so if your drawing shows overall size vs perforated field only.',
    bullets: [
      '0–100 mm customised on our floor (equal all sides or unequal per drawing)',
      'Above 100 mm available on request — confirm sheet size and press setup',
      'Small margins can leave incomplete (breakout) holes at the trim — say if that is OK',
      'Unequal top/bottom/left/right needs a sketch'
    ]
  },
  {
    id: 'patterns',
    title: 'Hole, pitch, bridge & open area',
    body: 'Hole size is diameter (round), side (square) or across-flats for hex (say AF vs AP). Pitch is centre-to-centre. Bridge (bar) is metal left between holes ≈ pitch − hole. Open area (OA%) is % hole inside the perforated field only — blank edges excluded.',
    bullets: [
      'Round 60° staggered — denser pack, higher OA for same hole/pitch, common airflow default',
      'Round 90° / Square 90° — orthogonal rows, easier visual alignment with frames',
      'Hex 60° — honeycomb look, high open area options in our stock table',
      'OA% formulas (field only): Round 60° ≈ (D² × 90.69) / P²; Round 90° ≈ (D² × 78.54) / P²',
      'Custom drawings welcome when thickness and hole size allow tooling'
    ]
  },
  {
    id: 'temper',
    title: 'Temper (soft vs hard)',
    body: 'Grade is chemistry. Temper is how hard and springy the blank is. Soft wraps a radius; hard holds a flat panel better and springs back more. Spec both — or we have to guess.',
    bullets: [
      'Soft / annealed — forming, curved wraps, easier punch on dense patterns',
      'Half-hard — common sweet spot for flat framed screens',
      'Hard / spring — self-supporting lids and gasket seats; confirm hole vs thickness',
      'Copper buyers: ASTM B601 codes (O60, H01, H02, H04…) preferred over trade words alone',
      'Perforated mechanical properties ≠ blank mill cert — do not assume they match'
    ]
  },
  {
    id: 'applications',
    title: 'Where this pattern is used',
    body: 'Same press, different jobs. One sentence of end use steers grade, temper, thickness, blank edge, burr side and what “good enough” means.',
    bullets: [
      'Machine guards & site safety — strength, visibility, durable edges',
      'HVAC grilles & ventilation — OA% drives pressure drop; state field vs full-panel OA',
      'Facade / decorative screens — visual density + flatness + margin for frame',
      'Speaker grilles — finish and OA% for the cabinet',
      'Filtration / strainers — hole size leads; pitch and thickness support it',
      'EMI / RFI vent panels (copper) — grade + continuous blank land for gaskets matter as much as holes',
      'Elevator / architectural brass — colour, lacquer and fingerprint expectations'
    ]
  },
  {
    id: 'standards',
    title: 'Standards & what mill certs cover',
    body: 'Base-metal standards (e.g. ASTM B152 copper, ASTM B36 brass, commercial MS/GI/SS sheet) cover the unperforated blank — chemistry, temper and mechanical limits. Hole pattern is defined by our stock table or your drawing. Mill certificates typically cover the blank, not finished hole geometry.',
    bullets: [
      'Name the alloy / UNS / grade on the PO — not only the colour of the metal',
      'Confirm pattern code or hole–pitch–angle separately from the metal standard',
      'Shielding, acoustic NRC or hygiene claims need your system data — we supply the geometry you specify'
    ]
  },
  {
    id: 'glossary',
    title: 'Glossary',
    body: 'Shared language for purchasing, engineering and the press floor.',
    bullets: [
      'Hole (d / w) — opening size; for hex state across-flats (AF) or across-points (AP)',
      'Pitch (t / p) — centre-to-centre spacing',
      'Bridge / bar (c) — metal between holes; typically c = pitch − hole',
      'Open area (OA%) — % open in the perforated field (blank edges out)',
      'Perforated field — zone that contains holes, inside the margins',
      'Orientation 60° — staggered rows; 90° — straight / square pitch',
      'Blank edge / margin — unperforated border for clamp, weld, gasket',
      'Temper — soft vs hard mechanical condition of the blank'
    ]
  }
];

const { allExtraMaterials } = require('./catalog');

function materialBySlug(slug) {
  const fromPerf = MATERIALS.find((m) => m.slug === slug);
  if (fromPerf) return fromPerf;
  return allExtraMaterials()[slug] || null;
}

/** Computed technicals for a design row (DB or seed shape). */
function buildDesignTech(design, category) {
  const catSlug = (category && category.slug) || design.category_slug || '';
  const hole = Number(design.hole_mm);
  const pitch = Number(design.pitch_mm);
  const angle = Number(design.angle_deg);
  const oa = Number(design.open_area_pct);
  const shape = design.hole_shape || '';

  if (catSlug === 'ss-welded-mesh') {
    const openB = Number(design.angle_deg);
    const openingDd = hole
      ? (openB && openB !== hole ? `${hole} × ${openB} mm` : `${hole} × ${hole} mm`)
      : 'See SKU';
    return {
      kind: 'welded',
      family: shape || 'Welded',
      holeLabel: hole ? `${hole} mm` : 'See SKU',
      bridge_mm: pitch || null,
      orientation: 'Welded intersections — confirm clear opening vs pitch on RFQ.',
      maxThicknessTip: 'State roll (e.g. 4′×50′) or panel size, grade (304/201), and wire mm/SWG.',
      oa_note: design.short_desc || '',
      plain: design.description || design.short_desc || design.name,
      rows: [
        { dt: 'Opening', dd: openingDd },
        { dt: 'Wire', dd: pitch ? `${pitch} mm` : 'See SKU / SWG' },
        { dt: 'Form', dd: 'Rolls & panels' },
        { dt: 'Grades', dd: 'SS 304 / SS 201' },
        { dt: 'SKU', dd: design.short_desc || design.name }
      ]
    };
  }
  if (catSlug === 'expanded-mesh') {
    const swd = hole;
    const lwd = pitch;
    const strand = oa;
    const hasSpecs = swd && lwd && strand;
    return {
      kind: 'expanded',
      family: 'Expanded diamond',
      holeLabel: hasSpecs ? `SWD ${swd} mm` : design.name,
      bridge_mm: strand || null,
      orientation: 'SWD = short way of diamond; LWD = long way; strand = metal strand width.',
      maxThicknessTip: 'State thickness, sheet size, material (MS / aluminium / SS) and quantity on the RFQ.',
      oa_note: design.short_desc || '',
      plain: design.description || design.short_desc || design.name,
      rows: hasSpecs
        ? [
          { dt: 'SWD', dd: `${swd} mm` },
          { dt: 'LWD', dd: `${lwd} mm` },
          { dt: 'Strand width', dd: `${strand} mm` },
          { dt: 'Pattern', dd: 'Expanded diamond' }
        ]
        : [
          { dt: 'SWD / LWD / Strand', dd: 'Confirm on RFQ' },
          { dt: 'Pattern', dd: 'Expanded diamond' }
        ]
    };
  }
  if (catSlug === 'chain-link-mesh') {
    return {
      kind: 'chain-link',
      family: 'Diamond',
      holeLabel: hole ? `${hole} mm clear` : 'Box opening',
      bridge_mm: null,
      orientation: 'Box = clear inside opening of the diamond, not centre-to-centre.',
      maxThicknessTip: 'Heights 3–10 ft · wire 2.5 / 3 / 4 mm · 50 ft rolls — state all on RFQ.',
      oa_note: design.short_desc || '',
      plain: design.description || design.short_desc,
      rows: [
        { dt: 'Box (clear)', dd: hole ? `${hole} mm` : '—' },
        { dt: 'Heights', dd: '3–10 ft' },
        { dt: 'Wire', dd: '2.5 / 3 / 4 mm' },
        { dt: 'Roll', dd: '50 ft standard' }
      ]
    };
  }
  if (catSlug === 'door-machhar-jali') {
    const meshFromShort = (design.short_desc || '').match(/^(\d+×\d+)/);
    const meshLabel = meshFromShort ? meshFromShort[1] : design.name;
    return {
      kind: 'machhar',
      family: 'Woven mesh',
      holeLabel: meshLabel,
      bridge_mm: null,
      orientation: 'Woven mosquito / door mesh — confirm mesh count and roll width.',
      maxThicknessTip: 'Roll widths typically 2–6 ft including half-foot sizes.',
      oa_note: design.short_desc || '',
      plain: design.description || design.short_desc,
      rows: [
        { dt: 'Mesh count', dd: meshLabel },
        { dt: 'Widths', dd: '2–6 ft (incl. half-feet)' },
        { dt: 'Materials', dd: 'Aluminium / SS 304 / SS 202' }
      ]
    };
  }
  if (catSlug === 'pvc-plastic-jali' || catSlug === 'bird-monkey-spikes') {
    return {
      kind: 'simple',
      family: shape || design.name,
      holeLabel: design.name,
      bridge_mm: null,
      orientation: '',
      maxThicknessTip: 'Send end use, size and quantity on the RFQ for an accurate quote.',
      oa_note: design.short_desc || '',
      plain: design.description || design.short_desc,
      rows: [
        { dt: 'Product', dd: design.name },
        { dt: 'Notes', dd: design.short_desc || 'Ask for quote' }
      ]
    };
  }

  // Perforated default
  const bridge = Math.round((pitch - hole) * 100) / 100;
  const holeLabel = shape === 'Round' ? `Ø ${hole} mm` : shape === 'Square' ? `${hole} mm side` : `${hole} mm (across flats)`;
  const orientation =
    angle === 60
      ? '60° staggered — denser pack, typically higher open area than 90° at the same hole and pitch.'
      : '90° straight / square pitch — orthogonal rows, easier visual alignment with rectangular frames.';
  const maxThicknessTip = `For conventional punching, keep sheet thickness ≤ ~${hole} mm (hole ≥ thickness). Confirm denser patterns and hard temper with us.`;
  const family =
    shape === 'Round' && angle === 60 ? 'Round 60°'
      : shape === 'Round' && angle === 90 ? 'Round 90°'
        : shape === 'Square' ? 'Square 90°'
          : String(shape).indexOf('Hex') === 0 ? 'Hex 60°'
            : `${shape} ${angle}°`;
  return {
    kind: 'perforated',
    holeLabel,
    bridge_mm: bridge,
    orientation,
    family,
    maxThicknessTip,
    oa_note: `${oa}% open area on the perforated field (blank edges excluded).`,
    plain: `${design.name} is a ${family} stock pattern: ${holeLabel} holes on ${pitch} mm pitch, about ${oa}% open. Bridge between holes is roughly ${bridge} mm. Available in MS, GI, SS, aluminium, copper and brass — choose material above, then tell us thickness, sheet size and blank edge.`,
    rows: null
  };
}

function designSlug(n) {
  return 'perforated-' + String(n).padStart(2, '0');
}

function designName(n) {
  return 'Perforated ' + String(n).padStart(2, '0');
}

function faqsForDesign(design) {
  // Prefer FAQ JSON already on the design (extra categories)
  if (design.faq) {
    try {
      const parsed = typeof design.faq === 'string' ? JSON.parse(design.faq) : design.faq;
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch (e) { /* fall through */ }
  }
  const name = design.name || designName(design.n);
  const hole = Number(design.hole_mm);
  const pitch = Number(design.pitch_mm);
  const angle = Number(design.angle_deg);
  const oa = Number(design.open_area_pct);
  const shape = (design.hole_shape || 'Round').toLowerCase();
  const bridge = Math.round((pitch - hole) * 100) / 100;
  if (!hole || !pitch || Number.isNaN(oa)) {
    return [
      { q: `Tell me about ${name}`, a: design.short_desc || design.description || name },
      { q: 'Do you deliver in Delhi NCR?', a: 'Yes. Garg Industrial Mesh supplies from Sector 9, Noida across Noida, Greater Noida, Delhi, Ghaziabad, Faridabad and Gurugram.' }
    ];
  }
  return [
    {
      q: `What are the specs of ${name}?`,
      a: `${name} is a ${shape} pattern: ${hole} mm hole, ${pitch} mm pitch, ${angle}° orientation, about ${oa}% open area. Approximate bridge between holes is ${bridge} mm.`
    },
    {
      q: `Which materials are available for ${name}?`,
      a: `${name} is available in Mild Steel, GI, Stainless Steel (304/316), Aluminium, Copper and Brass. Name the grade, thickness (mm), sheet size and blank edge on your RFQ.`
    },
    {
      q: `How thick can the sheet be for ${name}?`,
      a: `Shop rule: hole size should be ≥ sheet thickness for conventional punching. For ${name}, that means about ${hole} mm max thickness as a starting guide — confirm denser patterns and hard temper with us.`
    },
    {
      q: `What blank edge can I order?`,
      a: 'Custom blank (unperforated) edges 0–100 mm are standard — equal all sides or unequal per drawing. Wider margins available on request.'
    },
    {
      q: 'Do you deliver perforated sheets in Delhi NCR?',
      a: 'Yes. Garg Industrial Mesh supplies from Sector 9, Noida across Noida, Greater Noida, Delhi, Ghaziabad, Faridabad and Gurugram.'
    }
  ];
}

function buildDesignFaq(d) {
  return JSON.stringify(faqsForDesign({ ...d, name: designName(d.n) }));
}

function buildCatalog() {
  const designs = PERFORATED_DESIGNS.map((d) => {
    const slug = designSlug(d.n);
    const name = designName(d.n);
    const holeLabel = d.hole_shape === 'Round' ? `Ø${d.hole_mm}` : `${d.hole_mm}`;
    const short = `${d.hole_shape} ${d.angle_deg}° · ${holeLabel} / pitch ${d.pitch_mm} · OA ${d.open_area_pct}%`;
    return {
      slug,
      name,
      hole_shape: d.hole_shape,
      hole_mm: d.hole_mm,
      pitch_mm: d.pitch_mm,
      angle_deg: d.angle_deg,
      open_area_pct: d.open_area_pct,
      short_desc: short,
      description: `${name} is a stock ${d.hole_shape.toLowerCase()} perforation pattern punched to ${d.hole_mm} mm hole size on ${d.pitch_mm} mm pitch at ${d.angle_deg}° (${d.open_area_pct}% open area). Available across MS, GI, SS, aluminium, copper and brass from our Noida factory.`,
      applications: 'Guards, HVAC, Facade, Speakers, Filtration, EMI vents, Decorative screens',
      faq: buildDesignFaq(d),
      meta_title: `${name} Perforated Sheet (${d.hole_shape} ${d.hole_mm}/${d.pitch_mm}) Noida | Garg`,
      meta_description: `Buy ${name} perforated sheet in Noida — ${d.hole_shape.toLowerCase()} ${d.hole_mm} mm, pitch ${d.pitch_mm} mm, ${d.angle_deg}°, OA ${d.open_area_pct}%. MS, GI, SS, Alu, copper, brass. Quote: 9910238277.`,
      meta_keywords: `perforated sheet, ${name.toLowerCase()}, ${d.hole_shape.toLowerCase()} perforated, perforated sheet noida`,
      sort_order: d.n,
      featured: d.n <= 6 ? 1 : 0,
      materials: MATERIALS.map((m) => ({ ...m }))
    };
  });

  const { extraCategories } = require('./catalog');
  const perforated = {
    slug: 'perforated-sheets',
    name: 'Perforated Sheets',
    short_desc: '29 stock hole patterns in MS, GI, SS, aluminium, copper and brass — custom blank edges and sheet sizes.',
    description: 'CNC-punched perforated metal sheets from Garg Industrial Mesh, Sector 9 Noida. Choose a stock pattern (Perforated 01–29), then select material. Custom hole, pitch, open area and blank margins on request.',
    guide_sections: JSON.stringify(GUIDE_SECTIONS),
    meta_title: 'Perforated Sheets Noida | MS GI SS Aluminium Copper Brass | Garg',
    meta_description: 'Perforated sheet manufacturer in Noida — 29 stock patterns, MS/GI/SS/aluminium/copper/brass. Custom hole, pitch, open area & blank edge. Call 9910238277.',
    meta_keywords: 'perforated sheet noida, perforated sheet delhi, ms perforated sheet, ss perforated sheet, copper perforated sheet, brass perforated sheet',
    sort_order: 1,
    featured: 1,
    designs
  };
  return {
    categories: [perforated, ...extraCategories()]
  };
}

/** Legacy export kept empty so old product seed paths no-op. */
const products = [];

function buildFaq() {
  return '[]';
}

module.exports = {
  products,
  slugify,
  buildFaq,
  MATERIALS,
  PERFORATED_DESIGNS,
  GUIDE_SECTIONS,
  designSlug,
  designName,
  buildCatalog,
  materialBySlug,
  buildDesignTech,
  faqsForDesign
};
