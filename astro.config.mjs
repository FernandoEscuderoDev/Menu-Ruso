// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://cucharadelmundo.com',
  i18n: {
    locales: ['es', 'en', 'ru'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
    fallback: { en: 'es', ru: 'es' },
  },
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'auto' },
});