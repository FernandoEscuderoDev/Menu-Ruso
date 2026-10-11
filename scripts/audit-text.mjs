/**
 * Auditoría de texto: extrae todo el texto visible de cada idioma y busca
 *  · caracteres cirílicos fuera de la versión en ruso
 *  · caracteres de otro idioma incrustados dentro de palabras
 *  · doble espacio, espacios Led, caracteres de control
 *  · mezcla de mayúsculas dentro de una misma palabra
 */
import { chromium } from 'playwright-core';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE = process.argv[2] || 'http://localhost:4321';

const SCRIPTS = {
  ru: /[Ѐ-ӿ]+/,
  latin: /[A-Za-zÀ-ÿ]/,
};

const browser = await chromium.launch({ executablePath: EDGE });

for (const locale of ['es', 'en', 'ru']) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await page.goto(`${BASE}/${locale}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);

  const data = await page.evaluate(() => {
    const out = {};
    const grab = (sel) =>
      [...document.querySelectorAll(sel)]
        .map((e) => e.textContent.replace(/\s+/g, ' ').trim())
        .filter(Boolean);

    out.heroTitle = grab('.hero__title span[data-hero-line]');
    out.heroEyebrow = grab('.hero__eyebrow');
    out.heroScript = grab('.hero__script');
    out.heroBody = grab('.hero__body');
    out.buttons = grab('.btn');
    out.featuredTitle = grab('.featured__title');
    out.featuredEyebrow = grab('.featured__eyebrow');
    out.fcardCat = grab('.fcard__cat');
    out.menuTitle = grab('.menuintro__title');
    out.menuBody = grab('.menuintro__body');
    out.menuStat = grab('.menuintro__stat');
    out.sectionTitles = grab('.sechead__title');
    out.sectionKickers = grab('.sechead__kicker');
    out.catnav = grab('.catnav__item');
    out.dishNames = grab('.dish__name');
    out.dishTags = grab('.dish__meta .tag');
    out.footerTitle = grab('.footer__title');
    out.footerBody = grab('.footer__body');
    out.footerLabels = grab('.footer__label');
    out.footerValues = grab('.footer__value');
    out.footerLegal = grab('.footer__legal');
    out.marquee = grab('.marquee__item');
    return out;
  });

  // --- chequeos ---------------------------------------------------------
  const problems = [];
  const walk = (obj, path = '') => {
    for (const [k, v] of Object.entries(obj)) {
      if (!Array.isArray(v)) continue;
      for (const s of v) {
        const where = `${path}${k}: "${s}"`;
        if (locale !== 'ru' && SCRIPTS.ru.test(s))
          problems.push(`CIRILICO_IN_${locale.toUpperCase()}  ${where}`);
        if (locale === 'ru' && /\b(de|del|la|el|con|para)\b/i.test(s) && !/[Ѐ-ӿ]/.test(s))
          problems.push(`SIN_CIRILICO_EN_RU  ${where}`);
        if (/\s{2,}/.test(s)) problems.push(`ESPACIOS  ${where}`);
        if (/[\u00a0\u200b\u200e\u200f]/.test(s)) problems.push(`CARACTER_OCULTO  ${where}`);
        if (/[A-Za-z][Ѐ-ӿ]|[Ѐ-ӿ][A-Za-z]/.test(s))
          problems.push(`MIX_ESC_RU  ${where}`);
        if (/\S\n|\n\S/.test(s)) problems.push(`SALTO_LINEA  ${where}`);
        if (/[a-záéíóúñ][A-ZÁÉÍÓÚÑ]/.test(s))
          problems.push(`CAMBIOS_CASO  ${where}`);
      }
    }
  };
  walk(data);

  console.log(`\n===== ${locale.toUpperCase()} =====`);
  console.log(
    'muestra: ' +
      JSON.stringify(
        {
          heroTitle: data.heroTitle,
          sectionTitles: data.sectionTitles,
          footerLabels: data.footerLabels,
        },
        null,
        0
      )
  );
  console.log(
    `nombres de plato (${data.dishNames.length}): ${JSON.stringify(data.dishNames.slice(0, 6))}`
  );
  console.log(
    `etiquetas (${data.dishTags.length}): ${JSON.stringify([...new Set(data.dishTags)].slice(0, 6))}`
  );
  console.log(problems.length ? `PROBLEMAS:\n  ${problems.join('\n  ')}` : 'sin problemas');

  await page.close();
}

await browser.close();