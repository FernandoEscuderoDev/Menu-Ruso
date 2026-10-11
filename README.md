# Cuchara del Mundo — carta digital

Menú digital de un restaurante ruso. **Astro 7 + GSAP + Lenis**, pensado **mobile-first**
y publicado en tres idiomas: español, inglés y ruso.

```
/es/   español (por defecto)
/en/   inglés
/ru/   ruso
```

---

## Comandos

```bash
npm install
npm run dev          # http://localhost:4321 → redirige a /es/
npm run build
npm run preview
npm run sync:menu    # descarga el menú de Google Sheets
npm run shots        # capturas de todas las secciones + auditoría de layout
```

### `npm run shots`

Auditoría visual. Usa el Edge ya instalado vía `playwright-core` (no descarga
navegador). Recorre la página a 390 px y a 1440 px, captura cada sección y
reporta desbordes horizontales, texto recortado y errores de consola.

```bash
npm run shots                                   # móvil 390 px
node scripts/shots.mjs http://localhost:4321/en/ 390 844 en
```

Las capturas se guardan en `%TEMP%\shots`.

### `npm run audit:text`

Extrae todo el texto visible de `/es`, `/en` y `/ru` y avisa de:
cirílico fuera de la versión rusa, letras de un idioma pegadas dentro de
palabras de otro, espacios dobles, caracteres invisibles (nbsp, zero-width,
bidi) y saltos de línea dentro de un texto.

```bash
npm run audit:text                        # las tres páginas
node scripts/dump-i18n.mjs ru             # vuelca las traducciones para revisar
```

**El cirílico no aparece nunca en `/es` ni en `/en`.** En esas versiones sólo
se muestra el nombre original en español, y únicamente como etiqueta
pequeña, para poder identificar el plato contra la carta física.

## Moneda

Pesos argentinos (ARS), separador de miles con punto: `$13.000`.

Los **tres** idiomas usan el formato argentino. Es a propósito: en una carta
importa que el número se lea igual en las tres versiones, y el symbol del peso
argentino se presta a confusión con el dólar. El símbolo `$` se antepone a mano
porque `Intl` con estilo `currency` en `es-AR` devuelve `$ 13.000` con un espacio
fino que en una carta parece un error de maquetación.

Se cambia en dos sitios de `src/lib/i18n.ts`: `INTL_LOCALE` y `HTML_LANG`
(`es-AR`). Los **números** vienen del Google Sheet, no del código: si los precios
de la hoja estaban en otra moneda, hay que corregirlos allá, no acá.

## Despliegue

`netlify.toml` ya declara el comando de build, la carpeta de publicación (`dist`)
y la versión de Node. Si conectaste el repo antes de crear ese archivo, Netlify
puede seguir con la configuración del panel: revisa en **Site configuration →
Build & deployment** que el comando sea `npm run build` y el directorio de
publicación `dist`.

El build genera `/es/`, `/en/` y `/ru/`; la raíz redirige con 301 a `/es/`.

Para comprobar la build como Netlify la sirve (archivos estáticos, sin Astro):

```bash
npm run build
node scripts/serve-dist.mjs 4399   # http://localhost:4399
```

## Antes de publicar

Estos datos son **inventados**, hay que reemplazarlos:

- **Los precios**: vienen del Google Sheet. La web los muestra como pesos
  argentinos, pero los números son los que estén en la hoja — si estaban en
  otra moneda, corrígelos allá.
- `src/components/Footer.astro` → teléfono, correo y **horarios**
- `astro.config.mjs` → `site:` y el dominio de `public/robots.txt`
- `src/lib/illustrations.ts` → las ilustraciones son recreaciones; cuando
  tengas el arte original, sustituye el grupo `<g>` de cada una
- `src/components/Logo.astro` → recreación; usa `<Logo src="/logos/logo.svg" />`

## De dónde salen los datos

`src/data/menu.csv` es la **única fuente de verdad** y se genera desde Google Sheets:

```bash
npm run sync:menu                       # descarga la hoja pública y la limpia
node scripts/sync-menu.mjs otro.csv     # o procesa un CSV local
```

El script descarta las ~950 filas vacías que Sheets deja al final, normaliza los
encabezados y genera un `slug` estable por producto (los repetidos se numeran:
`shashlik-...`, `shashlik-...-2`). Ese slug es la clave que enlaza con las traducciones.

Columnas esperadas: `seccion, producto, descripcion, precio, disponible, foto`.
Si `Disponible` viene en `FALSE` el plato no aparece. La columna `Foto` es opcional:
cuando la llenas, la tarjeta muestra la imagen (`src/data/menu.csv:1`).

## Traducciones

- **Interfaz** → `src/lib/i18n.ts` (cada clave existe en los tres idiomas).
- **Platos** → `src/data/dish-i18n.json`, indexado por slug, con `n` (nombre) y `d` (descripción).

Si falta una traducción, la web **cae al texto en español** en lugar de romperse.
En las páginas `en` y `ru` cada plato muestra además una etiqueta con su nombre
original y, cuando existe, en cirílico.

```json
"borsch": {
  "en": { "n": "Borscht", "d": "Hot and comforting beetroot soup…" },
  "ru": { "n": "Борщ",       "d": "Горячий и уютный свекольный суп…" }
}
```

## Añadir un plato

1. Añádelo a Google Sheets y corre `npm run sync:menu`.
2. Si es visible en inglés/ruso, agrega su slug a `dish-i18n.json`.
3. Si pertenece a una sección nueva, agrégala a `src/data/categories.ts`
   (el campo `match` debe coincidir **exactamente** con la columna `seccion`).

## Estructura

```
scripts/sync-menu.mjs     Sheet → menu.csv (limpieza + slugs)
src/
├── data/
│   ├── menu.csv           49 platos · 8 secciones
│   ├── categories.ts      orden, títulos i18n, superficie y color de cada sección
│   └── dish-i18n.json     traducciones EN/RU por slug
├── lib/
│   ├── menu.ts            une CSV + traducciones, agrupa y formatea precios
│   ├── i18n.ts            textos de interfaz y formateo por idioma
│   └── illustrations.ts   ilustraciones SVG line-art y blobs
├── components/            TopBar, CatNav, Hero, Featured, MenuSection, DishCard, Footer, Shape, Logo
├── layouts/Base.astro
├── pages/
│   ├── index.astro        redirigido por el middleware de i18n
│   └── [locale]/index.astro
├── scripts/motion.ts      GSAP + Lenis
└── styles/global.css      tokens y componentes (mobile-first)
```

## Diseño

Tokens derivados del style reference: papel crema `#fbf9f6` como lienzo, blanco puro
para las tarjetas e **índigo `#234386` como único color frío**, que es el dueño de
todos los titulares, enlaces y botones. Los cálidos (miel `#ffc400`, naranja `#ed7328`,
arena `#d2b68c`, salvia `#a2d3a6`, cielo `#6aa8dc`) aparecen **sólo** como blobs
orgánicos e ilustraciones line-art, nunca como texto ni relleno de botón.

- Display: **Bebas Neue** (mayúsculas, tracking 0.03em) — tiene cirílico.
- Texto/UI: **Inter** — tiene cirílico.
- Acento manuscrito: **Caveat** — sólo para las frases de la portada.

Dos ajustes que se apartan del reference original, por contraste:

| Token | Valor | Por qué |
|---|---|---|
| `--orange-ink` | `#bd4d0b` | El naranja `#ed7328` sobre crema da 2.8:1; insuficiente para texto pequeño |
| `--orange-deep` | `#bd4d0b` | Blanco sobre `#ed7328` da 3:1; la sección de cócteles usa el tono profundo |

## Movimiento

`src/scripts/motion.ts`, todo en `transform`/`opacity`:

- **Lenis** suaviza la rueda y los saltos de ancla. El scroll táctil **se deja nativo**
  (`syncTouch: false`) porque el de iOS/Android es más preciso que cualquier interpolación.
- Intro de portada: líneas enmascaradas del titular, blobs e ilustración.
- `SplitText` con `mask: 'lines'` + `autoSplit` en los titulares de sección.
- Entrada escalonada de las tarjetas, parallax de blobs e ilustraciones, marquee infinito,
  barra de progreso de lectura y categoría activa en la barra inferior.
- `prefers-reduced-motion` apaga **todo** y ni siquiera se instancia Lenis.

**Regla del proyecto:** los revelados usan `fromTo` con valores explícitos, **nunca
`from`**. Con `from`, si dos tweens tocan el mismo elemento, el segundo graba como
"valor final" lo que el primero dejó puesto (`opacity: 0`) y el elemento se queda
invisible para siempre. Por eso `.dishlist` no lleva `data-reveal="stagger"`: cada
plato se anima sólo con su propio tween `[data-dish]`.

La barra de categorías **no** entra en la línea de tiempo de la intro a propósito: es la
navegación principal y debe ser usable incluso si el ticker de GSAP no llegara a correr.

## Accesibilidad

Lighthouse en los tres idiomas: **accessibility 100, best-practices 100, SEO 100**.

- Objetivos táctiles ≥ 44×44 px (verificado a 375 px).
- `safe-area-inset` para iPhone con notch.
- La barra superior se oculta al bajar y vuelve al subir; la de categorías no se oculta nunca.