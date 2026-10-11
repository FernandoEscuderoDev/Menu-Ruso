/**
 * Ilustraciones line-art estilo grabado/toile.
 * Trazo = currentColor, sin rellenos: el color lo hereda el contenedor.
 * viewBox unificado 0 0 200 200 para poder interchangearlas libremente.
 */

const S = 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';
const T = 'fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"';

/** Sin ruido de coma flotante dentro de los atributos d. */
const n = (v: number) => Math.round(v * 100) / 100;

/**
 * Cúpula de cebolla: ancha en la base y afilada en la punta, como las de
 * San Basilio. `w` es la mitad del ancho, `h` la altura total del cuerpo.
 */
const onion = (cx: number, base: number, h: number, w = 7) => `
  <path ${S} d="M${n(cx - w)} ${base}
     C${n(cx - w)} ${n(base - h * 0.5)} ${n(cx - w * 0.55)} ${n(base - h * 0.95)} ${cx} ${n(base - h)}
     C${n(cx + w * 0.55)} ${n(base - h * 0.95)} ${n(cx + w)} ${n(base - h * 0.5)} ${n(cx + w)} ${base}Z" />
  <path ${T} d="M${n(cx - w * 0.8)} ${n(base - h * 0.42)}h${n(w * 1.6)}" />
  <path ${T} d="M${cx} ${n(base - h)}v${n(-h * 0.26)}M${n(cx - 3.5)} ${n(base - h * 1.2)}h7" />`;

export const ILLUSTRATIONS: Record<string, string> = {
  /* Big Ben + cabina telefónica londinense (como en el menú original) */
  tower: `
    <g ${S}>
      <path d="M62 190V62h40v128" />
      <path d="M56 62h52M54 76h56M54 190h56" />
      <path d="M82 62V26M74 34h16M82 26l-4-6M82 26l4-6" />
      <circle cx="82" cy="104" r="16" />
      <path ${T} d="M82 104V94M82 104l7 5" />
      <path ${T} d="M74 140h16v18H74zM70 172h24v18h-24z" />
      <path ${T} d="M54 76v6M110 76v6M60 128h44M60 134h44" />
      <rect x="140" y="104" width="50" height="86" rx="3" />
      <path ${T} d="M144 104V92h42v12M150 92V78h30v14" />
      <path ${T} d="M147 116h36v62h-36zM165 116v62M147 138h36M147 158h36" />
      <path ${T} d="M154 92h6M160 92h6M166 92h6" />
      <path ${T} d="M136 190h58" />
    </g>`,

  /* Catedral de San Basilio — las catedrales del Kremlin */
  dome: `
    <g ${S}>
      <path d="M10 182h180" />
      <path d="M22 182v-42h32v42" />
      <path d="M146 182v-42h32v42" />
      ${onion(38, 140, 26, 8)}
      ${onion(162, 140, 26, 8)}
      <path d="M56 182v-56h28v56" />
      <path d="M116 182v-56h28v56" />
      ${onion(70, 126, 30, 8)}
      ${onion(130, 126, 30, 8)}
      <path d="M86 182V88h28v94" />
      ${onion(100, 88, 40, 10)}
      <path ${T} d="M90 88h20M90 104h20M90 122h20M90 140h20M90 158h20" />
      <path ${T} d="M60 146h20M60 160h20M120 146h20M120 160h20" />
      <path ${T} d="M26 156h24M150 156h24" />
      <path ${T} d="M30 164h16M154 164h16" />
    </g>`,

  /* Samovar — el samovar del té */
  samovar: `
    <g ${S}>
      <path d="M78 92h44c14 10 18 26 18 40s-6 30-18 38H78c-12-8-18-24-18-38s6-30 18-40Z" />
      <path ${T} d="M68 112h64M64 130h72M66 148h68" />
      <ellipse cx="100" cy="92" rx="22" ry="6" />
      <path d="M100 86V70M88 70h24M96 60h8v10h-8z" />
      <path d="M78 92c-14 2-20 12-18 22M122 92c14 2 20 12 18 22" />
      <path d="M88 170v18M112 170v18M100 172v18" />
      <path ${T} d="M82 176h12M106 176h12M94 178h12" />
      <path ${T} d="M60 140h-10v10h14M140 140h10v10h-14" />
      <path ${T} d="M92 104c-4 8 4 14 0 22M108 104c-4 8 4 14 0 22" />
      <path ${T} d="M96 46c-6 6 2 12-2 18M112 42c-6 6 2 12-2 18" />
    </g>`,

  /* Blini con nata y mermelada */
  blini: `
    <g ${S}>
      <ellipse cx="104" cy="158" rx="54" ry="13" />
      <ellipse cx="104" cy="146" rx="50" ry="12" />
      <ellipse cx="104" cy="134" rx="46" ry="11" />
      <ellipse cx="104" cy="122" rx="42" ry="10" />
      <ellipse cx="104" cy="111" rx="37" ry="9" />
      <path d="M92 102c-8-8 0-18 10-18s18 10 10 18c-6 6-14 6-20 0Z" />
      <path d="M96 96c-4-6 2-12 7-12s10 7 6 12" />
      <circle cx="104" cy="82" r="6" />
      <path ${T} d="M84 146c6 4 12 4 18 0M96 134c6 4 12 4 18 0M88 122c6 4 12 4 18 0" />
      <path ${S} d="M36 130h26v34a13 13 0 0 1-26 0Z" />
      <path ${T} d="M36 142h26M44 130v34M54 130v34M36 156h26" />
      <path ${T} d="M96 62c-6 6 2 12-2 18M120 58c-6 6 2 12-2 18" />
    </g>`,

  /* Taza de café con reloj */
  clock: `
    <g ${S}>
      <circle cx="58" cy="62" r="30" />
      <path ${T} d="M58 42v20l14 9M28 62h-8M88 62h8M58 32V22M58 102v-10" />
      <path d="M46 62h6v12h-6zM64 62h6v12h-6z" />
      <path d="M62 104h76l-8 48c-1 6-6 10-12 10H82c-6 0-11-4-12-10Z" />
      <path d="M138 116c16 0 24 8 24 18s-8 18-22 18" />
      <ellipse cx="100" cy="176" rx="52" ry="9" />
      <path ${T} d="M100 104v-6M120 104v-4M80 104v-4" />
      <path ${T} d="M84 128c-6 6 4 12 0 18M100 128c-6 6 4 12 0 18M116 128c-6 6 4 12 0 18" />
    </g>`,

  /* Coliseo Romano */
  colosseum: `
    <g ${S}>
      <path d="M22 92c0-22 35-38 78-38s78 16 78 38v82H22Z" />
      <path ${T} d="M22 92c0 22 35 38 78 38s78-16 78-38" />
      <path ${T} d="M32 118h136M30 144h140M30 174h140" />
      <path ${T} d="M38 92v26M60 100v18M84 104v14M116 104v14M140 100v18M162 92v26" />
      <path ${T} d="M34 118v26M56 118v26M78 118v26M122 118v26M144 118v26M166 118v26" />
      <path ${T} d="M32 144v30M54 144v30M76 144v30M124 144v30M146 144v30M168 144v30" />
      <path ${T} d="M44 74c4-10 20-16 32-17M156 74c-4-10-20-16-32-17" />
    </g>`,

  /* Izba rusa con tallas de madera */
  tavern: `
    <g ${S}>
      <path d="M24 108l76-46 76 46" />
      <path ${T} d="M32 100l68-41 68 41M44 88l56-33 56 33" />
      <path d="M36 108h128v66H36Z" />
      <path ${T} d="M36 120h128M36 134h128M36 148h128M36 162h128" />
      <path d="M124 74V54h16v12" />
      <path ${T} d="M128 46c-5 5 3 9-1 13M138 44c-5 5 3 9-1 13" />
      <path d="M70 174v-32h34v32" />
      <path ${T} d="M74 174v-28h26v28M87 146v28M74 160h26" />
      <path d="M48 132h20v20H48zM44 132v-6h28v6M44 152v6h28v-6" />
      <path ${T} d="M58 132v20M48 142h20" />
      <path ${T} d="M118 136h22v22h-22zM114 136v-6h30v6M132 136v22M118 147h22" />
    </g>`,

  /* Coctel con horizonte de catedrales */
  martini: `
    <g ${S}>
      <path d="M52 56h96l-42 58v34h20c4 0 6 3 6 6H68c0-3 2-6 6-6h20v-34Z" />
      <path ${T} d="M66 76h68M60 66h80" />
      <path d="M96 96c-8 0-14-6-14-12" />
      <path d="M140 50a16 16 0 0 1 0 26 16 16 0 0 1 0-26Z" />
      <path ${T} d="M140 50v26M132 58h16M134 68h12" />
      <circle cx="148" cy="44" r="5" />
      <path ${T} d="M14 186V160h16v26M40 186v-36h14v36M62 186v-22h12v22" />
      <path d="M146 186v-40h14v40M168 186v-30h12v30M128 186v-18h12v18" />
      <path ${T} d="M14 186h172" />
    </g>`,

  /* Boles y cuchara — motivo genérico de la casa */
  spoon: `
    <g ${S}>
      <path d="M56 78c-14 0-26 12-26 28s12 30 26 30 26-14 26-30-12-28-26-28Z" />
      <path ${T} d="M56 88v40M40 108h32" />
      <path d="M82 118c14 0 26 12 26 28s-12 30-26 30-26-14-26-30 12-28 26-28Z" />
      <path d="M130 96l46-58" />
      <ellipse cx="176" cy="34" rx="13" ry="17" transform="rotate(38 176 34)" />
      <path ${T} d="M130 96l46-58" />
      <path ${T} d="M40 178c14-8 30-8 44 0M36 166c16-10 34-10 50 0" />
    </g>`,
};

/* -------------------------------------------------------------------------
   Blobs orgánicos — rellenos sólidos, nunca degradados.
   Las trayectorias están dentro del viewBox para que no aparezcan cortes
   rectos al recortarlas con overflow:hidden.
   ------------------------------------------------------------------------- */

export const BLOBS: Record<string, string> = {
  a: 'M74 6C108 2 150 16 172 44c22 28 22 72 4 102-18 30-58 48-94 44-36-4-70-26-78-62-8-36 16-72 46-88C60 34 62 8 74 6Z',
  b: 'M58 10c34-10 76 0 100 22 24 22 34 62 20 94-14 32-52 54-86 50-34-4-70-24-82-58C-2 84 24 20 58 10Z',
  c: 'M80 4c34 0 72 18 92 44 20 26 22 68 4 96-18 28-56 46-90 44-34-2-68-20-80-52-12-32 8-70 38-90C60 36 62 4 80 4Z',
  d: 'M66 8c30-8 70 4 94 28 24 24 34 64 20 94-14 30-52 52-86 50-34-2-68-20-82-52-14-32 4-72 32-94C56 28 50 12 66 8Z',
};

/** Divisoria ondulada entre secciones. */
export const WAVE = 'M0 62C150 22 250 102 400 62c150-40 250 40 400 0v78H0Z';