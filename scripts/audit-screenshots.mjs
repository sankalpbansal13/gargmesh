import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

const BASE = 'http://localhost:3000';
const OUT = join(process.cwd(), 'audit-screenshots');
mkdirSync(OUT, { recursive: true });

const pages = [
  { name: 'home', path: '/' },
  { name: 'products', path: '/products' },
  { name: 'monkey-spikes', path: '/products/monkey-spikes' },
  { name: 'ss-welded-mesh', path: '/products/ss-welded-mesh' },
  { name: 'contact', path: '/contact' },
];

const viewports = [
  { label: 'mobile', width: 390, height: 844 },
  { label: 'desktop', width: 1280, height: 900 },
];

const browser = await chromium.launch();
for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  for (const p of pages) {
    await page.goto(BASE + p.path, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(600);
    // Trigger IntersectionObserver scroll reveals before full-page capture
    await page.evaluate(async () => {
      const delay = (ms) => new Promise((r) => setTimeout(r, ms));
      const step = Math.max(window.innerHeight * 0.7, 400);
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await delay(120);
      }
      window.scrollTo(0, 0);
      await delay(200);
      document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => {
        el.classList.add('is-visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    });
    await page.waitForTimeout(400);
    const file = join(OUT, `${p.name}-${vp.label}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log('saved', file);
  }
  await context.close();
}
await browser.close();
