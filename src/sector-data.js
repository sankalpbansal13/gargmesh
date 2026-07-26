// Hyper-local locality pages across Delhi NCR.
// URL pattern stays /sectors/:slug (existing Noida sector URLs preserved).
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const sectors = [
  // ── Noida (existing) ──────────────────────────────────────────────
  {
    slug: 'sector-62-noida',
    locality: 'Sector 62',
    sector: 'Sector 62',
    city: 'Noida',
    citySlug: 'noida',
    title: 'Wire Mesh Supplier in Sector 62 Noida',
    meta_description: 'SS/GI welded mesh, perforated sheet & fencing supplier in Sector 62 Noida. Same-day dispatch from Garg Industrial Mesh, Sector 9. Call 9910238277.',
    intro: "Sector 62 is one of Noida's densest industrial and corporate belts — home to electronics manufacturing, IT offices and fabrication units. Garg Industrial Mesh supplies SS, GI and MS welded mesh, perforated sheets, wire mesh and chain link fencing to Sector 62 factories and contractors with same-day dispatch from our Noida base.",
    zones: "Block A–E industrial pockets, Electronics City belt, corporate towers along the Sector 62 main road, and the adjacent Sector 63 manufacturing hub.",
    delivery: "Same-day dispatch to Sector 62 for in-stock welded mesh and perforated sheet. Call before noon for same-day delivery confirmation.",
    products: ['SS Welded Mesh', 'MS Perforated Sheet', 'SS Wire Mesh', 'Chain Link Fence'],
    related: ['sector-63-noida', 'sector-68-noida', 'sector-18-noida'],
    faq: [
      { q: "Do you deliver welded mesh to Sector 62 the same day?", a: "Yes. Sector 62 is a core same-day delivery zone for us. In-stock SS and GI welded mesh ship the same day — call 9910238277 before noon to confirm." },
      { q: "Can I get perforated sheets cut to size for a Sector 62 fabrication job?", a: "Yes. We cut MS and SS perforated sheets to your exact dimensions for Sector 62 fabrication and machine-guard requirements." },
      { q: "Do you supply bulk SS 304 mesh to Sector 62 factories?", a: "Yes. We supply SS 304 and SS 201 welded mesh in bulk at wholesale rates to Sector 62 manufacturing units." }
    ]
  },
  {
    slug: 'sector-63-noida',
    locality: 'Sector 63',
    sector: 'Sector 63',
    city: 'Noida',
    citySlug: 'noida',
    title: 'Wire Mesh Supplier in Sector 63 Noida',
    meta_description: 'Welded mesh, perforated panels & wire mesh supplier in Sector 63 Noida. Genuine SS 304/201, GI & MS grades. Same-day local delivery. Call 9910238277.',
    intro: "Sector 63 is a major Noida manufacturing and electronics hub. Garg Industrial Mesh supplies welded wire mesh, perforated panels, wire mesh and safety spikes to Sector 63 factories and OEMs, with genuine-grade SS 304/201, GI and MS material and fast local delivery.",
    zones: "Sector 63 industrial plots, electronics and cable manufacturing units, and the adjacent Sector 62–63 corridor near the Metro line.",
    delivery: "Same-day dispatch across Sector 63 industrial plots for in-stock items; next-day for cut-to-size bulk orders.",
    products: ['SS Welded Mesh', 'GI Welded Mesh', 'MS Perforated Sheet', 'Bird Spikes'],
    related: ['sector-62-noida', 'sector-68-noida', 'sector-2-noida'],
    faq: [
      { q: "Do you supply SS 304 welded mesh in bulk to Sector 63 factories?", a: "Yes. We supply SS 304 and SS 201 welded mesh in bulk to Sector 63 manufacturing units at wholesale rates. Share your grade, opening size and quantity for a quote." },
      { q: "Can you deliver chain link fence for a Sector 63 plot boundary?", a: "Yes. We supply GI and PVC chain link fencing in 3.5ft–5ft heights for plot boundary security across Sector 63, with same-day dispatch on in-stock items." }
    ]
  },
  {
    slug: 'sector-68-noida',
    locality: 'Sector 68',
    sector: 'Sector 68',
    city: 'Noida',
    citySlug: 'noida',
    title: 'Wire Mesh Supplier in Sector 68 Noida',
    meta_description: 'Bird mesh, monkey spikes & door mesh supplier in Sector 68 Noida. Fast delivery for apartments & offices along the Expressway. Call 9910238277.',
    intro: "Sector 68 is a fast-growing residential and commercial hub along the Noida-Greater Noida Expressway. Garg Industrial Mesh supplies bird mesh, bird spikes, monkey spikes, aluminium door mesh and PVC fencing to Sector 68 apartments, offices and builders — with quick local delivery.",
    zones: "Sector 68 residential high-rises, commercial complexes along the Expressway, and the adjacent Sector 66–71 belt.",
    delivery: "Same-day dispatch to Sector 68 high-rises and commercial complexes for in-stock bird mesh and spikes.",
    products: ['Bird Mesh', 'Bird Spikes', 'Monkey Spikes', 'Aluminium Door Mesh', 'PVC Mesh'],
    related: ['sector-62-noida', 'sector-18-noida', 'greater-noida-west'],
    faq: [
      { q: "Do you install bird mesh on Sector 68 balconies?", a: "We supply the bird mesh and can recommend an installer for Sector 68 balconies. Our UV-stabilised nylon mesh is discreet and long-lasting." },
      { q: "Can I get monkey spikes for a Sector 68 rooftop?", a: "Yes. Our galvanised and SS monkey spikes are ideal for Sector 68 rooftops, ledges and boundary walls — humane and weatherproof." }
    ]
  },
  {
    slug: 'sector-18-noida',
    locality: 'Sector 18',
    sector: 'Sector 18',
    city: 'Noida',
    citySlug: 'noida',
    title: 'Wire Mesh Supplier in Sector 18 Noida',
    meta_description: 'Security mesh, perforated panels & bird spikes for Sector 18 Noida shops & offices. Same-day dispatch near Atta Market. Call 9910238277.',
    intro: "Sector 18 is Noida's premier commercial and retail hub — home to Atta Market, malls and busy shopfronts. Garg Industrial Mesh supplies security mesh, perforated panels, bird spikes and aluminium door mesh to Sector 18 businesses, showrooms and offices for security and pest control.",
    zones: "Atta Market, DLF Mall belt, Sector 18 commercial towers, and the adjoining Sector 16–19 market corridor.",
    delivery: "Same-day dispatch to Sector 18 Atta Market and commercial towers for in-stock security mesh and bird spikes.",
    products: ['SS Welded Mesh', 'SS Perforated Sheet', 'Bird Spikes', 'Aluminium Door Mesh'],
    related: ['sector-12-noida', 'sector-2-noida', 'sector-68-noida'],
    faq: [
      { q: "Do you supply security mesh for Sector 18 shopfronts?", a: "Yes. Our SS welded mesh is used for shopfront security grilles and counter screens across Sector 18 — strong, see-through and corrosion-resistant." },
      { q: "Can you deliver bird spikes to Sector 18 showrooms?", a: "Yes. We supply SS and plastic bird spikes for Sector 18 showroom ledges and signage, with same-day dispatch on in-stock items." }
    ]
  },
  {
    slug: 'sector-12-noida',
    locality: 'Sector 12',
    sector: 'Sector 12',
    city: 'Noida',
    citySlug: 'noida',
    title: 'Wire Mesh Supplier in Sector 12 Noida',
    meta_description: 'Bird mesh, aluminium door mesh & spikes for Sector 12 Noida homes & hospitals. UV-stable mesh, fast local delivery. Call 9910238277.',
    intro: "Sector 12 is a well-established Noida residential and institutional area, home to hospitals and housing societies. Garg Industrial Mesh supplies bird mesh, aluminium door mesh, bird spikes and PVC fencing to Sector 12 homes, hospitals and offices for ventilation and pest control.",
    zones: "Sector 12 residential blocks, hospital belt, and the adjacent Sector 10–12 corridor.",
    delivery: "Same-day dispatch to Sector 12 residential blocks and hospitals for in-stock door mesh and bird mesh.",
    products: ['Bird Mesh', 'Aluminium Door Mesh', 'Bird Spikes', 'PVC Mesh'],
    related: ['sector-18-noida', 'sector-2-noida', 'sector-68-noida'],
    faq: [
      { q: "Do you supply aluminium door mesh for Sector 12 hospitals?", a: "Yes. Our lightweight aluminium mesh keeps insects out while allowing airflow — ideal for Sector 12 hospitals and kitchens. Cut to door and window size." },
      { q: "Can I get bird mesh for a Sector 12 balcony?", a: "Yes. Our fine nylon bird mesh is installed on Sector 12 balconies and windows to keep pigeons out without blocking the view." }
    ]
  },
  {
    slug: 'sector-2-noida',
    locality: 'Sector 2',
    sector: 'Sector 2',
    city: 'Noida',
    citySlug: 'noida',
    title: 'Wire Mesh Supplier in Sector 2 Noida',
    meta_description: 'MS welded mesh, perforated sheet & construction net for Sector 2 Noida workshops. Same-day dispatch from Sector 9. Call 9910238277.',
    intro: "Sector 2 is part of Noida's original industrial belt, with small-scale manufacturing and fabrication units. Garg Industrial Mesh supplies welded mesh, perforated sheets, wire mesh and construction net to Sector 2 fabricators and contractors with genuine-grade material and same-day dispatch.",
    zones: "Sector 2 industrial plots, fabrication workshops, and the adjoining Sector 1–3 industrial corridor near the Metro.",
    delivery: "Same-day dispatch to Sector 2 workshops for in-stock MS welded mesh and perforated sheet.",
    products: ['MS Welded Mesh', 'MS Perforated Sheet', 'SS Wire Mesh', 'Construction Net'],
    related: ['sector-12-noida', 'sector-18-noida', 'sector-62-noida'],
    faq: [
      { q: "Do you deliver MS welded mesh to Sector 2 workshops?", a: "Yes. We supply MS welded mesh for slabs, screens and fabrication to Sector 2 workshops with same-day dispatch on in-stock sizes." },
      { q: "Can I get construction safety net for a Sector 2 site?", a: "Yes. Our UV-stabilised HDPE construction net is supplied to Sector 2 building sites for debris and fall protection." }
    ]
  },

  // ── Greater Noida ─────────────────────────────────────────────────
  {
    slug: 'knowledge-park-greater-noida',
    locality: 'Knowledge Park',
    sector: 'Knowledge Park',
    city: 'Greater Noida',
    citySlug: 'greater-noida',
    title: 'Wire Mesh Supplier in Knowledge Park Greater Noida',
    meta_description: 'Bird mesh, construction net & fencing for Knowledge Park Greater Noida campuses & hostels. Fast dispatch from Noida. Call 9910238277.',
    intro: "Knowledge Park is Greater Noida's education and institutional hub, with colleges, hostels and research campuses. Garg Industrial Mesh supplies bird mesh, construction safety net, chain link fencing and aluminium door mesh for campus buildings, hostels and ongoing construction — with genuine grades and quick dispatch from our Sector 9 Noida base.",
    zones: "Knowledge Park 1–5 campuses, hostel blocks, institutional plots near Pari Chowk, and adjoining Alpha–Beta residential pockets used by students and faculty.",
    delivery: "Same-day to next-day dispatch to Knowledge Park campuses for in-stock bird mesh, fencing and construction net.",
    products: ['Bird Mesh', 'Construction Net', 'Chain Link Fence', 'Aluminium Door Mesh'],
    related: ['pari-chowk-greater-noida', 'alpha-greater-noida', 'beta-greater-noida'],
    faq: [
      { q: "Do you supply construction net for Knowledge Park building sites?", a: "Yes. Our UV-stabilised HDPE construction net is regularly supplied to Knowledge Park high-rise and campus projects for debris and fall protection." },
      { q: "Can colleges get bird mesh for hostel balconies in Knowledge Park?", a: "Yes. We supply UV-stabilised nylon and PVC bird mesh cut to balcony size for Knowledge Park hostels and faculty housing." },
      { q: "Is chain link fencing available for Knowledge Park plot boundaries?", a: "Yes. GI and PVC-coated chain link in 3.5ft–5ft heights ship quickly for Knowledge Park institutional plot fencing." }
    ]
  },
  {
    slug: 'alpha-greater-noida',
    locality: 'Alpha',
    sector: 'Alpha',
    city: 'Greater Noida',
    citySlug: 'greater-noida',
    title: 'Wire Mesh Supplier in Alpha Greater Noida',
    meta_description: 'Bird mesh, monkey spikes & door mesh for Alpha Greater Noida societies. Same-day dispatch from Noida Sector 9. Call 9910238277.',
    intro: "Alpha is one of Greater Noida's earliest and busiest residential sectors, with established societies, markets and mid-rise apartments. Garg Industrial Mesh supplies bird mesh, monkey spikes, aluminium door mesh and PVC fencing to Alpha homes and builders who need pest control and balcony protection without blocking light or airflow.",
    zones: "Alpha 1 and Alpha 2 residential pockets, society complexes near the Alpha commercial stretch, and adjoining Beta–Gamma belts.",
    delivery: "Same-day dispatch to Alpha societies for in-stock bird mesh and monkey spikes; next-day for cut-to-size door mesh.",
    products: ['Bird Mesh', 'Monkey Spikes', 'Aluminium Door Mesh', 'PVC Mesh'],
    related: ['beta-greater-noida', 'gamma-greater-noida', 'pari-chowk-greater-noida'],
    faq: [
      { q: "Do you deliver bird mesh to Alpha Greater Noida apartments?", a: "Yes. Alpha is a regular residential delivery zone. In-stock bird mesh ships same day — WhatsApp 9910238277 with balcony measurements." },
      { q: "Are monkey spikes suitable for Alpha society boundary walls?", a: "Yes. Our galvanised and SS monkey spikes are designed for ledges, parapets and boundary walls common in Alpha societies." }
    ]
  },
  {
    slug: 'beta-greater-noida',
    locality: 'Beta',
    sector: 'Beta',
    city: 'Greater Noida',
    citySlug: 'greater-noida',
    title: 'Wire Mesh Supplier in Beta Greater Noida',
    meta_description: 'Bird spikes, PVC mesh & balcony bird mesh for Beta Greater Noida flats. Fast local delivery from Noida. Call 9910238277.',
    intro: "Beta sector sits at the heart of Greater Noida's residential grid, with dense housing societies and active builders. Garg Industrial Mesh supplies bird mesh, bird spikes, PVC mesh and aluminium door mesh to Beta apartments and contractors — ideal for pigeon control on balconies, AC ledges and window frames.",
    zones: "Beta residential blocks, society complexes near the main Beta market road, and the Alpha–Beta–Gamma residential corridor.",
    delivery: "Same-day dispatch across Beta for in-stock bird mesh and spikes; cut-to-size orders typically next day.",
    products: ['Bird Mesh', 'Bird Spikes', 'PVC Mesh', 'Aluminium Door Mesh'],
    related: ['alpha-greater-noida', 'gamma-greater-noida', 'delta-greater-noida'],
    faq: [
      { q: "Can I buy bird spikes for Beta Greater Noida AC ledges?", a: "Yes. We stock stainless steel and plastic bird spikes sized for AC outdoor units and window ledges common in Beta flats." },
      { q: "Do you cut aluminium door mesh to Beta flat door sizes?", a: "Yes. Share your door or window opening and we cut aluminium mesh to size before dispatch to Beta." }
    ]
  },
  {
    slug: 'gamma-greater-noida',
    locality: 'Gamma',
    sector: 'Gamma',
    city: 'Greater Noida',
    citySlug: 'greater-noida',
    title: 'Wire Mesh Supplier in Gamma Greater Noida',
    meta_description: 'Bird mesh, chain link fence & construction net for Gamma Greater Noida. Residential & plot delivery from Noida. Call 9910238277.',
    intro: "Gamma is a mixed residential and plotted development sector in Greater Noida. Garg Industrial Mesh supplies bird mesh and monkey spikes for high-rises, plus chain link fencing and construction net for plots and ongoing builds — serving homeowners, RWA contractors and site engineers across Gamma.",
    zones: "Gamma 1–2 residential towers, plotted housing pockets, and sites near the Gamma–Delta connector roads.",
    delivery: "Same-day to next-day dispatch to Gamma towers and plot sites for in-stock mesh, fencing and safety net.",
    products: ['Bird Mesh', 'Monkey Spikes', 'Chain Link Fence', 'Construction Net'],
    related: ['beta-greater-noida', 'delta-greater-noida', 'chi-phi-greater-noida'],
    faq: [
      { q: "Do you supply chain link fence for Gamma plot boundaries?", a: "Yes. GI and PVC-coated chain link in standard heights is available for Gamma plots, with per-running-foot pricing on WhatsApp." },
      { q: "Is construction net available for Gamma high-rise sites?", a: "Yes. UV-stabilised HDPE construction net is supplied to Gamma building sites for debris containment and edge protection." }
    ]
  },
  {
    slug: 'delta-greater-noida',
    locality: 'Delta',
    sector: 'Delta',
    city: 'Greater Noida',
    citySlug: 'greater-noida',
    title: 'Wire Mesh Supplier in Delta Greater Noida',
    meta_description: 'Welded mesh, fencing & bird mesh for Delta Greater Noida homes & plots. Genuine SS/GI/MS grades. Call 9910238277.',
    intro: "Delta sector combines residential societies with open plots along Greater Noida's southern grid. Garg Industrial Mesh supplies welded mesh and chain link for plot fencing, plus bird mesh and door mesh for occupied flats — a practical mix for builders finishing sites and homeowners securing balconies.",
    zones: "Delta residential societies, open plots near the Delta–Eta stretch, and connecting roads toward Ecotech industrial estates.",
    delivery: "Next-day standard for Delta; same-day possible for in-stock bird mesh and fencing when ordered before noon.",
    products: ['GI Welded Mesh', 'Chain Link Fence', 'Bird Mesh', 'Aluminium Door Mesh'],
    related: ['gamma-greater-noida', 'ecotech-greater-noida', 'chi-phi-greater-noida'],
    faq: [
      { q: "Can Delta plot owners get GI welded mesh for fencing?", a: "Yes. We supply GI welded mesh in multiple opening sizes for Delta plot and farm-style boundary fencing." },
      { q: "Do you deliver bird mesh to Delta apartment societies?", a: "Yes. In-stock bird mesh ships to Delta societies same day or next morning depending on order time." }
    ]
  },
  {
    slug: 'chi-phi-greater-noida',
    locality: 'Chi Phi',
    sector: 'Chi Phi',
    city: 'Greater Noida',
    citySlug: 'greater-noida',
    title: 'Wire Mesh Supplier in Chi Phi Greater Noida',
    meta_description: 'Bird mesh, monkey spikes & fencing for Chi & Phi Greater Noida societies. Fast dispatch from Noida. Call 9910238277.',
    intro: "Chi and Phi sectors form a growing residential cluster in Greater Noida with mid-rise societies and new launches. Garg Industrial Mesh supplies bird mesh, monkey spikes, PVC mesh and chain link fencing to Chi Phi homeowners and project contractors who need balcony protection and site perimeter security.",
    zones: "Chi and Phi residential pockets, society complexes near the Chi–Phi internal roads, and adjoining Omega–Sigma residential belts.",
    delivery: "Same-day to next-day dispatch to Chi Phi societies for in-stock bird mesh, spikes and fencing.",
    products: ['Bird Mesh', 'Monkey Spikes', 'PVC Mesh', 'Chain Link Fence'],
    related: ['gamma-greater-noida', 'delta-greater-noida', 'pari-chowk-greater-noida'],
    faq: [
      { q: "Do you cover both Chi and Phi sectors for delivery?", a: "Yes. We treat Chi and Phi as one delivery cluster — in-stock bird mesh and spikes ship same day or next day." },
      { q: "Are monkey spikes popular in Chi Phi high-rises?", a: "Yes. Many Chi Phi societies use our galvanised monkey spikes on parapets and water-tank ledges where monkeys are active." }
    ]
  },
  {
    slug: 'ecotech-greater-noida',
    locality: 'Ecotech Industrial Area',
    sector: 'Ecotech Industrial Area',
    city: 'Greater Noida',
    citySlug: 'greater-noida',
    title: 'Wire Mesh Supplier in Ecotech Greater Noida',
    meta_description: 'SS/GI welded mesh & perforated sheet for Ecotech 1–3 Greater Noida factories. Bulk wholesale rates. Call 9910238277.',
    intro: "Ecotech 1, 2 and 3 are Greater Noida's primary industrial estates — home to factories, warehouses and fabrication units. Garg Industrial Mesh supplies SS, GI and MS welded mesh, perforated sheets and chain link fencing in bulk to Ecotech plants and contractors at direct manufacturer rates, with fast dispatch from Noida Sector 9.",
    zones: "Ecotech 1, Ecotech 2, Ecotech 3 industrial plots, Surajpur–Kasna manufacturing belt, and factory units near the Taj Expressway approach.",
    delivery: "Same-day dispatch to Ecotech 1–3 for in-stock industrial mesh; 1–2 days for cut-to-size and large project lots.",
    products: ['SS Welded Mesh', 'GI Welded Mesh', 'MS Perforated Sheet', 'Chain Link Fence'],
    related: ['pari-chowk-greater-noida', 'delta-greater-noida', 'knowledge-park-greater-noida'],
    faq: [
      { q: "Do you supply bulk welded mesh to Ecotech 3 factories?", a: "Yes. Ecotech 1–3 are core industrial delivery zones. Share grade, opening size and quantity on WhatsApp 9910238277 for a wholesale quote." },
      { q: "Can Ecotech units get MS perforated sheet cut to size?", a: "Yes. We cut MS and SS perforated sheets to your machine-guard or filter panel sizes before dispatch to Ecotech." },
      { q: "Is chain link fencing available for Ecotech plot security?", a: "Yes. GI and PVC chain link in 3.5ft–5ft heights is stocked for Ecotech factory and warehouse boundaries." }
    ]
  },
  {
    slug: 'greater-noida-west',
    locality: 'Greater Noida West',
    sector: 'Greater Noida West',
    city: 'Greater Noida',
    citySlug: 'greater-noida',
    title: 'Wire Mesh Supplier in Greater Noida West',
    meta_description: 'Bird mesh, monkey spikes & construction net for Greater Noida West (Noida Extension). High-rise delivery. Call 9910238277.',
    intro: "Greater Noida West (Noida Extension) is one of NCR's densest high-rise corridors — Tech Zone, Sector 1–16 and Gaur City–style societies drive strong demand for balcony bird mesh, monkey spikes and construction safety net. Garg Industrial Mesh delivers these plus PVC and aluminium door mesh across Greater Noida West from our nearby Noida base.",
    zones: "Greater Noida West sectors 1, 2, 3, 4, 10, 16, Tech Zone, Gaur City belt, and Expressway-facing towers toward Noida.",
    delivery: "Same-day dispatch to Greater Noida West for in-stock bird mesh and spikes; construction net for active sites ships same day or next day.",
    products: ['Bird Mesh', 'Monkey Spikes', 'Construction Net', 'Aluminium Door Mesh', 'Bird Spikes'],
    related: ['pari-chowk-greater-noida', 'sector-68-noida', 'alpha-greater-noida'],
    faq: [
      { q: "Do you deliver to Greater Noida West / Noida Extension high-rises?", a: "Yes. Greater Noida West is a priority residential delivery zone. In-stock bird mesh and monkey spikes often ship the same day." },
      { q: "Can builders get construction net for Tech Zone towers?", a: "Yes. We supply UV-stabilised HDPE construction net to Tech Zone and Greater Noida West high-rise sites for debris and fall protection." },
      { q: "Is bird mesh available for Gaur City–area balconies?", a: "Yes. Fine nylon and PVC bird mesh is cut to balcony openings for societies across the Greater Noida West belt." }
    ]
  },
  {
    slug: 'pari-chowk-greater-noida',
    locality: 'Pari Chowk',
    sector: 'Pari Chowk',
    city: 'Greater Noida',
    citySlug: 'greater-noida',
    title: 'Wire Mesh Supplier near Pari Chowk Greater Noida',
    meta_description: 'Wire mesh, fencing & bird mesh near Pari Chowk Greater Noida. Covers Alpha, Knowledge Park & Metro belt. Call 9910238277.',
    intro: "Pari Chowk is Greater Noida's central junction — Metro, commercial complexes and the gateway to Knowledge Park and Alpha–Beta sectors. Garg Industrial Mesh supplies welded mesh, chain link fencing, bird mesh and construction net to shops, offices and nearby residential projects around Pari Chowk with reliable local delivery.",
    zones: "Pari Chowk Metro and commercial belt, approaches to Knowledge Park, Alpha market stretch, and connecting roads toward Ecotech and Gamma.",
    delivery: "Same-day dispatch around Pari Chowk for in-stock fencing, bird mesh and welded mesh ordered before noon.",
    products: ['Chain Link Fence', 'Bird Mesh', 'GI Welded Mesh', 'Construction Net'],
    related: ['knowledge-park-greater-noida', 'alpha-greater-noida', 'ecotech-greater-noida'],
    faq: [
      { q: "Do you deliver near Pari Chowk Metro the same day?", a: "Yes. Pari Chowk and adjoining commercial/residential pockets are same-day zones for in-stock mesh and fencing." },
      { q: "Can shops near Pari Chowk get security welded mesh?", a: "Yes. SS and GI welded mesh is commonly used for shopfront grilles and counter screens around the Pari Chowk commercial belt." }
    ]
  },

  // ── Delhi ─────────────────────────────────────────────────────────
  {
    slug: 'okhla-industrial-area-delhi',
    locality: 'Okhla Industrial Area',
    sector: 'Okhla Industrial Area',
    city: 'Delhi',
    citySlug: 'delhi',
    title: 'Wire Mesh Supplier in Okhla Industrial Area Delhi',
    meta_description: 'SS/MS welded mesh & perforated sheet for Okhla Phase 1–2 factories. Same-day Delhi dispatch. Garg Industrial Mesh — 9910238277.',
    intro: "Okhla Industrial Area (Phase 1 & 2) is one of South Delhi's busiest manufacturing and fabrication clusters. Garg Industrial Mesh supplies SS, GI and MS welded mesh, perforated sheets and wire mesh to Okhla factories, workshops and contractors — genuine grades at wholesale rates with same-day dispatch from Noida when ordered before noon.",
    zones: "Okhla Phase 1 and Phase 2 industrial estates, fabrication workshops along the Okhla main roads, and adjoining Modi Mill / Kalkaji industrial pockets.",
    delivery: "Same-day dispatch to Okhla Phase 1 & 2 for in-stock industrial mesh; next-day for cut-to-size bulk lots.",
    products: ['SS Welded Mesh', 'MS Welded Mesh', 'MS Perforated Sheet', 'SS Wire Mesh'],
    related: ['mayapuri-delhi', 'naraina-delhi', 'lajpat-nagar-south-delhi'],
    faq: [
      { q: "Do you deliver welded mesh to Okhla Phase 1 & 2 the same day?", a: "Yes. Okhla is a core Delhi industrial delivery zone. Call 9910238277 before noon to confirm same-day stock and timing." },
      { q: "Can Okhla fabricators get perforated sheet cut to size?", a: "Yes. We cut MS and SS perforated sheets to your panel sizes for machine guards, filters and screens used in Okhla workshops." },
      { q: "Do you supply SS 304 wire mesh for Okhla filtration jobs?", a: "Yes. SS 304 and SS 202 woven wire mesh is stocked in fine-to-coarse openings for Okhla filtration and sieving applications." }
    ]
  },
  {
    slug: 'mayapuri-delhi',
    locality: 'Mayapuri',
    sector: 'Mayapuri',
    city: 'Delhi',
    citySlug: 'delhi',
    title: 'Wire Mesh Supplier in Mayapuri Delhi',
    meta_description: 'Welded mesh & perforated sheet for Mayapuri Delhi metal market & workshops. Bulk wholesale from Noida. Call 9910238277.',
    intro: "Mayapuri is West Delhi's well-known metal and auto-parts industrial belt, packed with fabricators and traders. Garg Industrial Mesh supplies MS and SS welded mesh, perforated sheets and GI fencing materials to Mayapuri workshops and dealers who need reliable grades and fast replenishment from our Noida warehouse.",
    zones: "Mayapuri Phase 1 & 2 industrial areas, metal market lanes, and workshops toward Kirti Nagar and Naraina.",
    delivery: "Same-day dispatch to Mayapuri for in-stock MS/SS mesh; next-day for large cut-to-size orders.",
    products: ['MS Welded Mesh', 'MS Perforated Sheet', 'SS Welded Mesh', 'GI Perforated Sheet'],
    related: ['naraina-delhi', 'okhla-industrial-area-delhi', 'wazirpur-delhi'],
    faq: [
      { q: "Do you supply MS perforated sheet to Mayapuri fabricators?", a: "Yes. 3x8 and 4x8 ft MS perforated sheets with round, square or slot holes are regularly delivered to Mayapuri workshops." },
      { q: "Can Mayapuri dealers buy welded mesh wholesale?", a: "Yes. We offer wholesale rates on SS, GI and MS welded mesh for Mayapuri traders and fabricators — share quantity for pricing." }
    ]
  },
  {
    slug: 'wazirpur-delhi',
    locality: 'Wazirpur',
    sector: 'Wazirpur',
    city: 'Delhi',
    citySlug: 'delhi',
    title: 'Wire Mesh Supplier in Wazirpur Delhi',
    meta_description: 'SS welded mesh & stainless wire mesh for Wazirpur Delhi SS market. Genuine 201/304 grades. Call 9910238277.',
    intro: "Wazirpur Industrial Area is North-West Delhi's stainless steel trading and fabrication hub. Garg Industrial Mesh supplies SS 201/304 welded mesh, SS wire mesh and SS perforated sheet to Wazirpur units and traders who need authentic stainless grades — not mixed or mislabelled stock — with prompt delivery from Noida.",
    zones: "Wazirpur Industrial Area stainless markets, fabrication units, and adjoining Ashok Vihar / Tri Nagar industrial lanes.",
    delivery: "Same-day to next-day dispatch to Wazirpur for in-stock SS mesh; custom weave openings typically 1–2 days.",
    products: ['SS Welded Mesh', 'SS Wire Mesh', 'SS Perforated Sheet', 'GI Welded Mesh'],
    related: ['mayapuri-delhi', 'bawana-delhi', 'naraina-delhi'],
    faq: [
      { q: "Do you supply genuine SS 304 welded mesh to Wazirpur?", a: "Yes. We supply verifiable SS 304 and SS 201 welded mesh to Wazirpur fabricators and traders at wholesale rates." },
      { q: "Is fine SS wire mesh available for Wazirpur filtration work?", a: "Yes. SS 304 woven wire mesh from fine to coarse mesh counts is stocked for Wazirpur filtration and sieving jobs." }
    ]
  },
  {
    slug: 'naraina-delhi',
    locality: 'Naraina',
    sector: 'Naraina',
    city: 'Delhi',
    citySlug: 'delhi',
    title: 'Wire Mesh Supplier in Naraina Delhi',
    meta_description: 'Welded mesh, perforated sheet & fencing for Naraina Industrial Area Delhi. Fast dispatch from Noida. Call 9910238277.',
    intro: "Naraina Industrial Area sits between West and Central Delhi, with printing, packaging and light engineering units. Garg Industrial Mesh supplies welded mesh, perforated sheets, chain link fencing and wire mesh to Naraina factories and contractors who need durable industrial grades and dependable NCR delivery.",
    zones: "Naraina Industrial Area Phase 1 & 2, light engineering units, and the corridor toward Mayapuri and Kirti Nagar.",
    delivery: "Same-day dispatch to Naraina for in-stock industrial mesh; next-day for cut-to-size project orders.",
    products: ['MS Welded Mesh', 'MS Perforated Sheet', 'Chain Link Fence', 'SS Wire Mesh'],
    related: ['mayapuri-delhi', 'okhla-industrial-area-delhi', 'dwarka-delhi'],
    faq: [
      { q: "Do you deliver to Naraina Industrial Area the same day?", a: "Yes. In-stock welded mesh and perforated sheet often ship to Naraina the same day when ordered before noon." },
      { q: "Can Naraina units get chain link for factory boundaries?", a: "Yes. GI and PVC-coated chain link fencing is available in standard heights for Naraina factory and warehouse plots." }
    ]
  },
  {
    slug: 'bawana-delhi',
    locality: 'Bawana',
    sector: 'Bawana',
    city: 'Delhi',
    citySlug: 'delhi',
    title: 'Wire Mesh Supplier in Bawana Delhi',
    meta_description: 'Bulk welded mesh & chain link for Bawana Industrial Area Delhi factories. Wholesale rates, fast delivery. Call 9910238277.',
    intro: "Bawana Industrial Area is one of Delhi's largest planned industrial estates in the north-west. Garg Industrial Mesh supplies bulk SS, GI and MS welded mesh, perforated sheets and chain link fencing to Bawana factories and warehouse operators — ideal for machine guards, screens, cages and perimeter security at wholesale pricing.",
    zones: "Bawana Industrial Area sectors and flatted factories, Narela industrial approach, and GT Karnal Road warehouse belt.",
    delivery: "Same-day to next-day dispatch to Bawana for in-stock bulk mesh; large project lots typically 1–2 days.",
    products: ['GI Welded Mesh', 'MS Welded Mesh', 'Chain Link Fence', 'MS Perforated Sheet'],
    related: ['wazirpur-delhi', 'north-delhi', 'rohini-delhi'],
    faq: [
      { q: "Do you supply bulk GI welded mesh to Bawana factories?", a: "Yes. Bawana is a key industrial delivery zone. Share opening size, wire gauge and quantity for a wholesale quote on WhatsApp 9910238277." },
      { q: "Is chain link fencing available for Bawana warehouse plots?", a: "Yes. We supply GI and PVC chain link for Bawana plot and warehouse boundary security in standard heights." }
    ]
  },
  {
    slug: 'dwarka-delhi',
    locality: 'Dwarka',
    sector: 'Dwarka',
    city: 'Delhi',
    citySlug: 'delhi',
    title: 'Wire Mesh Supplier in Dwarka Delhi',
    meta_description: 'Bird mesh, monkey spikes & door mesh for Dwarka Delhi societies. Fast balcony protection delivery. Call 9910238277.',
    intro: "Dwarka's planned residential sectors and high-rise societies create steady demand for balcony bird mesh, monkey spikes and aluminium door mesh. Garg Industrial Mesh supplies these plus PVC mesh to Dwarka RWAs, homeowners and interior contractors — discreet, UV-stable products that keep pigeons and monkeys out without spoiling the view.",
    zones: "Dwarka Sector 1–23 residential belts, high-rise societies near Dwarka Mor / Sector 21 Metro, and commercial pockets toward Dwarka Expressway.",
    delivery: "Same-day to next-day dispatch across Dwarka sectors for in-stock bird mesh, spikes and door mesh.",
    products: ['Bird Mesh', 'Monkey Spikes', 'Bird Spikes', 'Aluminium Door Mesh'],
    related: ['rohini-delhi', 'lajpat-nagar-south-delhi', 'udyog-vihar-gurugram'],
    faq: [
      { q: "Do you deliver bird mesh to Dwarka high-rise balconies?", a: "Yes. Dwarka is a regular residential delivery zone. Share balcony measurements on WhatsApp for cut-to-size bird mesh." },
      { q: "Are monkey spikes used in Dwarka societies?", a: "Yes. Many Dwarka societies install our galvanised monkey spikes on water tanks, parapets and boundary walls." }
    ]
  },
  {
    slug: 'rohini-delhi',
    locality: 'Rohini',
    sector: 'Rohini',
    city: 'Delhi',
    citySlug: 'delhi',
    title: 'Wire Mesh Supplier in Rohini Delhi',
    meta_description: 'Bird mesh, door mesh & spikes for Rohini Delhi flats & societies. UV-stable mesh, local delivery. Call 9910238277.',
    intro: "Rohini is North-West Delhi's large planned residential district, with dense DDA flats, societies and markets. Garg Industrial Mesh supplies bird mesh, aluminium door mesh, bird spikes and PVC mesh to Rohini homes and shops — practical pest-control and ventilation solutions with reliable delivery from Noida.",
    zones: "Rohini Sectors 1–25 residential blocks, society complexes near District Centres, and adjoining Prashant Vihar / Pitampura belts.",
    delivery: "Same-day to next-day dispatch across Rohini for in-stock bird mesh, door mesh and spikes.",
    products: ['Bird Mesh', 'Aluminium Door Mesh', 'Bird Spikes', 'PVC Mesh'],
    related: ['dwarka-delhi', 'bawana-delhi', 'north-delhi'],
    faq: [
      { q: "Can Rohini flats get aluminium door mesh cut to size?", a: "Yes. We cut aluminium mesh to your door and window openings before dispatch to Rohini." },
      { q: "Do you supply bird spikes for Rohini market shopfronts?", a: "Yes. SS and plastic bird spikes are popular on Rohini market ledges and signage — same-day dispatch on in-stock types." }
    ]
  },
  {
    slug: 'lajpat-nagar-south-delhi',
    locality: 'Lajpat Nagar / South Delhi',
    sector: 'Lajpat Nagar / South Delhi',
    city: 'Delhi',
    citySlug: 'delhi',
    title: 'Wire Mesh Supplier in Lajpat Nagar South Delhi',
    meta_description: 'Bird mesh, spikes & security mesh for Lajpat Nagar & South Delhi homes & shops. Fast delivery. Call 9910238277.',
    intro: "Lajpat Nagar and the wider South Delhi belt — Defence Colony, Greater Kailash, Nehru Place approaches — mix busy markets with premium homes. Garg Industrial Mesh supplies bird mesh and spikes for residences, plus SS welded mesh and perforated panels for shopfront security and office partitions across South Delhi.",
    zones: "Lajpat Nagar Central Market, Defence Colony / GK residential pockets, Nehru Place commercial approaches, and South Extension–style retail corridors.",
    delivery: "Same-day to next-day dispatch across Lajpat Nagar and adjoining South Delhi localities for in-stock mesh and spikes.",
    products: ['Bird Mesh', 'Bird Spikes', 'SS Welded Mesh', 'Aluminium Door Mesh'],
    related: ['okhla-industrial-area-delhi', 'east-delhi', 'dwarka-delhi'],
    faq: [
      { q: "Do you deliver bird mesh to South Delhi apartments?", a: "Yes. Lajpat Nagar, GK and adjoining South Delhi societies are regular delivery zones for balcony bird mesh." },
      { q: "Can Lajpat Nagar shops get SS security mesh?", a: "Yes. SS welded mesh is used for shopfront grilles and counter screens across Lajpat Nagar Central Market." }
    ]
  },
  {
    slug: 'east-delhi',
    locality: 'East Delhi',
    sector: 'East Delhi',
    city: 'Delhi',
    citySlug: 'delhi',
    title: 'Wire Mesh Supplier in East Delhi Laxmi Nagar',
    meta_description: 'Bird mesh, fencing & welded mesh for East Delhi — Laxmi Nagar, Preet Vihar & Patparganj. Call 9910238277.',
    intro: "East Delhi's Laxmi Nagar, Preet Vihar, Patparganj and Shahdara belts combine dense housing with light commercial activity. Garg Industrial Mesh supplies bird mesh and door mesh for flats, chain link and welded mesh for plots and warehouses, and construction net for ongoing East Delhi builds — all with fast NCR dispatch.",
    zones: "Laxmi Nagar and Preet Vihar residential/commercial belts, Patparganj industrial & warehouse pockets, and Shahdara–Anand Vihar approaches.",
    delivery: "Same-day to next-day dispatch across East Delhi for in-stock bird mesh, fencing and welded mesh.",
    products: ['Bird Mesh', 'Chain Link Fence', 'MS Welded Mesh', 'Construction Net'],
    related: ['lajpat-nagar-south-delhi', 'sahibabad-ghaziabad', 'indirapuram-ghaziabad'],
    faq: [
      { q: "Do you deliver to Laxmi Nagar and Preet Vihar the same day?", a: "Yes. East Delhi residential belts are same-day or next-morning zones for in-stock bird mesh and fencing." },
      { q: "Can Patparganj warehouses get chain link fencing?", a: "Yes. GI and PVC chain link is supplied for Patparganj warehouse and plot boundaries." }
    ]
  },
  {
    slug: 'north-delhi',
    locality: 'North Delhi',
    sector: 'North Delhi',
    city: 'Delhi',
    citySlug: 'delhi',
    title: 'Wire Mesh Supplier in North Delhi',
    meta_description: 'Welded mesh, fencing & bird mesh for North Delhi — Model Town, Civil Lines & GT Karnal Road. Call 9910238277.',
    intro: "North Delhi — Model Town, Civil Lines, GT Karnal Road, Alipur approaches — mixes residential colonies with wholesale and light-industrial activity. Garg Industrial Mesh supplies welded mesh and fencing for commercial plots, plus bird mesh and door mesh for North Delhi homes and societies.",
    zones: "Model Town / Civil Lines residential belts, GT Karnal Road wholesale corridor, and Alipur–Narela approaches toward Bawana.",
    delivery: "Same-day to next-day dispatch across North Delhi for in-stock industrial and residential mesh products.",
    products: ['GI Welded Mesh', 'Chain Link Fence', 'Bird Mesh', 'Aluminium Door Mesh'],
    related: ['bawana-delhi', 'rohini-delhi', 'wazirpur-delhi'],
    faq: [
      { q: "Do you supply fencing mesh along GT Karnal Road plots?", a: "Yes. Chain link and GI welded mesh are regularly supplied for plot and yard fencing along the GT Karnal Road belt." },
      { q: "Is bird mesh available for Model Town / Civil Lines flats?", a: "Yes. UV-stabilised bird mesh ships to North Delhi residential colonies, often same day for in-stock rolls." }
    ]
  },

  // ── Ghaziabad ─────────────────────────────────────────────────────
  {
    slug: 'sahibabad-ghaziabad',
    locality: 'Sahibabad Industrial Area',
    sector: 'Sahibabad Industrial Area',
    city: 'Ghaziabad',
    citySlug: 'ghaziabad',
    title: 'Wire Mesh Supplier in Sahibabad Ghaziabad',
    meta_description: 'SS/GI/MS welded mesh & perforated sheet for Sahibabad Industrial Area. Same-day dispatch. Call 9910238277.',
    intro: "Sahibabad Industrial Area is Ghaziabad's most active manufacturing and fabrication cluster. Garg Industrial Mesh supplies SS, GI and MS welded mesh, perforated sheets and wire mesh to Sahibabad factories and workshops — a short hop from our Noida base, so same-day dispatch is routine for in-stock grades.",
    zones: "Sahibabad Industrial Area main estates, adjoining Site IV approaches, and fabrication units toward Mohan Nagar.",
    delivery: "Same-day dispatch to Sahibabad for in-stock industrial mesh when ordered before noon; cut-to-size next day.",
    products: ['SS Welded Mesh', 'GI Welded Mesh', 'MS Perforated Sheet', 'SS Wire Mesh'],
    related: ['site-iv-loni-road-ghaziabad', 'mohan-nagar-ghaziabad', 'indirapuram-ghaziabad'],
    faq: [
      { q: "Do you deliver welded mesh to Sahibabad the same day?", a: "Yes. Sahibabad is one of our closest industrial zones outside Noida — in-stock mesh often ships the same day." },
      { q: "Can Sahibabad units get bulk SS 304 welded mesh?", a: "Yes. We supply SS 304 and SS 201 welded mesh in bulk at wholesale rates — share specs on WhatsApp 9910238277." },
      { q: "Is perforated sheet cut-to-size available for Sahibabad jobs?", a: "Yes. MS and SS perforated sheets are cut to your panel sizes before dispatch to Sahibabad workshops." }
    ]
  },
  {
    slug: 'site-iv-loni-road-ghaziabad',
    locality: 'Site IV / Loni Road',
    sector: 'Site IV / Loni Road',
    city: 'Ghaziabad',
    citySlug: 'ghaziabad',
    title: 'Wire Mesh Supplier in Site IV Loni Road Ghaziabad',
    meta_description: 'Industrial welded mesh & fencing for Site IV & Loni Road Ghaziabad factories. Wholesale rates. Call 9910238277.',
    intro: "Site IV and the Loni Road industrial corridor form a major Ghaziabad manufacturing belt alongside Sahibabad. Garg Industrial Mesh supplies welded mesh, perforated sheets and chain link fencing to Site IV factories and Loni Road units that need durable industrial grades and reliable bulk delivery.",
    zones: "Site IV industrial plots, Loni Road manufacturing stretch, and adjoining Site V / Rajendra Nagar industrial approaches.",
    delivery: "Same-day dispatch to Site IV and Loni Road for in-stock mesh; 1–2 days for large cut-to-size project lots.",
    products: ['MS Welded Mesh', 'MS Perforated Sheet', 'Chain Link Fence', 'GI Welded Mesh'],
    related: ['sahibabad-ghaziabad', 'mohan-nagar-ghaziabad', 'east-delhi'],
    faq: [
      { q: "Do you cover Site IV and Loni Road for same-day delivery?", a: "Yes. Both are core Ghaziabad industrial delivery zones for in-stock welded mesh and perforated sheet." },
      { q: "Can Site IV factories get chain link for plot boundaries?", a: "Yes. GI and PVC chain link in standard heights is stocked for Site IV factory and warehouse fencing." }
    ]
  },
  {
    slug: 'indirapuram-ghaziabad',
    locality: 'Indirapuram',
    sector: 'Indirapuram',
    city: 'Ghaziabad',
    citySlug: 'ghaziabad',
    title: 'Wire Mesh Supplier in Indirapuram Ghaziabad',
    meta_description: 'Bird mesh, monkey spikes & construction net for Indirapuram Ghaziabad high-rises. Fast delivery. Call 9910238277.',
    intro: "Indirapuram is Ghaziabad's dense high-rise residential hub, with societies along NH-24 and the Madan Mohan Malviya Marg belt. Garg Industrial Mesh supplies bird mesh, monkey spikes, aluminium door mesh and construction net to Indirapuram apartments and builders — the products most requested for balcony protection and active tower sites.",
    zones: "Indirapuram Ahinsa Khand / Nyay Khand societies, high-rises near Shipra Mall, and the corridor toward Vaishali and Kaushambi.",
    delivery: "Same-day dispatch to Indirapuram for in-stock bird mesh and spikes; construction net for sites ships same day or next day.",
    products: ['Bird Mesh', 'Monkey Spikes', 'Construction Net', 'Aluminium Door Mesh'],
    related: ['vaishali-ghaziabad', 'crossings-republik-ghaziabad', 'sahibabad-ghaziabad'],
    faq: [
      { q: "Do you deliver bird mesh to Indirapuram high-rises?", a: "Yes. Indirapuram is a priority residential zone. In-stock bird mesh often ships the same day — share balcony sizes on WhatsApp." },
      { q: "Is construction net available for Indirapuram tower sites?", a: "Yes. UV-stabilised HDPE construction net is supplied to Indirapuram high-rise projects for debris and fall protection." }
    ]
  },
  {
    slug: 'vaishali-ghaziabad',
    locality: 'Vaishali',
    sector: 'Vaishali',
    city: 'Ghaziabad',
    citySlug: 'ghaziabad',
    title: 'Wire Mesh Supplier in Vaishali Ghaziabad',
    meta_description: 'Bird mesh, door mesh & spikes for Vaishali Ghaziabad societies near Metro. Fast local delivery. Call 9910238277.',
    intro: "Vaishali is a well-connected Ghaziabad residential sector on the Blue Line Metro, with established societies and mid-rise apartments. Garg Industrial Mesh supplies bird mesh, aluminium door mesh, bird spikes and PVC mesh to Vaishali homes — discreet pest-control options that suit balcony and window openings.",
    zones: "Vaishali residential sectors near the Metro, society complexes toward Kaushambi, and the Indirapuram–Vaishali residential corridor.",
    delivery: "Same-day to next-day dispatch across Vaishali for in-stock bird mesh, door mesh and spikes.",
    products: ['Bird Mesh', 'Aluminium Door Mesh', 'Bird Spikes', 'PVC Mesh'],
    related: ['indirapuram-ghaziabad', 'crossings-republik-ghaziabad', 'east-delhi'],
    faq: [
      { q: "Can Vaishali flats get bird mesh cut to balcony size?", a: "Yes. We cut UV-stabilised nylon or PVC bird mesh to your balcony openings before dispatch to Vaishali." },
      { q: "Do you supply door mesh near Vaishali Metro societies?", a: "Yes. Aluminium door mesh cut to door/window size is a regular Vaishali order — often next-day delivery." }
    ]
  },
  {
    slug: 'crossings-republik-ghaziabad',
    locality: 'Crossings Republik',
    sector: 'Crossings Republik',
    city: 'Ghaziabad',
    citySlug: 'ghaziabad',
    title: 'Wire Mesh Supplier in Crossings Republik Ghaziabad',
    meta_description: 'Bird mesh, monkey spikes & construction net for Crossings Republik Ghaziabad towers. Call 9910238277.',
    intro: "Crossings Republik is a large integrated township on the NH-24 corridor with high-rise towers and ongoing construction. Garg Industrial Mesh supplies bird mesh, monkey spikes and construction safety net to Crossings Republik apartments and site contractors — products matched to balcony living and active building phases.",
    zones: "Crossings Republik township towers, society clusters along NH-24, and adjoining residential pockets toward Indirapuram and Vasundhara.",
    delivery: "Same-day to next-day dispatch to Crossings Republik for in-stock bird mesh, spikes and construction net.",
    products: ['Bird Mesh', 'Monkey Spikes', 'Construction Net', 'Bird Spikes'],
    related: ['indirapuram-ghaziabad', 'vaishali-ghaziabad', 'raj-nagar-extension-ghaziabad'],
    faq: [
      { q: "Do you deliver to Crossings Republik high-rises?", a: "Yes. Crossings Republik is a regular delivery zone for balcony bird mesh and monkey spikes." },
      { q: "Can site engineers get construction net at Crossings Republik?", a: "Yes. UV-stabilised HDPE construction net is supplied for debris and edge protection on active Crossings Republik towers." }
    ]
  },
  {
    slug: 'mohan-nagar-ghaziabad',
    locality: 'Mohan Nagar',
    sector: 'Mohan Nagar',
    city: 'Ghaziabad',
    citySlug: 'ghaziabad',
    title: 'Wire Mesh Supplier in Mohan Nagar Ghaziabad',
    meta_description: 'Welded mesh & perforated sheet for Mohan Nagar Ghaziabad workshops near Sahibabad. Call 9910238277.',
    intro: "Mohan Nagar sits beside Sahibabad's industrial belt, with workshops, warehouses and mixed commercial activity. Garg Industrial Mesh supplies welded mesh, perforated sheets and chain link fencing to Mohan Nagar fabricators and contractors who need industrial grades with the same fast dispatch we offer Sahibabad.",
    zones: "Mohan Nagar industrial and warehouse pockets, approaches to Sahibabad Industrial Area, and the GT Road commercial stretch.",
    delivery: "Same-day dispatch to Mohan Nagar for in-stock industrial mesh — often combined with Sahibabad runs.",
    products: ['MS Welded Mesh', 'MS Perforated Sheet', 'Chain Link Fence', 'GI Welded Mesh'],
    related: ['sahibabad-ghaziabad', 'site-iv-loni-road-ghaziabad', 'raj-nagar-extension-ghaziabad'],
    faq: [
      { q: "Do you deliver industrial mesh to Mohan Nagar workshops?", a: "Yes. Mohan Nagar is covered on the same industrial delivery routes as Sahibabad for in-stock welded mesh and perforated sheet." },
      { q: "Is chain link available for Mohan Nagar warehouse yards?", a: "Yes. GI and PVC chain link fencing is supplied for Mohan Nagar warehouse and plot boundaries." }
    ]
  },
  {
    slug: 'raj-nagar-extension-ghaziabad',
    locality: 'Raj Nagar Extension',
    sector: 'Raj Nagar Extension',
    city: 'Ghaziabad',
    citySlug: 'ghaziabad',
    title: 'Wire Mesh Supplier in Raj Nagar Extension Ghaziabad',
    meta_description: 'Bird mesh, fencing & construction net for Raj Nagar Extension Ghaziabad societies. Call 9910238277.',
    intro: "Raj Nagar Extension is a fast-growing residential corridor on Ghaziabad's western side, with mid-rise societies and new projects. Garg Industrial Mesh supplies bird mesh, monkey spikes, chain link fencing and construction net to Raj Nagar Extension homeowners and builders securing balconies and site perimeters.",
    zones: "Raj Nagar Extension society clusters, plotted pockets, and connecting roads toward Mohan Nagar and NH-58 approaches.",
    delivery: "Same-day to next-day dispatch to Raj Nagar Extension for in-stock bird mesh, fencing and construction net.",
    products: ['Bird Mesh', 'Monkey Spikes', 'Chain Link Fence', 'Construction Net'],
    related: ['mohan-nagar-ghaziabad', 'crossings-republik-ghaziabad', 'indirapuram-ghaziabad'],
    faq: [
      { q: "Do you deliver bird mesh to Raj Nagar Extension flats?", a: "Yes. In-stock bird mesh and monkey spikes ship to Raj Nagar Extension societies same day or next morning." },
      { q: "Can plot owners get chain link fencing in Raj Nagar Extension?", a: "Yes. GI and PVC-coated chain link is available for plot boundaries across Raj Nagar Extension." }
    ]
  },

  // ── Faridabad ─────────────────────────────────────────────────────
  {
    slug: 'sector-15-16-27-faridabad',
    locality: 'Sector 15/16/27 Industrial',
    sector: 'Sector 15/16/27 Industrial',
    city: 'Faridabad',
    citySlug: 'faridabad',
    title: 'Wire Mesh Supplier in Sector 15 16 27 Faridabad',
    meta_description: 'SS/MS welded mesh & perforated sheet for Faridabad Sector 15/16/27 industrial belt. Wholesale. Call 9910238277.',
    intro: "Faridabad's Sector 15, 16 and 27 industrial pockets are part of the city's established manufacturing core. Garg Industrial Mesh supplies SS, GI and MS welded mesh, perforated sheets and wire mesh to factories and fabricators in this belt — genuine grades at wholesale rates with reliable NCR dispatch.",
    zones: "Sector 15, 16 and 27 industrial plots, adjoining Sector 24–31 manufacturing corridor, and fabrication units toward NIT Faridabad.",
    delivery: "Same-day to next-day dispatch to Sector 15/16/27 for in-stock industrial mesh; cut-to-size typically 1–2 days.",
    products: ['SS Welded Mesh', 'MS Welded Mesh', 'MS Perforated Sheet', 'SS Wire Mesh'],
    related: ['nit-faridabad', 'ballabhgarh-faridabad', 'surajkund-faridabad'],
    faq: [
      { q: "Do you deliver welded mesh to Faridabad Sector 15/16/27?", a: "Yes. This industrial belt is a regular Faridabad delivery zone. Call 9910238277 to confirm stock and timing." },
      { q: "Can factories get perforated sheet cut to size here?", a: "Yes. We cut MS and SS perforated sheets for machine guards and screens used across the Sector 15–27 industrial corridor." }
    ]
  },
  {
    slug: 'ballabhgarh-faridabad',
    locality: 'Ballabhgarh',
    sector: 'Ballabhgarh',
    city: 'Faridabad',
    citySlug: 'faridabad',
    title: 'Wire Mesh Supplier in Ballabhgarh Faridabad',
    meta_description: 'SS wire mesh, welded mesh & fencing for Ballabhgarh Faridabad industrial cluster. Call 9910238277.',
    intro: "Ballabhgarh (Ballabgarh) is a major Faridabad industrial and trading cluster with steel, auto-ancillary and fabrication units. Garg Industrial Mesh supplies SS wire mesh for filtration, welded mesh for screens and cages, and chain link fencing for plot security — serving Ballabhgarh factories that need authentic grades and dependable delivery.",
    zones: "Ballabhgarh industrial estates, Mathura Road manufacturing stretch, and adjoining Faridabad Sector 58–68 approaches.",
    delivery: "Same-day to next-day dispatch to Ballabhgarh for in-stock mesh; bulk project lots typically 1–2 days.",
    products: ['SS Wire Mesh', 'SS Welded Mesh', 'Chain Link Fence', 'GI Welded Mesh'],
    related: ['sector-15-16-27-faridabad', 'nit-faridabad', 'neharpar-greater-faridabad'],
    faq: [
      { q: "Do you supply SS 304 wire mesh for Ballabhgarh filtration units?", a: "Yes. SS 304 and SS 202 woven wire mesh from fine to coarse is stocked for Ballabhgarh filtration and sieving applications." },
      { q: "Is chain link fencing available for Ballabhgarh plots?", a: "Yes. GI and PVC chain link in standard heights ships to Ballabhgarh factory and farm-style boundaries." }
    ]
  },
  {
    slug: 'neharpar-greater-faridabad',
    locality: 'Neharpar / Greater Faridabad',
    sector: 'Neharpar / Greater Faridabad',
    city: 'Faridabad',
    citySlug: 'faridabad',
    title: 'Wire Mesh Supplier in Neharpar Greater Faridabad',
    meta_description: 'Bird mesh, chain link & construction net for Neharpar / Greater Faridabad societies & plots. Call 9910238277.',
    intro: "Neharpar and Greater Faridabad along the KMP corridor mix new residential societies with open plots and warehouse development. Garg Industrial Mesh supplies bird mesh and monkey spikes for towers, plus chain link fencing and construction net for plots and active sites across Greater Faridabad.",
    zones: "Neharpar residential sectors, Greater Faridabad society launches, KMP Expressway warehouse pockets, and adjoining Sector 75–89 approaches.",
    delivery: "Next-day standard for Neharpar / Greater Faridabad; same-day possible for in-stock bird mesh when ordered early.",
    products: ['Bird Mesh', 'Chain Link Fence', 'Construction Net', 'Monkey Spikes'],
    related: ['ballabhgarh-faridabad', 'nit-faridabad', 'surajkund-faridabad'],
    faq: [
      { q: "Do you deliver chain link to Greater Faridabad plots?", a: "Yes. GI and PVC-coated chain link is regularly supplied for Greater Faridabad and KMP corridor plot fencing." },
      { q: "Is bird mesh available for Neharpar high-rises?", a: "Yes. UV-stabilised bird mesh ships to Neharpar societies — share balcony measurements for cut-to-size orders." }
    ]
  },
  {
    slug: 'nit-faridabad',
    locality: 'NIT Faridabad',
    sector: 'NIT Faridabad',
    city: 'Faridabad',
    citySlug: 'faridabad',
    title: 'Wire Mesh Supplier in NIT Faridabad',
    meta_description: 'Welded mesh, perforated sheet & fencing for NIT Faridabad industrial belt. Same-day possible. Call 9910238277.',
    intro: "NIT Faridabad is the city's historic industrial and commercial heart, with dense workshops, markets and light manufacturing. Garg Industrial Mesh supplies welded mesh, perforated sheets, wire mesh and fencing to NIT fabricators and contractors — a core Faridabad delivery zone for industrial grades from our Noida warehouse.",
    zones: "NIT Faridabad industrial and market lanes, adjoining Sector 15–27 approaches, and workshops toward Ballabhgarh Mathura Road.",
    delivery: "Same-day to next-day dispatch to NIT Faridabad for in-stock industrial mesh and fencing.",
    products: ['MS Welded Mesh', 'MS Perforated Sheet', 'GI Welded Mesh', 'Chain Link Fence'],
    related: ['sector-15-16-27-faridabad', 'ballabhgarh-faridabad', 'surajkund-faridabad'],
    faq: [
      { q: "Do you deliver to NIT Faridabad workshops the same day?", a: "Yes. NIT is a priority Faridabad industrial zone — in-stock mesh often ships same day when ordered before noon." },
      { q: "Can NIT fabricators get MS perforated sheet in 4x8 ft?", a: "Yes. We stock MS perforated sheet in 3x8 and 4x8 ft with round, square and slot holes for NIT fabrication jobs." }
    ]
  },
  {
    slug: 'surajkund-faridabad',
    locality: 'Surajkund',
    sector: 'Surajkund',
    city: 'Faridabad',
    citySlug: 'faridabad',
    title: 'Wire Mesh Supplier in Surajkund Faridabad',
    meta_description: 'Bird mesh, door mesh & fencing for Surajkund Faridabad homes & hotels. Fast NCR delivery. Call 9910238277.',
    intro: "The Surajkund side of Faridabad blends residential colonies, hotels and tourism-facing properties near the Surajkund Mela grounds. Garg Industrial Mesh supplies bird mesh, aluminium door mesh, bird spikes and chain link fencing to Surajkund homes and hospitality properties that need discreet pest control and boundary security.",
    zones: "Surajkund Road residential pockets, hotel and resort approaches, and adjoining Faridabad sectors toward Delhi's South border.",
    delivery: "Same-day to next-day dispatch to the Surajkund belt for in-stock bird mesh, door mesh and fencing.",
    products: ['Bird Mesh', 'Aluminium Door Mesh', 'Bird Spikes', 'Chain Link Fence'],
    related: ['nit-faridabad', 'neharpar-greater-faridabad', 'lajpat-nagar-south-delhi'],
    faq: [
      { q: "Do you supply bird mesh for Surajkund hotels and homes?", a: "Yes. UV-stabilised bird mesh and bird spikes are popular on Surajkund ledges, balconies and signage." },
      { q: "Is chain link fencing available near Surajkund Road plots?", a: "Yes. GI and PVC chain link ships for Surajkund-side plot and property boundaries." }
    ]
  },

  // ── Gurugram ──────────────────────────────────────────────────────
  {
    slug: 'udyog-vihar-gurugram',
    locality: 'Udyog Vihar',
    sector: 'Udyog Vihar',
    city: 'Gurugram',
    citySlug: 'gurugram',
    title: 'Wire Mesh Supplier in Udyog Vihar Gurugram',
    meta_description: 'SS/GI welded mesh & perforated sheet for Udyog Vihar Phase 1–6 factories. Wholesale. Call 9910238277.',
    intro: "Udyog Vihar Phase 1–6 is Gurugram's classic industrial and warehousing belt along Delhi–Gurugram. Garg Industrial Mesh supplies SS, GI and MS welded mesh, perforated sheets and chain link fencing to Udyog Vihar factories, 3PL warehouses and contractors who need industrial grades with dependable NCR delivery.",
    zones: "Udyog Vihar Phase 1–6 industrial plots, warehouse complexes near NH-48, and adjoining Sector 18–37 industrial approaches.",
    delivery: "Same-day to next-day dispatch to Udyog Vihar for in-stock industrial mesh; cut-to-size typically 1–2 days.",
    products: ['SS Welded Mesh', 'GI Welded Mesh', 'MS Perforated Sheet', 'Chain Link Fence'],
    related: ['sector-37-18-gurugram', 'imt-manesar-gurugram', 'manesar-gurugram'],
    faq: [
      { q: "Do you deliver welded mesh to Udyog Vihar the same day?", a: "Yes. Udyog Vihar is a core Gurugram industrial zone. Call 9910238277 before noon to confirm same-day stock." },
      { q: "Can Udyog Vihar warehouses get chain link fencing?", a: "Yes. GI and PVC chain link in standard heights is supplied for Udyog Vihar warehouse and plot boundaries." },
      { q: "Is SS perforated sheet available for Udyog Vihar machine guards?", a: "Yes. We supply and cut SS/MS perforated sheets for machine guards and screens used across Udyog Vihar units." }
    ]
  },
  {
    slug: 'manesar-gurugram',
    locality: 'Manesar',
    sector: 'Manesar',
    city: 'Gurugram',
    citySlug: 'gurugram',
    title: 'Wire Mesh Supplier in Manesar Gurugram',
    meta_description: 'Bulk welded mesh & fencing for Manesar Gurugram factories & warehouses. Wholesale rates. Call 9910238277.',
    intro: "Manesar is Gurugram's large-scale industrial township corridor — auto, engineering and warehouse units drive demand for bulk mesh and fencing. Garg Industrial Mesh supplies welded mesh, perforated sheets and chain link fencing to Manesar factories at wholesale rates, with scheduled dispatch from our Noida base.",
    zones: "Manesar industrial stretches along NH-48, warehouse parks, and approaches to IMT Manesar and Bilaspur.",
    delivery: "Same-day to next-day for in-stock items to Manesar; large project lots typically 1–2 days.",
    products: ['GI Welded Mesh', 'MS Welded Mesh', 'Chain Link Fence', 'MS Perforated Sheet'],
    related: ['imt-manesar-gurugram', 'udyog-vihar-gurugram', 'sohna-road-gurugram'],
    faq: [
      { q: "Do you supply bulk GI welded mesh to Manesar factories?", a: "Yes. Share opening size, gauge and quantity on WhatsApp 9910238277 for a Manesar wholesale quote." },
      { q: "Is chain link fencing available for Manesar plot security?", a: "Yes. GI and PVC-coated chain link in 3.5ft–5ft heights is stocked for Manesar factory boundaries." }
    ]
  },
  {
    slug: 'sector-37-18-gurugram',
    locality: 'Sector 37/18 Industrial',
    sector: 'Sector 37/18 Industrial',
    city: 'Gurugram',
    citySlug: 'gurugram',
    title: 'Wire Mesh Supplier in Sector 37 18 Gurugram',
    meta_description: 'Industrial welded mesh & perforated sheet for Gurugram Sector 37 & 18. Fast NCR dispatch. Call 9910238277.',
    intro: "Gurugram Sector 37 and Sector 18 industrial pockets serve light manufacturing, auto-ancillary and warehouse operations near the Delhi border. Garg Industrial Mesh supplies welded mesh, perforated sheets and wire mesh to these sectors — practical industrial grades with quick turnaround from Noida.",
    zones: "Sector 37 industrial plots, Sector 18 industrial/warehouse belt, and the corridor toward Udyog Vihar and Dundahera.",
    delivery: "Same-day to next-day dispatch to Sector 37/18 for in-stock industrial mesh.",
    products: ['MS Welded Mesh', 'MS Perforated Sheet', 'SS Wire Mesh', 'GI Welded Mesh'],
    related: ['udyog-vihar-gurugram', 'imt-manesar-gurugram', 'dlf-cyber-city-gurugram'],
    faq: [
      { q: "Do you deliver to Gurugram Sector 37 industrial units?", a: "Yes. Sector 37 and Sector 18 industrial pockets are regular Gurugram delivery zones for in-stock mesh." },
      { q: "Can Sector 18 warehouses get perforated sheet panels?", a: "Yes. MS and SS perforated sheets are cut to panel sizes for Sector 18 warehouse and fabrication needs." }
    ]
  },
  {
    slug: 'imt-manesar-gurugram',
    locality: 'IMT Manesar',
    sector: 'IMT Manesar',
    city: 'Gurugram',
    citySlug: 'gurugram',
    title: 'Wire Mesh Supplier in IMT Manesar Gurugram',
    meta_description: 'SS/GI welded mesh & chain link for IMT Manesar factories. Bulk wholesale, fast delivery. Call 9910238277.',
    intro: "IMT Manesar (Industrial Model Township) hosts major manufacturing plants and vendor parks. Garg Industrial Mesh supplies SS and GI welded mesh, perforated sheets and chain link fencing in bulk to IMT Manesar OEMs and contractors — genuine grades at manufacturer wholesale rates with scheduled NCR logistics.",
    zones: "IMT Manesar industrial sectors and vendor parks, adjoining Manesar NH-48 belt, and warehouse parks toward Panchgaon.",
    delivery: "Same-day to next-day for in-stock items; large IMT project lots typically 1–2 days with advance confirmation.",
    products: ['SS Welded Mesh', 'GI Welded Mesh', 'Chain Link Fence', 'SS Perforated Sheet'],
    related: ['manesar-gurugram', 'udyog-vihar-gurugram', 'sohna-road-gurugram'],
    faq: [
      { q: "Do you deliver chain link fence to IMT Manesar factories?", a: "Yes. GI and PVC chain link for factory boundary security ships to IMT Manesar with same-day dispatch on in-stock heights." },
      { q: "Can IMT units get bulk SS 304 welded mesh?", a: "Yes. We supply SS 304/201 welded mesh in bulk to IMT Manesar plants — share specs for a wholesale quote." },
      { q: "Is SS perforated sheet available for IMT architectural or machine use?", a: "Yes. SS perforated sheet with standard or custom hole patterns is supplied for IMT Manesar industrial and facade applications." }
    ]
  },
  {
    slug: 'sohna-road-gurugram',
    locality: 'Sohna Road',
    sector: 'Sohna Road',
    city: 'Gurugram',
    citySlug: 'gurugram',
    title: 'Wire Mesh Supplier on Sohna Road Gurugram',
    meta_description: 'Bird mesh, monkey spikes & construction net for Sohna Road Gurugram high-rises. Call 9910238277.',
    intro: "Sohna Road is one of Gurugram's densest residential and mid-commercial corridors, packed with high-rise societies. Garg Industrial Mesh supplies bird mesh, monkey spikes, bird spikes and construction net to Sohna Road apartments and builders — the products most requested for balcony living and active tower construction.",
    zones: "Sohna Road high-rise belt (Sector 47–57 approaches), society clusters toward Badshahpur, and adjoining New Gurgaon residential pockets.",
    delivery: "Same-day to next-day dispatch along Sohna Road for in-stock bird mesh, spikes and construction net.",
    products: ['Bird Mesh', 'Monkey Spikes', 'Bird Spikes', 'Construction Net'],
    related: ['golf-course-road-gurugram', 'dlf-cyber-city-gurugram', 'manesar-gurugram'],
    faq: [
      { q: "Do you deliver bird mesh to Sohna Road high-rises?", a: "Yes. Sohna Road societies are a priority residential zone — in-stock bird mesh often ships the same day." },
      { q: "Are monkey spikes common on Sohna Road rooftops?", a: "Yes. Many Sohna Road societies use our galvanised monkey spikes on parapets, water tanks and boundary walls." }
    ]
  },
  {
    slug: 'golf-course-road-gurugram',
    locality: 'Golf Course Road',
    sector: 'Golf Course Road',
    city: 'Gurugram',
    citySlug: 'gurugram',
    title: 'Wire Mesh Supplier on Golf Course Road Gurugram',
    meta_description: 'Bird mesh, monkey spikes & door mesh for Golf Course Road Gurugram apartments. Call 9910238277.',
    intro: "Golf Course Road and Golf Course Extension host premium high-rises where balcony aesthetics matter. Garg Industrial Mesh supplies discreet UV-stabilised bird mesh, humane monkey spikes, bird spikes and aluminium door mesh to Golf Course Road apartments and facility managers — B2C protection products that do not block light or spoil the facade look.",
    zones: "Golf Course Road and Extension high-rises (Sector 42–66 approaches), society complexes toward Sector 56–57, and adjoining luxury residential belts.",
    delivery: "Same-day to next-day dispatch along Golf Course Road for in-stock bird mesh, spikes and door mesh.",
    products: ['Bird Mesh', 'Monkey Spikes', 'Bird Spikes', 'Aluminium Door Mesh'],
    related: ['sohna-road-gurugram', 'dlf-cyber-city-gurugram', 'dwarka-delhi'],
    faq: [
      { q: "Is bird mesh discreet enough for Golf Course Road balconies?", a: "Yes. Our fine UV-stabilised nylon mesh is designed to be nearly invisible from a distance while keeping pigeons out." },
      { q: "Do you supply monkey spikes to Golf Course Road societies?", a: "Yes. Galvanised and SS monkey spikes are installed on ledges and parapets across Golf Course Road high-rises." },
      { q: "Can facility managers order door mesh in bulk for a tower?", a: "Yes. We cut aluminium door mesh to repeated door/window sizes for Golf Course Road tower fit-outs — ask for project pricing." }
    ]
  },
  {
    slug: 'dlf-cyber-city-gurugram',
    locality: 'DLF / Cyber City',
    sector: 'DLF / Cyber City',
    city: 'Gurugram',
    citySlug: 'gurugram',
    title: 'Wire Mesh Supplier in DLF Cyber City Gurugram',
    meta_description: 'SS perforated sheet, bird spikes & security mesh for DLF Cyber City Gurugram offices. Call 9910238277.',
    intro: "DLF Cyber City and adjoining DLF commercial campuses need architectural perforated panels, bird control on ledges, and security mesh for plant rooms and shopfronts. Garg Industrial Mesh supplies SS perforated sheet, bird spikes, SS welded mesh and aluminium door mesh to Cyber City facility teams and fit-out contractors.",
    zones: "DLF Cyber City office towers, DLF Phase campus approaches, and commercial pockets toward Udyog Vihar and Golf Course Road.",
    delivery: "Same-day to next-day dispatch to Cyber City / DLF for in-stock perforated sheet, spikes and security mesh.",
    products: ['SS Perforated Sheet', 'Bird Spikes', 'SS Welded Mesh', 'Aluminium Door Mesh'],
    related: ['golf-course-road-gurugram', 'udyog-vihar-gurugram', 'sohna-road-gurugram'],
    faq: [
      { q: "Do you supply SS perforated sheet for Cyber City facades or infill?", a: "Yes. SS 304 perforated sheet with standard or custom hole patterns is supplied for architectural and balustrade infill across Cyber City projects." },
      { q: "Can Cyber City offices get bird spikes for ledges?", a: "Yes. SS and plastic bird spikes are commonly installed on Cyber City and DLF office ledges and signage." }
    ]
  }
];

function findBySlug(slug) {
  return sectors.find(s => s.slug === slug);
}

function byCity(citySlug) {
  return sectors.filter(s => s.citySlug === citySlug);
}

function groupedByCity() {
  const order = ['noida', 'greater-noida', 'delhi', 'ghaziabad', 'faridabad', 'gurugram'];
  const labels = {
    noida: 'Noida',
    'greater-noida': 'Greater Noida',
    delhi: 'Delhi',
    ghaziabad: 'Ghaziabad',
    faridabad: 'Faridabad',
    gurugram: 'Gurugram'
  };
  return order.map(slug => ({
    citySlug: slug,
    city: labels[slug],
    localities: byCity(slug)
  })).filter(g => g.localities.length);
}

function relatedLocalities(sector) {
  if (!sector || !sector.related) return [];
  return sector.related.map(findBySlug).filter(Boolean);
}

module.exports = { sectors, findBySlug, byCity, groupedByCity, relatedLocalities, slugify };
