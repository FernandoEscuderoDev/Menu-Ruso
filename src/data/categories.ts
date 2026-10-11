/**
 * Metadatos de cada sección del menú.
 *
 * El orden de este array es el orden de aparición en la página, y `match`
 * debe coincidir exactamente con la columna `seccion` de src/data/menu.csv.
 *
 * surface  — fondo de la sección (cream | white | indigo | orange)
 * art      — clave de la ilustración SVG (ver components/Illustrations.astro)
 */

export type Locale = 'es' | 'en' | 'ru';
export type Surface = 'cream' | 'white' | 'indigo' | 'orange';

export interface Category {
  id: string;
  match: string;
  art: string;
  surface: Surface;
  /** Color del blob decorativo que acompaña la ilustración. */
  blob: 'gold' | 'orange' | 'sage' | 'sand' | 'sky';
  label: Record<Locale, string>;
  kicker: Record<Locale, string>;
}

export const CATEGORIES: Category[] = [
  {
    id: 'aperitivos',
    match: 'Aperitivos y Ensaladas',
    art: 'tower',
    surface: 'white',
    blob: 'sage',
    label: { es: 'Aperitivos y Ensaladas', en: 'Starters & Salads', ru: 'Закуски и салаты' },
    kicker: {
      es: 'Para empezar con un poquito de mundo',
      en: 'A little taste of the world to begin',
      ru: 'Немного мира на старте',
    },
  },
  {
    id: 'sopas',
    match: 'Sopas',
    art: 'dome',
    surface: 'cream',
    blob: 'gold',
    label: { es: 'Sopas', en: 'Soups', ru: 'Супы' },
    kicker: {
      es: 'Caldos queabbrigan el alma',
      en: 'Broths that warm the soul',
      ru: 'Супы, согревающие душу',
    },
  },
  {
    id: 'principales',
    match: 'Platos Principales',
    art: 'samovar',
    surface: 'indigo',
    blob: 'orange',
    label: { es: 'Platos Principales', en: 'Main Courses', ru: 'Основные блюда' },
    kicker: {
      es: 'El corazón de la mesa',
      en: 'The heart of the table',
      ru: 'Сердце стола',
    },
  },
  {
    id: 'postres',
    match: 'Postres',
    art: 'blini',
    surface: 'white',
    blob: 'sand',
    label: { es: 'Postres', en: 'Desserts', ru: 'Десерты' },
    kicker: {
      es: 'El final dulce del viaje',
      en: 'The sweet end of the journey',
      ru: 'Сладкий финал путешествия',
    },
  },
  {
    id: 'cafe',
    match: 'Café y Té',
    art: 'clock',
    surface: 'cream',
    blob: 'sand',
    label: { es: 'Café y Té', en: 'Coffee & Tea', ru: 'Кофе и чай' },
    kicker: {
      es: 'La pausa que todos merecemos',
      en: 'The pause everyone deserves',
      ru: 'Пауза, которую все заслужили',
    },
  },
  {
    id: 'refrescos',
    match: 'Bebidas Refrescantes',
    art: 'colosseum',
    surface: 'white',
    blob: 'sky',
    label: {
      es: 'Bebidas Refrescantes',
      en: 'Soft Drinks',
      ru: 'Безалкогольные напитки',
    },
    kicker: {
      es: 'Frío, gasoso y sin remordimientos',
      en: 'Cold, fizzy and guilt-free',
      ru: 'Холодное, газированное и без совести',
    },
  },
  {
    id: 'alcohol',
    match: 'Bebidas con alcohol',
    art: 'tavern',
    surface: 'cream',
    blob: 'gold',
    label: {
      es: 'Bebidas con Alcohol',
      en: 'Alcoholic Drinks',
      ru: 'Алкогольные напитки',
    },
    kicker: {
      es: 'Un brindis por el camino',
      en: 'A toast for the road',
      ru: 'Тост за дорогу',
    },
  },
  {
    id: 'cocteles',
    match: 'Cócteles',
    art: 'martini',
    surface: 'orange',
    blob: 'sage',
    label: { es: 'Cócteles', en: 'Cocktails', ru: 'Коктейли' },
    kicker: {
      es: 'La última parada, la más animada',
      en: 'The last stop, the liveliest one',
      ru: 'Последняя остановка, самая бурная',
    },
  },
];

/** Slugs destacados que aparecen en el carrusel de la portada. */
export const FEATURED = [
  'borsch',
  'shashlik-de-cerdo-marinado-a-la-parrilla',
  'khinkali-empanadillas-georgianas',
  'solianka-sopa-tradicional',
  'plov-uzbeko-con-ensalada-achichuk',
  'pelmeni',
];