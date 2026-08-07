// Extract sections, FAQs, meta, tables from source hub HTML into src/catalog/content JSON.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'src', 'catalog', 'content');
fs.mkdirSync(outDir, { recursive: true });

const TYPES = [
  { folder: 'SS_Welded_Mesh', key: 'ss-welded' },
  { folder: 'Chain_Link_Mesh', key: 'chain-link' },
  { folder: 'Door_Machhar_Jali', key: 'machhar-jali' },
  { folder: 'PVC_Plastic_Jali', key: 'pvc-jali' },
  { folder: 'Bird_Monkey_Spikes', key: 'bird-spikes' }
];

function stripTags(s) {
  return String(s || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h\d|tr)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}

function extractMeta(html, name) {
  const re = new RegExp('<meta\\s+name=["\']' + name + '["\']\\s+content=["\']([^"\']*)["\']', 'i');
  const m = html.match(re);
  return m ? m[1] : '';
}

function extractOg(html, prop) {
  const re = new RegExp('<meta\\s+property=["\']' + prop + '["\']\\s+content=["\']([^"\']*)["\']', 'i');
  const m = html.match(re);
  return m ? m[1] : '';
}

function extractTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].trim() : '';
}

function extractSections(html) {
  const sections = [];
  const re = /<section([^>]*)>([\s\S]*?)<\/section>/gi;
  let m;
  while ((m = re.exec(html))) {
    const attrs = m[1];
    const body = m[2];
    const idM = attrs.match(/\bid=["']([^"']+)["']/i);
    if (!idM) continue;
    const id = idM[1];
    if (['main', 'site-nav', 'on-this-page'].includes(id)) continue;
    const h2m = body.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    const title = h2m ? stripTags(h2m[1]) : id;

    const tables = [];
    const tre = /<table[\s\S]*?<\/table>/gi;
    let tm;
    while ((tm = tre.exec(body))) {
      const rows = [];
      const rre = /<tr[\s\S]*?<\/tr>/gi;
      let rm;
      while ((rm = rre.exec(tm[0]))) {
        const cells = [...rm[0].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((c) => stripTags(c[1]));
        if (cells.length) rows.push(cells);
      }
      if (rows.length) tables.push(rows);
    }

    let text = stripTags(body.replace(/<table[\s\S]*?<\/table>/gi, '\n[TABLE]\n'));
    if (text.length > 10000) text = text.slice(0, 10000) + '...';

    const bullets = [...body.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((x) => stripTags(x[1]))
      .filter((x) => x && x.length > 2 && x.length < 500)
      .slice(0, 50);

    sections.push({
      id,
      title,
      body: text,
      bullets: bullets.length ? bullets : undefined,
      tables: tables.length ? tables : undefined
    });
  }
  return sections;
}

function extractFaqSection(html) {
  const faqs = [];
  const idx = html.indexOf('"@type": "FAQPage"');
  const idx2 = html.indexOf('"@type":"FAQPage"');
  const start = idx >= 0 ? idx : idx2;
  if (start >= 0) {
    const slice = html.slice(start, start + 80000);
    const qas = [...slice.matchAll(/"name"\s*:\s*"((?:\\.|[^"\\])*)"\s*,\s*"acceptedAnswer"\s*:\s*\{\s*"@type"\s*:\s*"Answer"\s*,\s*"text"\s*:\s*"((?:\\.|[^"\\])*)"/g)];
    for (const qa of qas) {
      try {
        faqs.push({ q: JSON.parse('"' + qa[1] + '"'), a: JSON.parse('"' + qa[2] + '"') });
      } catch (e) { /* skip */ }
    }
  }
  const faqSec = html.match(/<section[^>]*id=["']faq["'][^>]*>([\s\S]*?)<\/section>/i);
  if (faqSec) {
    const pairs = [...faqSec[1].matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi)];
    for (const p of pairs) {
      const q = stripTags(p[1]);
      const a = stripTags(p[2]);
      if (q && a && !faqs.some((f) => f.q === q)) faqs.push({ q, a });
    }
    const details = [...faqSec[1].matchAll(/<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)(?=<details|<\/div>|$)/gi)];
    for (const p of details) {
      const q = stripTags(p[1]);
      const a = stripTags(p[2]).slice(0, 1500);
      if (q && a && !faqs.some((f) => f.q === q)) faqs.push({ q, a });
    }
  }
  return faqs;
}

function extractItemList(html) {
  const items = [];
  const m = html.match(/"@type"\s*:\s*"ItemList"[\s\S]*?"itemListElement"\s*:\s*\[([\s\S]*?)\]/);
  if (!m) return items;
  const names = [...m[1].matchAll(/"name"\s*:\s*"((?:\\.|[^"\\])*)"/g)];
  for (const n of names) {
    try { items.push(JSON.parse('"' + n[1] + '"')); } catch (e) { /* skip */ }
  }
  return items;
}

function listImages(folder) {
  const dir = path.join(root, 'source', folder, 'images');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f) && !/logo/i.test(f));
}

for (const t of TYPES) {
  const htmlPath = path.join(root, 'source', t.folder, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    console.error('missing', htmlPath);
    continue;
  }
  const html = fs.readFileSync(htmlPath, 'utf8');
  const sections = extractSections(html);
  const faqs = extractFaqSection(html);
  const itemList = extractItemList(html);
  const data = {
    folder: t.folder,
    key: t.key,
    title: extractTitle(html),
    meta_description: extractMeta(html, 'description') || extractOg(html, 'og:description'),
    meta_keywords: extractMeta(html, 'keywords'),
    og_title: extractOg(html, 'og:title'),
    sections,
    faqs,
    itemList,
    images: listImages(t.folder)
  };
  const out = path.join(outDir, t.key + '.json');
  fs.writeFileSync(out, JSON.stringify(data, null, 2));
  console.log('Wrote', out, 'sections=', sections.length, 'faqs=', faqs.length, 'items=', itemList.length, 'images=', data.images.length);
}
