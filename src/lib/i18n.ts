import type { Locale } from '../data/categories';

export const LOCALES: Locale[] = ['es', 'en', 'ru'];
export const DEFAULT_LOCALE: Locale = 'es';

export const isLocale = (v: unknown): v is Locale =>
  typeof v === 'string' && (LOCALES as string[]).includes(v);

export const LOCALE_LABEL: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  ru: 'Русский',
};

/** Etiqueta corta para el selector de la barra superior. */
export const LOCALE_SHORT: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
  ru: 'RU',
};

/** `lang` del atributo HTML, con región para es/en. */
export const HTML_LANG: Record<Locale, string> = {
  es: 'es-AR',
  en: 'en',
  ru: 'ru',
};

/**
 * Formateo de precios: pesos argentinos (ARS).
 *
 * Los tres idiomas usan el separador argentino (punto para los miles) a
 * propósito: en una carta es más importante que el número se lea igual en las
 * tres versiones que que siga la convención del idioma de quien lee. El símbolo
 * se antepone a mano porque `Intl` en es-AR mete un espacio fino ($ 13.000)
 * y `currencyDisplay` varía según el navegador.
 */
export const INTL_LOCALE: Record<Locale, string> = {
  es: 'es-AR',
  en: 'es-AR',
  ru: 'es-AR',
};

export const CURRENCY = 'ARS';

type Dict = Record<string, Record<Locale, string>>;

/** Textos de interfaz. Cada clave existe en los tres idiomas. */
export const UI: Dict = {
  'nav.menu': { es: 'Menú', en: 'Menu', ru: 'Меню' },
  'nav.visit': { es: 'Visitanos', en: 'Visit us', ru: 'Приходите' },
  'nav.language': { es: 'Idioma', en: 'Language', ru: 'Язык' },

  'hero.eyebrow': {
    es: 'Cocina de casa · Comida del mundo',
    en: 'Home cooking · Food of the world',
    ru: 'Домашняя кухня · Еда со всего мира',
  },
  'hero.title1': { es: 'Un recorrido', en: 'A journey', ru: 'Путешествие' },
  'hero.title2': { es: 'por el mundo', en: 'around the', ru: 'по миру' },
  'hero.title3': { es: 'en un plato', en: 'world on a plate', ru: 'на одной тарелке' },
  'hero.script': {
    es: 'Sopa, cariño y tradición, servidas calientes',
    en: 'Soup, affection and tradition, served hot',
    ru: 'Суп, любовь и традиция — горячими',
  },
  'hero.body': {
    es: 'Cocina de casa de Siberia, Georgia y Asia Central, cocida a fuego lento y servida con la hospitalidad de una casa rusa.',
    en: 'Home cooking from Siberia, Georgia and Central Asia, slow-cooked and served with the hospitality of a Russian home.',
    ru: 'Домашняя кухня Сибири, Грузии и Центральной Азии — томленая и поданная с гостеприимством русского дома.',
  },
  'hero.cta': { es: 'Ver el menú', en: 'See the menu', ru: 'Смотреть меню' },
  'hero.scroll': { es: 'Desliza', en: 'Scroll', ru: 'Листайте' },

  'featured.eyebrow': { es: 'Los imprescindibles', en: 'The essentials', ru: 'Главное' },
  'featured.title': {
    es: 'Si no puedes pedir todo, pide esto',
    en: 'If you cannot order it all, order this',
    ru: 'Если не заказать всё — закажите это',
  },

  'menu.eyebrow': { es: 'La carta completa', en: 'The full menu', ru: 'Полное меню' },
  'menu.title': {
    es: 'Ocho países, una sola mesa',
    en: 'Eight countries, one table',
    ru: 'Восемь стран, один стол',
  },
  'menu.body': {
    es: 'Del borsch a la domra: cada sección es un viaje distinto. Desliza las categorías o tócalas abajo.',
    en: 'From borscht to domra: each section is a different trip. Swipe the categories or tap them below.',
    ru: 'От борща до домры: каждый раздел — отдельное путешествие. Листайте категории или касайтесь их ниже.',
  },

  'section.dishes': { es: 'platos', en: 'dishes', ru: 'блюд' },

  'footer.title': {
    es: 'Cuando la mesa esté puesta',
    en: 'When the table is set',
    ru: 'Когда стол накрыт',
  },
  'footer.body': {
    es: 'Te esperamos. Avísanos si vienes en grupo grande o tienes alguna alergia: cocinamos con cuidado cada plato.',
    en: 'Come and join us. Let us know if you are a large group or have any allergies — we cook every dish with care.',
    ru: 'Будем рады видеть вас. Предупредите, если вы большой компанией или у вас есть аллергии — мы готовим каждое блюдо с вниманием.',
  },
  'footer.hours': { es: 'Horarios', en: 'Opening hours', ru: 'Часы работы' },
  'footer.hoursValue': {
    es: 'Mar — Dom · 12:00 — 23:00',
    en: 'Tue — Sun · 12:00 — 23:00',
    ru: 'Вт — Вс · 12:00 — 23:00',
  },
  'footer.contact': { es: 'Contacto', en: 'Contact', ru: 'Контакты' },
  'footer.top': { es: 'Volver arriba', en: 'Back to top', ru: 'Наверх' },
  'footer.legal': {
    es: 'Precios en pesos argentinos (ARS). IVA incluido.',
    en: 'Prices in Argentine pesos (ARS). VAT included.',
    ru: 'Цены в аргентинских песо (ARS). НДС включён.',
  },

  'a11y.skip': { es: 'Saltar al menú', en: 'Skip to menu', ru: 'Перейти к меню' },
  'a11y.categories': { es: 'Categorías del menú', en: 'Menu categories', ru: 'Категории меню' },
  'a11y.progress': { es: 'Progreso de lectura', en: 'Reading progress', ru: 'Прогресс чтения' },
};

export function t(key: keyof typeof UI, locale: Locale): string {
  return UI[key]?.[locale] ?? UI[key]?.es ?? key;
}