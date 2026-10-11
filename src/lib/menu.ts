import { parse } from 'csv-parse/sync';
import menuCsv from '../data/menu.csv?raw';
import dishI18nJson from '../data/dish-i18n.json?raw';
import { CATEGORIES, FEATURED, type Category, type Locale } from '../data/categories';
import { INTL_LOCALE } from './i18n';

type Row = Record<string, string>;
type I18nEntry = { n?: string; d?: string };
type I18nFile = Record<string, Record<string, I18nEntry | undefined>>;

const rows = parse(menuCsv, {
  columns: (h: string[]) => h.map((c) => c.trim().toLowerCase()),
  skip_empty_lines: true,
  trim: true,
}) as Row[];

const dict = JSON.parse(dishI18nJson) as I18nFile;

/** "$13.000" -> 13000 */
function parsePrice(raw: string): number {
  const n = Number(String(raw).replace(/[^\d]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

/** Convierte "Tiempo de preparación: ~20 min" en un badge suelto. */
function extractPrepTime(text: string): { text: string; prep?: string } {
  const m = text.match(/tiempo de preparación:?\s*~?(\d+)\s*(min|minutos)\s*/i);
  if (!m) return { text: text.trim() };
  const prep = `~${m[1]} min`;
  const rest = text.replace(m[0], '').trim();
  return { text: rest, prep };
}

export interface Dish {
  slug: string;
  /** Slug original del CSV, antes de resolver la traducción. */
  id: string;
  categoryId: string;
  /** Nombre de la categoría ya traducido, para las tarjetas. */
  categoryLabel: string;
  /** Nombre y descripción ya resueltos para el idioma pedido. */
  name: string;
  description: string;
  /** Texto original en español, siempre disponible. */
  nameEs: string;
  price: number;
  priceLabel: string;
  prep?: string;
  photo?: string;
}

export interface Section {
  category: Category;
  index: number;
  dishes: Dish[];
}

function buildDish(row: Row, locale: Locale, category: Category): Dish {
  const slug = row.slug;
  const entry = dict[slug]?.[locale];
  const nameEs = row.producto;

  const { text: descRaw, prep } = extractPrepTime(
    locale === 'es' ? row.descripcion : entry?.d || row.descripcion
  );

  const name = entry?.n || nameEs;

  const price = parsePrice(row.precio);
  // Signo + separador de miles del idioma. "Intl currency" en ru-CO rinde
  // "13 000 COP", que en una carta se lee raro; aquí queda siempre "$13 000".
  const priceLabel = `$${new Intl.NumberFormat(INTL_LOCALE[locale], {
    maximumFractionDigits: 0,
  }).format(price)}`;

  return {
    slug,
    id: slug,
    categoryId: category.id,
    categoryLabel: category.label[locale],
    name,
    description: descRaw.trim(),
    nameEs,
    price,
    priceLabel,
    prep,
    photo: row.foto || undefined,
  };
}

/** Menú completo, ya agrupado y en el orden de CATEGORIES. */
export function getMenu(locale: Locale): Section[] {
  return CATEGORIES.map((category, index) => {
    const dishes = rows
      .filter((r) => r.seccion === category.match)
      .map((r) => buildDish(r, locale, category));

    return { category, index, dishes };
  }).filter((s) => s.dishes.length > 0);
}

export function getFeatured(locale: Locale): Dish[] {
  const all = getMenu(locale).flatMap((s) => s.dishes);
  const picked = FEATURED.map((slug) => all.find((d) => d.slug === slug)).filter(
    (d): d is Dish => Boolean(d)
  );

  // Si la lista de destacados queda corta, se completa con los primeros platos.
  if (picked.length < 6) {
    for (const d of all) {
      if (picked.length >= 6) break;
      if (!picked.some((p) => p.slug === d.slug)) picked.push(d);
    }
  }
  return picked;
}

export function getCounts(locale: Locale) {
  const sections = getMenu(locale);
  return {
    sections: sections.length,
    dishes: sections.reduce((n, s) => n + s.dishes.length, 0),
  };
}