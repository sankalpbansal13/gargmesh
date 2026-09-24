const { mat, sku, hub, NCR_FAQ } = require('./helpers');

const MAT = mat('hdpe', 'HDPE', 'Green HDPE construction net', 'Green HDPE construction net. GSM is chosen for the coverage you need.', {
  sort_order: 1,
  best_for: 'Scaffold and building-site coverage.'
});

const WEIGHTS = [
  ['construction-50', '50 GSM', 'Lighter coverage'],
  ['construction-75', '75 GSM', 'Medium coverage'],
  ['construction-90', '90 GSM', 'Heavier coverage']
];

function buildCategory() {
  const designs = WEIGHTS.map(([slug, label, cover], i) => sku({
    slug,
    name: 'Construction net ' + label,
    hole_shape: 'Net',
    short_desc: label + ' · 3 m × 50 m roll · ' + cover.toLowerCase(),
    description: 'Green HDPE construction net, ' + label + ', roll size 3 metres by 50 metres. ' + cover + '. From Sector 9, Noida, for sites across Delhi NCR.',
    applications: 'Building sites, scaffolding coverage, debris screens',
    faqs: [
      { q: 'What size is the roll?', a: '3 m × 50 m.' },
      { q: 'Which GSM should I take?', a: label + ' is for ' + cover.toLowerCase() + '. The other stock weights are 50, 75 and 90 GSM.' },
      NCR_FAQ
    ],
    meta_title: label + ' Construction Net 3×50 m | Garg Noida',
    meta_description: label + ' construction net, 3 m by 50 m rolls, from Noida for Delhi NCR sites. Quote 9910238277.',
    meta_keywords: 'construction net noida, ' + label + ' safety net, 3x50 construction net, debris net delhi',
    sort_order: i + 1,
    featured: i === 0,
    materials: [MAT],
    spec_kind: 'construction-net'
  }));

  return hub({
    slug: 'construction-net',
    name: 'Construction Net',
    short_desc: 'Green HDPE construction net. Rolls 3 m × 50 m. 50, 75 or 90 GSM depending on coverage.',
    description: 'Construction net from Garg Industrial Mesh, Sector 9 Noida. Green HDPE rolls are 3 metres wide by 50 metres long. Choose 50 GSM for lighter coverage, 75 GSM for medium coverage, or 90 GSM for heavier coverage. Supplied across Noida, Greater Noida, Delhi, Ghaziabad, Faridabad and Gurugram.',
    meta_title: 'Construction Net Noida | 50 75 90 GSM | 3×50 m | Garg',
    meta_description: 'Construction net in Noida — 3 m × 50 m rolls in 50, 75 and 90 GSM. Pick GSM by coverage. Delhi NCR delivery. Quote 9910238277.',
    meta_keywords: 'construction net noida, construction safety net delhi, scaffolding net ghaziabad, 90 gsm construction net',
    sort_order: 20,
    group: 'sheet',
    designs,
    materials: [MAT],
    guide: [
      {
        id: 'gsm',
        title: 'GSM and roll size',
        body: 'Every stock roll is 3 m × 50 m. The GSM changes with how much coverage you need. This is not chicken mesh and not POP jali.',
        tables: [[
          ['GSM', 'Roll', 'Use'],
          ['50 GSM', '3 m × 50 m', 'Lighter coverage'],
          ['75 GSM', '3 m × 50 m', 'Medium coverage'],
          ['90 GSM', '3 m × 50 m', 'Heavier coverage']
        ]]
      },
      {
        id: 'faq',
        title: 'Frequently asked questions',
        faqs: [
          { q: 'Is the roll size the same for every GSM?', a: 'Yes. 50, 75 and 90 GSM are all 3 m × 50 m. You change GSM for coverage, not for a different roll length.' },
          { q: 'Do you deliver construction net outside Noida?', a: 'Yes. From Sector 9, Noida to Greater Noida, Delhi, Ghaziabad, Faridabad and Gurugram.' },
          NCR_FAQ
        ]
      }
    ]
  });
}

module.exports = { buildCategory, MATERIALS: [MAT] };
