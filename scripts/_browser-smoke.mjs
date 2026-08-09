import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const base = 'http://127.0.0.1:3000';
const outDir = path.join(process.cwd(), 'audit-screenshots', 'plan-review');
fs.mkdirSync(outDir, { recursive: true });

const results = [];
function pass(name, detail = '') { results.push({ name, ok: true, detail }); console.log('PASS', name, detail); }
function fail(name, detail = '') { results.push({ name, ok: false, detail }); console.log('FAIL', name, detail); }

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

try {
  await page.goto(base + '/products', { waitUntil: 'networkidle' });
  const groups = await page.locator('.wiz-group-title').allTextContents();
  if (groups.some((t) => /Sheet/i.test(t)) && groups.some((t) => /Animal/i.test(t))) pass('step1-groups', groups.join(' | '));
  else fail('step1-groups', JSON.stringify(groups));
  const selectCta = await page.locator('.wiz-card-cta').count();
  if (selectCta === 0) pass('no-select-cta'); else fail('no-select-cta', String(selectCta));
  await page.screenshot({ path: path.join(outDir, '01-products.png'), fullPage: true });

  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const homePerf = await page.locator('a[href*="perforated-"]').count();
  if (homePerf >= 3) pass('home-3-perforated', String(homePerf)); else fail('home-3-perforated', String(homePerf));
  await page.screenshot({ path: path.join(outDir, '02-home.png'), fullPage: true });

  await page.goto(base + '/products/ss-welded-mesh', { waitUntil: 'networkidle' });
  const tableBefore = await page.locator('.hub-table-block').count();
  const pathText = await page.locator('.wiz-path').textContent();
  if (tableBefore > 0) pass('welded-table-first'); else fail('welded-table-first');
  if (/Welded Mesh/i.test(pathText || '') || /Welded Mesh/i.test(await page.title())) pass('welded-title');
  else fail('welded-title', pathText);
  await page.screenshot({ path: path.join(outDir, '03-welded.png'), fullPage: true });

  await page.goto(base + '/products/ss-welded-mesh/ss-welded-01', { waitUntil: 'networkidle' });
  const body = await page.content();
  if (/Weight \(GI\)/.test(body) && /confirm on quote/.test(body)) pass('gi-weight-row');
  else fail('gi-weight-row');
  if (/Mild Steel/.test(body) && /GI/.test(body)) pass('welded-materials'); else fail('welded-materials');
  await page.screenshot({ path: path.join(outDir, '04-welded-design.png'), fullPage: true });

  await page.goto(base + '/products/expanded-mesh/triton', { waitUntil: 'networkidle' });
  const t = await page.content();
  if (t.includes('75 mm') && t.includes('15 mm') && t.includes('8 mm')) pass('triton-specs');
  else fail('triton-specs');
  await page.screenshot({ path: path.join(outDir, '05-triton.png'), fullPage: true });

  await page.goto(base + '/products/monkey-spikes/monkey-spikes', { waitUntil: 'networkidle' });
  const m = await page.content();
  if (/studio-monkey-spikes-pc\.png/.test(m) && !/studio-monkey-spikes-metal\.png/.test(m)) pass('monkey-plastic-only');
  else fail('monkey-plastic-only');
  if (/Polycarbonate/.test(m) && !/Stainless Steel 304/.test(m)) pass('monkey-material');
  else fail('monkey-material');
  await page.screenshot({ path: path.join(outDir, '06-monkey.png'), fullPage: true });

  await page.goto(base + '/products/pvc-plastic-jali/pvc-jali-01', { waitUntil: 'networkidle' });
  const p = await page.content();
  const need = ['pvc-closeup', 'pvc-rolls', 'pvc-hero-rolls', 'pvc-construction', 'pvc-tree-guard', 'pvc-rain-fence', 'pvc-garden'];
  const missing = need.filter((n) => !p.includes(n));
  if (!missing.length) pass('pvc-7-pack'); else fail('pvc-7-pack', missing.join(','));
  await page.screenshot({ path: path.join(outDir, '07-pvc.png'), fullPage: true });

  // Wizard flow: products -> category -> design
  await page.goto(base + '/products', { waitUntil: 'networkidle' });
  await page.click('a[href="/products/bird-spikes"]');
  await page.waitForURL('**/products/bird-spikes');
  await page.click('a[href*="/products/bird-spikes/"]');
  await page.waitForURL('**/products/bird-spikes/**');
  const step3 = await page.locator('.wiz-kicker').textContent();
  if (/Step 3/.test(step3 || '')) pass('wizard-flow'); else fail('wizard-flow', step3);
  await page.screenshot({ path: path.join(outDir, '08-wizard-bird.png'), fullPage: true });

  // Card slider attribute present on expanded
  await page.goto(base + '/products/expanded-mesh', { waitUntil: 'networkidle' });
  const sliders = await page.locator('[data-card-slider]').count();
  if (sliders > 0) pass('step2-auto-slider', String(sliders)); else fail('step2-auto-slider');
  await page.screenshot({ path: path.join(outDir, '09-expanded.png'), fullPage: true });
} catch (e) {
  fail('browser-crash', e.message);
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.ok);
console.log('\n=== SUMMARY ===');
console.log('passed', results.filter((r) => r.ok).length, 'failed', failed.length);
if (failed.length) {
  failed.forEach((f) => console.log('-', f.name, f.detail));
  process.exit(1);
}
