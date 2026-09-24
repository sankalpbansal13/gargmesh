const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function loadContent(key) {
  return require('./content/' + key + '.json');
}

/** Convert extracted hub JSON into guide_sections array for category pages. */
function guideFromContent(content) {
  const sections = (content.sections || [])
    .filter((s) => s && s.id && s.title && s.id !== 'gallery')
    .map((s) => ({
      id: s.id,
      title: s.title,
      body: s.body || '',
      bullets: s.bullets || undefined,
      tables: s.tables || undefined
    }));

  if (content.faqs && content.faqs.length) {
    sections.push({
      id: 'faq',
      title: 'Frequently asked questions',
      body: 'Answers from our product buying guide.',
      faqs: content.faqs
    });
  }

  if (content.images && content.images.length) {
    sections.push({
      id: 'gallery',
      title: 'Product gallery',
      body: 'Photos from our Noida factory and site supply.',
      images: content.images.map((f) => ({
        filename: f,
        src: '/uploads/' + uploadName(content.folder, f),
        alt: content.og_title || content.title || 'Product photo'
      }))
    });
  }

  return sections;
}

function uploadName(folder, filename) {
  const prefix = slugify(folder).replace(/_/g, '-');
  return prefix + '-' + filename.replace(/\s+/g, '-');
}

function mat(slug, name, grades, short_desc, extra = {}) {
  return {
    slug,
    name,
    grades,
    short_desc,
    price_from: 'Ask for quote',
    sort_order: extra.sort_order || 1,
    best_for: extra.best_for || short_desc,
    standards: extra.standards || grades,
    temper_note: extra.temper_note || '',
    detail: extra.detail || short_desc
  };
}

const NCR_FAQ = {
  q: 'Do you deliver in Delhi NCR?',
  a: 'Yes — from G-25, Sector 9, Noida across Noida, Greater Noida, Delhi, Ghaziabad, Faridabad and Gurugram. Call or WhatsApp 9910238277.'
};

/** One wizard design (step 2). Materials are copied so each design owns its list. */
function sku(partial) {
  const faqs = partial.faqs && partial.faqs.length ? partial.faqs : [NCR_FAQ];
  return {
    slug: partial.slug,
    name: partial.name,
    hole_shape: partial.hole_shape == null ? null : partial.hole_shape,
    hole_mm: partial.hole_mm == null ? null : partial.hole_mm,
    pitch_mm: partial.pitch_mm == null ? null : partial.pitch_mm,
    angle_deg: partial.angle_deg == null ? null : partial.angle_deg,
    open_area_pct: null,
    short_desc: partial.short_desc,
    description: partial.description,
    applications: partial.applications || '',
    faq: JSON.stringify(faqs),
    meta_title: partial.meta_title,
    meta_description: partial.meta_description,
    meta_keywords: partial.meta_keywords || '',
    sort_order: partial.sort_order,
    featured: partial.featured ? 1 : 0,
    materials: (partial.materials || []).map((m) => ({ ...m })),
    spec_kind: partial.spec_kind || ''
  };
}

/** Category shell stored by seed (step 1). */
function hub(partial) {
  return {
    slug: partial.slug,
    name: partial.name,
    short_desc: partial.short_desc,
    description: partial.description,
    guide_sections: JSON.stringify(partial.guide || []),
    meta_title: partial.meta_title,
    meta_description: partial.meta_description,
    meta_keywords: partial.meta_keywords || '',
    sort_order: partial.sort_order,
    featured: partial.featured == null ? 1 : (partial.featured ? 1 : 0),
    group: partial.group || 'sheet',
    designs: partial.designs,
    cover_image: partial.cover_image || null,
    content_folder: partial.content_folder || null,
    materials_catalog: partial.materials || []
  };
}

module.exports = { slugify, loadContent, guideFromContent, uploadName, mat, sku, hub, NCR_FAQ };
