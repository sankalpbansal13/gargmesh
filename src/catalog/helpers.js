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

module.exports = { slugify, loadContent, guideFromContent, uploadName, mat };
