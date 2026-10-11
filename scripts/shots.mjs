/**
 * Auditoría visual. Usa el Edge instalado con playwright-core, así que no
 * descarga ningún navegador.
 *
 *   node scripts/shots.mjs [url] [ancho] [alto]
 */
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT = process.env.SHOT_DIR || 'C:/Users/hoopa/AppData/Local/Temp/shots';

const url = process.argv[2] || 'http://localhost:4321/es/';
const width = Number(process.argv[3] || 390);
const height = Number(process.argv[4] || 844);
const tag = process.argv[5] || 'm';

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: EDGE });
const page = await browser.newPage({
  viewport: { width, height },
  deviceScaleFactor: 2,
  isMobile: width < 700,
  hasTouch: width < 700,
});

const problems = [];
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning')
    problems.push(`[${m.type()}] ${m.text().slice(0, 200)}`);
});
page.on('pageerror', (e) => problems.push(`[pageerror] ${e.message.slice(0, 200)}`));

await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
// Deja terminar la intro de GSAP.
await page.waitForTimeout(3500);

const shot = async (name) => {
  await page.screenshot({ path: `${OUT}/${tag}-${name}.png` });
};

// --- estado congelado tras la intro -------------------------------------
const frozen = await page.evaluate(() => {
  const t = (s) => {
    const el = document.querySelector(s);
    return el ? getComputedStyle(el).transform : 'MISSING';
  };
  return {
    lenis: document.documentElement.classList.contains('lenis'),
    heroLine: t('.hero__line-inner'),
    topbar: t('.topbar'),
    catnav: t('.catnav'),
    marquee: t('[data-marquee]'),
    scrollY: window.scrollY,
  };
});

await shot('01-hero');

// --- desbordes ----------------------------------------------------------
const overflow = await page.evaluate(() => {
  const de = document.documentElement;
  const vw = de.clientWidth;
  const bad = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0) continue;
    if (r.right > vw + 1) {
      // ¿está dentro de un contenedor con scroll horizontal?
      let p = el.parentElement, inScroller = false;
      while (p) {
        const ox = getComputedStyle(p).overflowX;
        if (ox === 'auto' || ox === 'scroll' || ox === 'hidden') { inScroller = true; break; }
        p = p.parentElement;
      }
      if (!inScroller)
        bad.push({
          sel: el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0],
          right: Math.round(r.right), w: Math.round(r.width),
        });
    }
  }
  return { vw, scrollW: de.scrollWidth, bad: bad.slice(0, 14) };
});

// --- texto cortado / colisiones -----------------------------------------
const clipping = await page.evaluate(() => {
  const out = [];
  for (const sel of ['.hero__title', '.hero__body', '.hero__script', '.dish__name', '.sechead__title']) {
    for (const el of document.querySelectorAll(sel)) {
      if (el.scrollWidth > el.clientWidth + 1)
        out.push({ sel, over: el.scrollWidth - el.clientWidth, txt: el.textContent.trim().slice(0, 40) });
    }
  }
  return out.slice(0, 10);
});

// --- recorrido por secciones --------------------------------------------
const sections = await page.evaluate(() =>
  [...document.querySelectorAll('[data-section], .featured, #menu > .section, #visitanos, .marquee')].map(
    (el) => ({ id: el.id || el.className.split(' ')[0], top: Math.round(el.getBoundingClientRect().top + window.scrollY) })
  )
);

const shots = [];
for (const s of sections) {
  await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, s.top - 70));
  await page.waitForTimeout(1200);
  const name = s.id.replace(/[^\w-]/g, '').slice(0, 16) || 'sec';
  await shot(name);
  shots.push(name);
}

console.log(JSON.stringify({ url, width, frozen, overflow, clipping, shots, problems }, null, 2));

await browser.close();