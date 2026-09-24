const { loadContent, guideFromContent, mat, sku, hub, NCR_FAQ } = require('./helpers');

const content = loadContent('bird-spikes');

const MAT_PC = mat('polycarbonate', 'Polycarbonate', 'UV polycarbonate', 'UV polycarbonate spikes for ledges, AC units and signage.', {
  sort_order: 1,
  best_for: 'Bird / monkey control on ledges, AC outdoor units, signage and parapets.',
  detail: 'Polycarbonate spike strips — lightweight, UV-stable plastic base with pins. Confirm strip length and installation surface on the RFQ.'
});
const MAT_SS = mat('ss-304', 'Stainless Steel 304', 'SS 304', 'SS 304 bird spikes for long-life outdoor deterrence.', {
  sort_order: 2,
  best_for: 'Long-life outdoor bird spikes and heavier deterrent duty.',
  detail: 'SS 304 spike systems for durable outdoor install. Confirm base type and run length on the RFQ.'
});
const MAT_NET = mat('nylon-net', 'UV Nylon Net', 'Anti-bird netting', 'UV-stabilised nylon anti-bird nets for balconies and façades.', {
  sort_order: 3,
  best_for: 'Balcony and façade bird exclusion nets.',
  detail: 'Anti-bird netting in UV nylon. Confirm mesh size (e.g. 25 mm / 50 mm if specified), colour and area on the RFQ.'
});

const MATERIALS = [MAT_PC, MAT_SS, MAT_NET];

function designBase(opts) {
  return {
    hole_shape: null,
    hole_mm: null,
    pitch_mm: null,
    angle_deg: null,
    open_area_pct: null,
    faq: JSON.stringify((content.faqs || []).slice(0, 5)),
    featured: 1,
    spec_kind: 'spikes',
    ...opts
  };
}

function buildBirdCategory() {
  const designs = [
    designBase({
      slug: 'polycarbonate-bird-spikes',
      name: 'Polycarbonate Bird Spikes',
      short_desc: 'UV polycarbonate bird spike strips for ledges and AC units',
      description: 'Polycarbonate bird spikes for humane deterrence on ledges, AC units, signage and parapets. From Garg Industrial Mesh, Sector 9 Noida.',
      applications: 'Ledges, AC units, signage, parapets',
      meta_title: 'Polycarbonate Bird Spikes Noida | Garg Industrial Mesh',
      meta_description: 'Buy polycarbonate bird spikes in Noida — UV plastic strips for ledges and AC units. Quote 9910238277.',
      meta_keywords: 'polycarbonate bird spikes, bird spikes noida, plastic bird spikes',
      sort_order: 1,
      materials: [{ ...MAT_PC }]
    }),
    designBase({
      slug: 'ss-304-bird-spikes',
      name: 'SS 304 Bird Spikes',
      short_desc: 'Stainless steel 304 bird spikes for long outdoor life',
      description: 'SS 304 bird spikes for durable outdoor bird control. Confirm run length and fixings on the RFQ. Supplied from Sector 9 Noida.',
      applications: 'Outdoor ledges, rooftops, industrial sheds',
      meta_title: 'SS 304 Bird Spikes Noida | Garg Industrial Mesh',
      meta_description: 'Buy SS 304 bird spikes in Noida — long-life stainless spike strips. Quote 9910238277.',
      meta_keywords: 'ss 304 bird spikes, stainless bird spikes noida',
      sort_order: 2,
      materials: [{ ...MAT_SS }]
    })
  ];

  return {
    slug: 'bird-spikes',
    name: 'Bird Spikes',
    short_desc: 'Polycarbonate and SS 304 bird spike strips for ledges, AC units and rooftops.',
    description: 'Bird spikes in polycarbonate and SS 304 from Garg Industrial Mesh, Sector 9 Noida — humane deterrence for ledges, AC units, signage and parapets across Delhi NCR.',
    guide_sections: JSON.stringify(guideFromContent(content)),
    meta_title: 'Bird Spikes Noida | Polycarbonate & SS 304 | Garg',
    meta_description: content.meta_description || 'Bird spikes in polycarbonate and SS 304 from Noida. Quote 9910238277.',
    meta_keywords: 'bird spikes noida, polycarbonate bird spikes, ss 304 bird spikes',
    sort_order: 8,
    featured: 1,
    group: 'animal',
    designs,
    cover_image: content.images.find((i) => /hero/i.test(i)) || content.images[0],
    content_folder: content.folder,
    materials_catalog: [MAT_PC, MAT_SS]
  };
}

function buildMonkeyCategory() {
  const designs = [
    designBase({
      slug: 'monkey-spikes',
      name: 'Monkey Spikes',
      short_desc: 'Heavy-duty polycarbonate monkey deterrent spikes',
      description: 'Polycarbonate monkey spikes for Indian residential and commercial sites. Confirm length and mounting surface on the RFQ. From Garg Industrial Mesh, Sector 9 Noida.',
      applications: 'Balconies, compound walls, rooftops',
      meta_title: 'Monkey Spikes Noida | Garg Industrial Mesh',
      meta_description: 'Buy polycarbonate monkey spikes in Noida — heavy-duty deterrent strips. Quote 9910238277.',
      meta_keywords: 'monkey spikes noida, polycarbonate monkey spikes',
      sort_order: 1,
      materials: [{ ...MAT_PC }]
    })
  ];

  return {
    slug: 'monkey-spikes',
    name: 'Monkey Spikes',
    short_desc: 'Polycarbonate monkey deterrent spikes for balconies, walls and rooftops.',
    description: 'Monkey spikes in polycarbonate from Garg Industrial Mesh, Sector 9 Noida — heavy-duty deterrence for residential and commercial sites across Delhi NCR.',
    guide_sections: JSON.stringify([
      {
        id: 'what',
        title: 'What are monkey spikes?',
        body: 'Monkey spikes are denser / heavier deterrent strips than light bird spikes — used on balconies, compound walls and rooftops where monkeys are a problem. We stock polycarbonate monkey spikes from Sector 9, Noida.'
      },
      {
        id: 'faq',
        title: 'Frequently asked questions',
        body: 'Common questions for monkey spike orders.',
        faqs: (content.faqs || []).filter((f) => /monkey/i.test(f.q + f.a)).slice(0, 5).concat(
          (content.faqs || []).slice(0, 3)
        ).slice(0, 5)
      }
    ]),
    meta_title: 'Monkey Spikes Noida | Polycarbonate | Garg',
    meta_description: 'Monkey spikes (polycarbonate) supplier in Noida. Quote 9910238277.',
    meta_keywords: 'monkey spikes noida, monkey deterrent spikes',
    sort_order: 9,
    featured: 1,
    group: 'animal',
    designs,
    cover_image: content.images.find((i) => /hero/i.test(i)) || content.images[0],
    content_folder: content.folder,
    materials_catalog: [MAT_PC]
  };
}

const BIRD_COLOURS = [
  mat('bird-white', 'White', 'White bird net', 'White bird net.', { sort_order: 1 }),
  mat('bird-green', 'Green', 'Green bird net', 'Green bird net.', { sort_order: 2 }),
  mat('bird-blue', 'Blue', 'Blue bird net', 'Blue bird net — available in every stock size.', { sort_order: 3 })
];

const BIRD_ROLLS = [
  ['anti-bird-net', '10 ft × 100 ft roll'],
  ['bird-roll-12x100', '12 ft × 100 ft roll'],
  ['bird-roll-15x100', '15 ft × 100 ft roll']
];

const BIRD_PANELS = [
  '8×12',
  '10×10', '10×12', '10×15', '10×20', '10×25', '10×30',
  '12×12', '12×15', '12×20', '12×25', '12×30',
  '15×15', '15×20', '15×25', '15×30'
];

function buildNetCategory() {
  const designs = [];
  BIRD_ROLLS.forEach(([slug, label], i) => {
    designs.push(sku({
      slug,
      name: 'Bird net ' + label,
      short_desc: label + ' · white, green, blue',
      description: 'Bird net roll ' + label + '. Colours: white, green and blue. Blue is available in every stock size. From Sector 9, Noida.',
      applications: 'Balconies, courtyards, façades',
      meta_title: 'Bird Net ' + label + ' Noida | Garg',
      meta_description: 'Bird net ' + label + ' in white, green and blue. Noida. Quote 9910238277.',
      meta_keywords: 'bird net noida, anti bird net, ' + label,
      sort_order: i + 1,
      featured: i === 0,
      materials: BIRD_COLOURS,
      spec_kind: 'bird-net'
    }));
  });
  BIRD_PANELS.forEach((label, i) => {
    const slug = 'bird-panel-' + label.replace('×', 'x');
    designs.push(sku({
      slug,
      name: 'Bird net panel ' + label + ' ft',
      short_desc: label + ' ft panel · white, green, blue',
      description: 'Bird net panel ' + label + ' ft. Colours: white, green and blue. Blue is available in every stock size. From Sector 9, Noida.',
      applications: 'Balconies, courtyards, façades',
      meta_title: 'Bird Net Panel ' + label + ' Noida | Garg',
      meta_description: 'Bird net panel ' + label + ' ft in white, green and blue. Noida. Quote 9910238277.',
      meta_keywords: 'bird net panel, ' + label + ' bird net, noida',
      sort_order: BIRD_ROLLS.length + i + 1,
      materials: BIRD_COLOURS,
      spec_kind: 'bird-net'
    }));
  });

  return hub({
    slug: 'anti-bird-net',
    name: 'Bird Net',
    short_desc: 'White, green and blue. Rolls 10, 12 and 15 ft × 100 ft, plus stock panels. Blue is every size.',
    description: 'Bird net from Garg Industrial Mesh, Sector 9 Noida. Colours: white, green and blue. Blue is stocked in every size on this list. Rolls: 10×100, 12×100 and 15×100 ft. Panels as listed below.',
    meta_title: 'Bird Net Noida | White Green Blue | Garg',
    meta_description: 'Bird net in Noida — white, green and blue. Rolls 10, 12 and 15 ft by 100 ft, plus panels. Quote 9910238277.',
    meta_keywords: 'bird net noida, anti bird net, balcony bird net',
    sort_order: 10,
    group: 'animal',
    designs,
    cover_image: content.images.find((i) => /hero/i.test(i)) || content.images[0],
    content_folder: content.folder,
    materials: BIRD_COLOURS,
    guide: [
      {
        id: 'sizes',
        title: 'Rolls and panels',
        body: 'White, green and blue. Blue uses the full size list — it is not limited to one size.',
        tables: [
          [
            ['Rolls', 'Length'],
            ['10 ft wide', '100 ft'],
            ['12 ft wide', '100 ft'],
            ['15 ft wide', '100 ft']
          ],
          [
            ['Panels (ft)', 'Colours'],
            ...BIRD_PANELS.map((p) => [p, 'White · green · blue'])
          ]
        ]
      },
      {
        id: 'faq',
        title: 'Frequently asked questions',
        faqs: [
          { q: 'Is blue only one size?', a: 'No. Blue is available in every roll and panel on this list, same as white and green.' },
          NCR_FAQ
        ]
      }
    ]
  });
}

/** @deprecated Prefer buildBirdCategory / buildMonkeyCategory / buildNetCategory */
function buildCategory() {
  return buildBirdCategory();
}

module.exports = {
  buildCategory,
  buildBirdCategory,
  buildMonkeyCategory,
  buildNetCategory,
  MATERIALS
};
