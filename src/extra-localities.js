// Localities named on the city pages that did not yet have their own card.
function page(o) {
  const place = o.name + ', ' + o.city;
  return {
    slug: o.slug,
    locality: o.name,
    sector: o.name,
    city: o.city,
    citySlug: o.citySlug,
    title: 'Wire Mesh Supplier in ' + o.name + ' ' + o.city,
    meta_description: ('Wire mesh, perforated sheet, construction net and fencing in ' + place + '. Garg Industrial Mesh, Sector 9 Noida. Call 9910238277.').slice(0, 155),
    intro: o.intro,
    zones: o.zones,
    delivery: 'Same-day dispatch to ' + o.name + ' for in-stock mesh. Cut-to-size and bulk orders typically arrive in 1–2 days from Sector 9, Noida.',
    related: o.related,
    faq: [
      {
        q: 'Do you deliver wire mesh to ' + o.name + '?',
        a: 'Yes. In-stock welded mesh, perforated sheet, chain link, chicken mesh and POP jali ship to ' + place + '. Call 9910238277 to confirm same-day dispatch.'
      },
      {
        q: 'Can I get construction net in ' + o.name + '?',
        a: 'Yes. Construction net for ' + o.name + ' is a 3 m × 50 m roll in 50, 75 or 90 GSM, chosen for the coverage you need.'
      }
    ]
  };
}

const N = ['sector-62-noida', 'sector-18-noida', 'sector-2-noida'];
const G = ['knowledge-park-greater-noida', 'ecotech-greater-noida', 'pari-chowk-greater-noida'];
const D = ['okhla-industrial-area-delhi', 'mayapuri-delhi', 'wazirpur-delhi'];
const Z = ['sahibabad-ghaziabad', 'indirapuram-ghaziabad', 'mohan-nagar-ghaziabad'];
const F = ['nit-faridabad', 'ballabhgarh-faridabad', 'neharpar-greater-faridabad'];
const R = ['udyog-vihar-gurugram', 'imt-manesar-gurugram', 'dlf-cyber-city-gurugram'];

const rows = [
  ['sector-9-noida', 'Sector 9', 'noida', 'Noida', 'Our shop is here: G-25, G Block, Sector 9, Noida 201301. Walk-in buyers and contractors collect welded mesh, perforated sheet and fencing from this sector.', 'G Block, the Sector 9 market lanes, and nearby Sector 10.', N],
  ['sector-10-noida', 'Sector 10', 'noida', 'Noida', 'Sector 10 sits beside our Sector 9 warehouse, so in-stock mesh is a short run for local fabricators and housing sites.', 'Sector 10 residential blocks and the road toward Sector 9 and Sector 12.', N],
  ['sector-16-noida', 'Sector 16', 'noida', 'Noida', 'Sector 16 is the Film City belt. Sets, studios and nearby housing take perforated sheet, bird mesh and chain link from us.', 'Film City campus, Sector 16A and the roads toward Sector 18.', N],
  ['sector-50-noida', 'Sector 50', 'noida', 'Noida', 'Sector 50 is a residential sector. Societies here order balcony bird mesh, chain link and POP jali.', 'Sector 50 blocks and the approach from the Noida stadium side.', N],
  ['sector-51-noida', 'Sector 51', 'noida', 'Noida', 'Sector 51 housing and small commercial sites take bird mesh, chain link and welded mesh for compound work.', 'Sector 51 blocks and the link toward Sector 50.', N],
  ['sector-57-noida', 'Sector 57', 'noida', 'Noida', 'Sector 57 is a residential pocket. Balcony mesh, POP jali and light chain link are the usual orders.', 'Sector 57 blocks and the roads toward Sector 58.', N],
  ['sector-58-noida', 'Sector 58', 'noida', 'Noida', 'Sector 58 societies and fit-out jobs take bird mesh, door machhar jali and POP plaster jali.', 'Sector 58 blocks and the approach from Sector 57 and Sector 60.', N],
  ['sector-60-noida', 'Sector 60', 'noida', 'Noida', 'Sector 60 mixes housing and local shops. We supply bird mesh, chain link and welded mesh for compound and balcony work.', 'Sector 60 market side and the residential blocks toward Sector 62.', N],
  ['sector-65-noida', 'Sector 65', 'noida', 'Noida', 'Sector 65 sits near the Sector 62–63 industrial belt. Fabricators here order welded mesh, perforated sheet and binding wire.', 'Sector 65 blocks and the road toward Sector 62 and Sector 63.', N],
  ['sector-71-noida', 'Sector 71', 'noida', 'Noida', 'Sector 71 housing projects take chain link, bird mesh and construction net for active sites.', 'Sector 71 blocks and the approach toward Noida Extension.', N],
  ['sector-74-noida', 'Sector 74', 'noida', 'Noida', 'Sector 74 is on the Noida Extension side. Plot fencing and site nets are the common orders.', 'Sector 74 and the roads toward Sector 75 and Greater Noida West.', N],
  ['sector-75-noida', 'Sector 75', 'noida', 'Noida', 'Sector 75 plot and society work uses GI chain link, construction net and welded mesh.', 'Sector 75 blocks and the link toward Sector 74 and Sector 76.', N],
  ['sector-78-noida', 'Sector 78', 'noida', 'Noida', 'Sector 78 residential and small commercial sites order chain link, bird mesh and POP jali.', 'Sector 78 and the approach from the Noida–Greater Noida side.', N],
  ['sector-132-noida', 'Sector 132', 'noida', 'Noida', 'Sector 132 is on the Noida–Greater Noida Expressway. Offices and housing here take perforated sheet, bird spikes and welded mesh.', 'Expressway-front plots in Sector 132 and the service lanes toward Sector 135.', N],
  ['sector-135-noida', 'Sector 135', 'noida', 'Noida', 'Sector 135 is an expressway corporate belt. Fit-outs order SS perforated sheet, bird spikes and door mesh.', 'Sector 135 towers and the expressway service road.', N],
  ['sector-137-noida', 'Sector 137', 'noida', 'Noida', 'Sector 137 expressway projects take architectural perforated sheet, bird mesh and construction net.', 'Sector 137 plots along the Noida–Greater Noida Expressway.', N],
  ['sector-141-noida', 'Sector 141', 'noida', 'Noida', 'Sector 141 is an expressway residential sector. Societies order balcony bird mesh, chain link and POP jali.', 'Sector 141 blocks and the expressway approach.', N],
  ['sector-143-noida', 'Sector 143', 'noida', 'Noida', 'Sector 143 housing along the expressway takes bird mesh, door jali and light fencing.', 'Sector 143 blocks and the road toward Sector 144.', N],
  ['sector-144-noida', 'Sector 144', 'noida', 'Noida', 'Sector 144 plot and society work uses chain link, construction net and welded mesh.', 'Sector 144 and the expressway service road toward Sector 137.', N],
  ['sector-150-noida', 'Sector 150', 'noida', 'Noida', 'Sector 150 is a commercial and residential pocket on the expressway. Shops and offices order perforated sheet, bird spikes and security mesh.', 'Sector 150 market front and the blocks toward Sector 151.', N],
  ['sector-151-noida', 'Sector 151', 'noida', 'Noida', 'Sector 151 societies and local sites take bird mesh, chain link and POP jali.', 'Sector 151 blocks and the road toward Sector 150.', N],
  ['sector-152-noida', 'Sector 152', 'noida', 'Noida', 'Sector 152 is further down the expressway. Fencing and balcony mesh are the usual loads.', 'Sector 152 and the approach from Sector 153.', N],
  ['sector-153-noida', 'Sector 153', 'noida', 'Noida', 'Sector 153 plot boundaries and society work use GI chain link, welded mesh and construction net.', 'Sector 153 blocks and the expressway side toward Sector 168.', N],
  ['sector-168-noida', 'Sector 168', 'noida', 'Noida', 'Sector 168 sits at the far expressway end of Noida. Site fencing and construction net are the common orders.', 'Sector 168 plots and the Noida–Greater Noida Expressway approach.', N],
  ['noida-expressway', 'Noida Expressway', 'noida', 'Noida', 'The Noida–Greater Noida Expressway corridor covers the high-rise and office sectors from Sector 132 onward. We deliver perforated sheet, bird mesh, spikes and construction net along this belt.', 'Expressway service roads and the sectors facing the Noida–Greater Noida Expressway.', N],

  ['eta-greater-noida', 'Eta', 'greater-noida', 'Greater Noida', 'Eta is a Greater Noida residential sector. Societies order balcony bird mesh, chain link and POP jali.', 'Eta blocks and the roads toward Delta and Zeta.', G],
  ['zeta-greater-noida', 'Zeta', 'greater-noida', 'Greater Noida', 'Zeta housing and local commercial sites take bird mesh, door jali and light chain link.', 'Zeta blocks and the approach from Eta and Knowledge Park.', G],
  ['mu-greater-noida', 'Mu', 'greater-noida', 'Greater Noida', 'Mu is a plotted and group-housing sector. Boundary chain link and construction net are regular orders.', 'Mu blocks and the roads toward Omicron.', G],
  ['pi-greater-noida', 'Pi', 'greater-noida', 'Greater Noida', 'Pi sector sites take GI chain link, welded mesh and bird mesh for compound and balcony work.', 'Pi blocks and the link toward Alpha and Beta.', G],
  ['sigma-greater-noida', 'Sigma', 'greater-noida', 'Greater Noida', 'Sigma residential pockets order bird mesh, POP jali and chain link.', 'Sigma blocks and the approach toward Pari Chowk.', G],
  ['omicron-greater-noida', 'Omicron', 'greater-noida', 'Greater Noida', 'Omicron plotted development uses chain link fencing, construction net and welded mesh.', 'Omicron blocks and the road toward Mu.', G],
  ['surajpur-greater-noida', 'Surajpur', 'greater-noida', 'Greater Noida', 'Surajpur is an industrial belt. Factories order welded mesh, perforated sheet, fine mesh and binding wire.', 'Surajpur industrial area and the Kasna approach.', G],
  ['kasna-greater-noida', 'Kasna', 'greater-noida', 'Greater Noida', 'Kasna manufacturing units take SS and GI welded mesh, mill jali and perforated sheet.', 'Kasna industrial estate and the Surajpur–Kasna road.', G],
  ['taj-highway-greater-noida', 'Taj Highway', 'greater-noida', 'Greater Noida', 'Sites along the Taj Highway take construction net, chain link and welded mesh for plots and factory boundaries.', 'Taj Highway frontage between Greater Noida and the Yamuna Expressway side.', G],
  ['tech-zone-greater-noida', 'Tech Zone', 'greater-noida', 'Greater Noida', 'Tech Zone in Greater Noida West is a high-rise belt. Towers order construction net, bird mesh and perforated sheet.', 'Tech Zone towers and Greater Noida West sectors beside them.', ['greater-noida-west', 'knowledge-park-greater-noida', 'pari-chowk-greater-noida']],

  ['jhandewalan-delhi', 'Jhandewalan', 'delhi', 'Delhi', 'Jhandewalan is a hardware and machinery market. Traders and fabricators pick up welded mesh, perforated sheet and binding wire.', 'Jhandewalan market lanes and the approach from Karol Bagh.', D],
  ['najafgarh-delhi', 'Najafgarh', 'delhi', 'Delhi', 'Najafgarh plot and farm boundaries take GI chain link, barbed wire and welded mesh.', 'Najafgarh town and the rural belt toward the Najafgarh drain side.', D],
  ['narela-delhi', 'Narela', 'delhi', 'Delhi', 'Narela industrial area orders welded mesh, perforated sheet, fine mesh and mill jali for factories.', 'Narela industrial estate and the DSIDC pockets.', D],
  ['patparganj-delhi', 'Patparganj', 'delhi', 'Delhi', 'Patparganj industrial area takes welded mesh, perforated sheet and expanded mesh for fabrication shops.', 'Patparganj industrial estate and the nearby housing toward East Delhi.', D],
  ['shahdara-delhi', 'Shahdara', 'delhi', 'Delhi', 'Shahdara fabricators and housing sites order welded mesh, chain link and door machhar jali.', 'Shahdara market and the industrial lanes toward GT Road.', D],
  ['karawal-nagar-delhi', 'Karawal Nagar', 'delhi', 'Delhi', 'Karawal Nagar plot fencing uses GI chain link, barbed wire and welded mesh.', 'Karawal Nagar blocks and the road toward Shahdara.', D],
  ['mangolpuri-delhi', 'Mangolpuri', 'delhi', 'Delhi', 'Mangolpuri industrial area orders welded mesh, perforated sheet and binding wire.', 'Mangolpuri industrial pockets and the approach from North Delhi.', D],
  ['gt-karnal-road-delhi', 'GT Karnal Road', 'delhi', 'Delhi', 'The GT Karnal Road wholesale belt takes welded mesh, chain link, barbed wire and perforated sheet in bulk.', 'GT Karnal Road godowns from Azadpur toward Alipur and Narela.', D],
  ['alipur-delhi', 'Alipur', 'delhi', 'Delhi', 'Alipur farm and plot boundaries use GI chain link, barbed wire and chicken mesh.', 'Alipur village belt and the GT Karnal Road side.', D],

  ['site-5-ghaziabad', 'Site 5', 'ghaziabad', 'Ghaziabad', 'Site 5 is a Ghaziabad industrial pocket beside Sahibabad. Factories order welded mesh, perforated sheet and binding wire.', 'Site 5 industrial plots and the road toward Sahibabad and Site 4.', Z],
  ['rajendra-nagar-ghaziabad', 'Rajendra Nagar', 'ghaziabad', 'Ghaziabad', 'Rajendra Nagar industrial and commercial sites take welded mesh, chain link and perforated sheet.', 'Rajendra Nagar industrial area and the Mohan Nagar approach.', Z],
  ['kaushambi-ghaziabad', 'Kaushambi', 'ghaziabad', 'Ghaziabad', 'Kaushambi high-rises order construction net, bird mesh and balcony jali.', 'Kaushambi towers beside the Anand Vihar–Ghaziabad border.', Z],
  ['vasundhara-ghaziabad', 'Vasundhara', 'ghaziabad', 'Ghaziabad', 'Vasundhara societies take bird mesh, door machhar jali and POP plaster jali.', 'Vasundhara sectors and the road toward Indirapuram.', Z],
  ['modinagar-ghaziabad', 'Modinagar', 'ghaziabad', 'Ghaziabad', 'Modinagar factories and plots order welded mesh, chain link and barbed wire.', 'Modinagar industrial belt on the Delhi–Meerut side of Ghaziabad.', Z],
  ['dasna-ghaziabad', 'Dasna', 'ghaziabad', 'Ghaziabad', 'Dasna industrial plots take GI chain link, welded mesh and barbed wire for factory boundaries.', 'Dasna industrial area on the Hapur Road.', Z],
  ['muradnagar-ghaziabad', 'Muradnagar', 'ghaziabad', 'Ghaziabad', 'Muradnagar and the nearby poultry and factory belt order chicken mesh, GI welded mesh and chain link.', 'Muradnagar town and the Hapur Road industrial frontage.', Z],
  ['hapur-road-ghaziabad', 'Hapur Road', 'ghaziabad', 'Ghaziabad', 'Hapur Road factories and farms take GI welded mesh, chicken mesh, chain link and barbed wire.', 'Hapur Road from Mohan Nagar toward Dasna and Muradnagar.', Z],

  ['imt-faridabad', 'IMT Faridabad', 'faridabad', 'Faridabad', 'IMT Faridabad factories order welded mesh, perforated sheet, fine mesh and binding wire.', 'IMT Faridabad industrial plots and the approach from Sector 58–59.', F],
  ['prithla-faridabad', 'Prithla', 'faridabad', 'Faridabad', 'Prithla industrial plots on the Faridabad edge take chain link, welded mesh and barbed wire.', 'Prithla industrial area and the road toward Ballabgarh.', F],

  ['dwarka-expressway-gurugram', 'Dwarka Expressway', 'gurugram', 'Gurugram', 'Towers on the Dwarka Expressway take construction net, bird mesh, bird spikes and perforated sheet.', 'Dwarka Expressway (Northern Peripheral Road) frontage and New Gurgaon sectors beside it.', R],
  ['new-gurgaon-gurugram', 'New Gurgaon', 'gurugram', 'Gurugram', 'New Gurgaon sectors order construction net for live sites, plus chain link and balcony bird mesh.', 'New Gurgaon sectors along the Dwarka Expressway.', R],
  ['bawdi-gurugram', 'Bawdi', 'gurugram', 'Gurugram', 'Bawdi and the nearby Gurugram fringe take plot chain link, barbed wire and welded mesh.', 'Bawdi village belt and the approach toward Sohna Road.', ['sohna-road-gurugram', 'imt-manesar-gurugram', 'golf-course-road-gurugram']]
];

module.exports = rows.map((r) => page({
  slug: r[0],
  name: r[1],
  citySlug: r[2],
  city: r[3],
  intro: r[4],
  zones: r[5],
  related: r[6]
}));
