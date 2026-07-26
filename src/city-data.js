// Unique, localized content for each city landing page to avoid thin/duplicate content.
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const cities = {
  'Noida': {
    slug: 'noida',
    intro: "Garg Industrial Mesh is based in Noida — at G-25, G Block, Sector 9 — and supplies stainless steel, galvanised and mild steel welded mesh, perforated sheets, wire mesh, chain link fence, PVC mesh, bird & monkey spikes and construction safety net across every sector of Noida. From single sheets cut to size to bulk project orders, we dispatch in-stock items the same day.",
    sectors: "Sector 1 to Sector 82, including Sector 9, 18, 62, 63, 68, 12, 10, 2, 16, 50, 51, 57, 58, 60, 65, 71, 74, 75, 78, 132, 135, 137, 141, 143, 144, 150, 151, 152, 153, 168, Expressway sectors and Noida Extension (Greater Noida West).",
    landmarks: "Near Noida Sector 18 Atta Market, Sector 62 industrial belt, Sector 63 electronics manufacturing hub, Sector 68 and 132 along the Noida-Greater Noida Expressway, Sector 135 IT corridor, and the Yamuna Expressway industrial zone.",
    delivery: "Same-day delivery within Noida for in-stock items; next-day for cut-to-size and bulk orders. We deliver to all Noida sectors, Noida Extension and the Expressway corridor.",
    faq: [
      { q: "Where is Garg Industrial Mesh located in Noida?", a: "We are at G-25, G Block, Sector 9, Noida 201301. Walk-in customers and contractors can visit during business hours, or call 9910238277 for same-day dispatch." },
      { q: "Do you deliver wire mesh to all Noida sectors the same day?", a: "Yes. In-stock welded mesh, perforated sheet and fencing are dispatched same day to every Noida sector, including the Expressway corridor and Noida Extension. Cut-to-size and bulk orders typically ship next day." },
      { q: "Can I buy SS 304 welded mesh in bulk for a Sector 62 factory project?", a: "Yes. We supply SS 304 (and SS 201) welded mesh in bulk to Sector 62, 63 and other Noida industrial belts at direct manufacturer wholesale rates. Share your grade, opening size and quantity for an instant quote." }
    ]
  },
  'Greater Noida': {
    slug: 'greater-noida',
    intro: "Garg Industrial Mesh supplies industrial wire mesh, perforated sheets, chain link fencing, bird & monkey spikes and construction net across Greater Noida and Greater Noida West (Noida Extension). With factories, educational campuses and large residential projects driving demand, we keep popular grades of SS, GI and MS mesh in stock for fast dispatch to Greater Noida sites.",
    sectors: "Greater Noida sectors Alpha, Beta, Gamma, Delta, Eta, Zeta, Mu, Pi, Sigma, Omicron, Knowledge Park 1–5, Pari Chowk area, Surajpur, Kasna, Ecotech 1–3 industrial areas, Taj Highway belt, and Greater Noida West sectors 1, 2, 3, 4, 10, 16, Tech Zone.",
    landmarks: "Near Pari Chowk, Knowledge Park educational hub, Ecotech 1 & 3 industrial estates, Gautam Buddha University, Yamuna Expressway junction, and the Surajpur–Kasna manufacturing belt.",
    delivery: "Same-day dispatch to Greater Noida and Greater Noida West for in-stock items; 1–2 days for cut-to-size and bulk project orders across the Yamuna Expressway corridor.",
    faq: [
      { q: "Do you deliver mesh to Greater Noida West (Noida Extension)?", a: "Yes. We deliver across Greater Noida West sectors and the Tech Zone. In-stock items ship same day; bulk and cut-to-size orders typically arrive within 1–2 days." },
      { q: "Can you supply chain link fencing for a plot near Ecotech 3?", a: "Yes. We supply GI and PVC-coated chain link fence in 3.5ft, 4.5ft and 5ft heights to Ecotech 1–3 and the entire Greater Noida industrial belt. Call 9910238277 for per-running-foot pricing." },
      { q: "Is bird mesh available for Greater Noida high-rise apartments?", a: "Yes. Our UV-stabilised nylon and PVC bird mesh is widely installed on Greater Noida balconies and windows. We can also recommend an installer if needed." }
    ]
  },
  'Delhi': {
    slug: 'delhi',
    intro: "Garg Industrial Mesh supplies wire mesh, perforated sheets, welded mesh, fencing and safety spikes across Delhi — from industrial zones in East and West Delhi to commercial hubs in Central and South Delhi. We serve contractors, fabricators, factories and homeowners throughout the capital with genuine SS, GI and MS grades and same-day dispatch where possible.",
    sectors: "Okhla Industrial Area, Mayapuri, Wazirpur, Jhandewalan, Najafgarh, Narela, Bawana, Patparganj, Shahdara, Karawal Nagar, Mangolpuri, GT Karnal Road, Alipur, and all major Delhi localities.",
    landmarks: "Near Okhla Phase 1 & 2 industrial estates, Mayapuri metal market, Wazirpur stainless steel market, Bawana and Narela industrial areas, and the GT Karnal Road wholesale belt.",
    delivery: "Same-day dispatch to most Delhi zones for in-stock items; next-day for cut-to-size and bulk orders. Delivery covers East, West, North, South and Central Delhi.",
    faq: [
      { q: "Do you deliver wire mesh to Okhla and Mayapuri industrial areas?", a: "Yes. We regularly deliver welded mesh, perforated sheet and wire mesh to Okhla Phase 1 & 2 and Mayapuri. In-stock items ship same day — call 9910238277 before noon for same-day delivery." },
      { q: "Can I get MS perforated sheets in 4x8 ft for a Delhi fabrication job?", a: "Yes. We stock MS perforated sheet in 3x8 ft and 4x8 ft with round, square and slot holes, cut to your requirement. Bulk and custom hole patterns are available on order." },
      { q: "Do you supply monkey spikes for Delhi residential societies?", a: "Yes. Our galvanised and stainless steel monkey spikes are installed across Delhi societies to deter monkeys from ledges, walls and rooftops — humane and long-lasting." }
    ]
  },
  'Ghaziabad': {
    slug: 'ghaziabad',
    intro: "Garg Industrial Mesh supplies industrial wire mesh, perforated sheets, chain link fence, welded mesh and bird & monkey spikes across Ghaziabad — including the major industrial clusters of Sahibabad, Site 4 and Site 5. We serve the city's fabricators, factories and builders with genuine-grade SS, GI and MS mesh and fast dispatch.",
    sectors: "Sahibabad Industrial Area, Site 4, Site 5, Mohan Nagar, Rajendra Nagar, Indirapuram, Vaishali, Kaushambi, Vasundhara, Loni, Modi Nagar, Dasna, Muradnagar, Hapur Road and Ghaziabad city centre.",
    landmarks: "Near Sahibabad and Site 4 industrial estates, Mohan Nagar, Rajendra Nagar, Indirapuram–Vaishali residential belt, and the Hapur Road manufacturing corridor.",
    delivery: "Same-day dispatch to Ghaziabad industrial areas for in-stock items; 1–2 days for cut-to-size and bulk orders across the district.",
    faq: [
      { q: "Do you deliver welded mesh to Sahibabad Industrial Area?", a: "Yes. Sahibabad and Site 4 are core delivery zones for us — in-stock welded mesh and perforated sheet ship same day. Call 9910238277 to confirm stock and timing." },
      { q: "Can I get construction safety net for a high-rise in Indirapuram?", a: "Yes. Our UV-stabilised HDPE construction net is supplied to high-rise projects across Indirapuram, Vaishali and Kaushambi for debris and fall protection." },
      { q: "Do you supply GI welded mesh for poultry farms near Hapur Road?", a: "Yes. We supply rust-resistant GI welded mesh in multiple opening sizes for poultry farms and boundary fencing across the Hapur Road and Muradnagar belt." }
    ]
  },
  'Faridabad': {
    slug: 'faridabad',
    intro: "Garg Industrial Mesh supplies wire mesh, perforated sheets, welded mesh, chain link fencing and safety spikes across Faridabad — including the large NIT and Sector 24–31 industrial belts. With a strong manufacturing base, Faridabad is a key market for our MS and SS mesh, and we keep popular grades in stock for fast dispatch to factories and fabricators.",
    sectors: "NIT Faridabad, Sector 24, 27, 28, 29, 30, 31, 37, 58, 59, 63, 64, 65, 66, 67, 68, Industrial Model Township (IMT), Prithla, Ballabgarh, Surajkund Road and Greater Faridabad.",
    landmarks: "Near NIT Faridabad, IMT Faridabad industrial estate, Ballabgarh industrial cluster, Sector 37, and Greater Faridabad along the KMP Expressway.",
    delivery: "Same-day dispatch to Faridabad industrial belts for in-stock items; 1–2 days for cut-to-size and bulk orders across Greater Faridabad.",
    faq: [
      { q: "Do you deliver mesh to IMT Faridabad industrial estate?", a: "Yes. IMT Faridabad and the NIT industrial belt are regular delivery zones for us. In-stock SS, GI and MS mesh ship same day — call 9910238277 to confirm." },
      { q: "Can you supply SS 304 wire mesh for filtration units in Ballabgarh?", a: "Yes. We stock SS 304 (and SS 202) woven wire mesh from fine to coarse for filtration and sieving applications across the Ballabgarh industrial cluster." },
      { q: "Do you provide chain link fencing for plots in Greater Faridabad?", a: "Yes. We supply GI and PVC-coated chain link fence to Greater Faridabad and the KMP corridor for plot, farm and factory boundary security." }
    ]
  },
  'Gurugram': {
    slug: 'gurugram',
    intro: "Garg Industrial Mesh supplies wire mesh, perforated sheets, welded mesh, chain link fence, bird & monkey spikes and construction net across Gurugram (Gurgaon) — from the corporate towers of Cyber City and Golf Course Road to the industrial clusters of Udyog Vihar and Manesar. We serve contractors, facility managers and homeowners with genuine-grade mesh and fast dispatch.",
    sectors: "Udyog Vihar Phase 1–6, IMT Manesar, Sector 1–57, Cyber City, Golf Course Road, Sohna Road, Dwarka Expressway belt, New Gurgaon, Bawdi, and Manesar industrial model township.",
    landmarks: "Near Udyog Vihar industrial phases, IMT Manesar, DLF Cyber City, Golf Course Road, Sohna Road, and the Dwarka Expressway (Northern Peripheral Road) corridor.",
    delivery: "Same-day dispatch to Gurugram industrial belts for in-stock items; 1–2 days for cut-to-size and bulk orders across Manesar and New Gurgaon.",
    faq: [
      { q: "Do you deliver bird spikes to Gurugram high-rise apartments?", a: "Yes. Our stainless steel and plastic bird spikes are installed across Gurugram high-rises on Golf Course Road, Sohna Road and the Dwarka Expressway corridor. Same-day dispatch on in-stock items." },
      { q: "Can you supply perforated sheets for facades in Cyber City projects?", a: "Yes. We supply SS 304 perforated sheet with custom hole patterns for architectural facades and balustrade infill across Cyber City and Golf Course Road projects." },
      { q: "Do you deliver chain link fence to IMT Manesar factories?", a: "Yes. We supply GI and PVC chain link fencing for factory boundary security across Udyog Vihar and IMT Manesar, with same-day dispatch for in-stock heights." }
    ]
  }
};

function findBySlug(slug) {
  return Object.values(cities).find(c => c.slug === slug);
}

function findByName(name) {
  return cities[name];
}

module.exports = { cities, findBySlug, findByName, slugify };
