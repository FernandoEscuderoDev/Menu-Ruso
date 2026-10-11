/**
 * Motor de movimiento: Lenis (scroll suave) + GSAP ScrollTrigger.
 *
 * Diseño mobile-first:
 *  · el scroll táctil se deja nativo (`syncTouch: false`) porque el scroll
 *    nativo de iOS/Android es más preciso que cualquier interpolación;
 *  · Lenis sólo suaviza la rueda (ratón/trackpad) y los saltos de ancla;
 *  · todo se anima en transform/opacity para no provocar layout en móvil;
 *  · si el usuario pide menos movimiento, se apaga todo y no se instancia Lenis.
 *
 * REGLA IMPORTANTE: los revelados usan `fromTo` con valores explícitos, nunca
 * `from`. Con `from`, si dos tweens tocan el mismo elemento, el segundo graba
 * como "valor final" lo que el primero dejó puesto (opacity 0) y el elemento
 * se queda invisible para siempre.
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ==========================================================================
   1. Scroll suave
   ========================================================================== */

let lenis: Lenis | null = null;

if (!REDUCED) {
  lenis = new Lenis({
    lerp: 0.11,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
    syncTouch: false, // scroll táctil nativo
    autoRaf: false, // lo maneja gsap.ticker
    anchors: { offset: -140 },
    // Los carruseles horizontales gestionan su propio scroll.
    prevent: (node) => node.hasAttribute?.('data-lenis-prevent') ?? false,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/** Helper para los enlaces internos que no pasan por `anchors`. */
function scrollTo(target: string | HTMLElement, offset = -140) {
  if (lenis) lenis.scrollTo(target, { offset });
  else {
    const el =
      typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    el?.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
  }
}

/* ==========================================================================
   2. Intro de la portada
   ========================================================================== */

function heroIntro() {
  const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]');

  // Envuelve el texto de cada línea para poder enmascararlo (overflow hidden).
  lines.forEach((el) => {
    if (el.querySelector('.hero__line-inner')) return; // no reenvolver
    const inner = document.createElement('span');
    inner.className = 'hero__line-inner';
    inner.textContent = el.textContent ?? '';
    el.textContent = '';
    el.appendChild(inner);
    gsap.set(el, { display: 'block', overflow: 'hidden', paddingBottom: '0.06em' });
  });

  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .fromTo('.topbar', { yPercent: -100 }, { yPercent: 0, duration: 0.8 }, 0)
    .fromTo(
      '.hero__eyebrow',
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      0.35
    )
    .fromTo(
      '.hero__line-inner',
      { yPercent: 112 },
      { yPercent: 0, duration: 0.9, stagger: 0.09 },
      0.6
    )
    .fromTo(
      '.hero__script',
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      1.18
    )
    .fromTo(
      '.hero__body',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      1.43
    )
    .fromTo(
      '.hero__actions',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      1.63
    )
    .fromTo(
      '.scrollcue',
      { scale: 0.6, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5 },
      1.93
    )
    .fromTo(
      '.hero__blob',
      { scale: 0.75, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.1, stagger: 0.12 },
      0.2
    )
    .fromTo(
      '.hero__art',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2 },
      0.35
    );

  // Nota: la barra de categorías NO entra en esta línea de tiempo.
  // Es la navegación principal; si el ticker de GSAP no llegara a correr
  // (pestaña oculta, entorno sin compositor) debe seguir siendo usable.
}

/* ==========================================================================
   3. Revelados al hacer scroll
   ========================================================================== */

function revealOnScroll() {
  // Títulos: división en líneas con máscara + revelado desde abajo.
  gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit: (self) =>
        gsap.fromTo(
          self.lines,
          { yPercent: 108 },
          {
            yPercent: 0,
            duration: 0.85,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          }
        ),
    });
  });

  // Entrada simple.
  gsap.utils.toArray<HTMLElement>('[data-reveal="fade"]').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 93%', once: true },
      }
    );
  });

  // Escalonado de grupos (tarjetas de destacados).
  gsap.utils.toArray<HTMLElement>('[data-reveal="stagger"]').forEach((el) => {
    gsap.fromTo(
      el.children,
      { y: 26, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        ease: 'power3.out',
        stagger: 0.055,
        scrollTrigger: { trigger: el, start: 'top 93%', once: true },
      }
    );
  });

  // Cada plato entra por separado cuando llega a pantalla.
  // OJO: `.dishlist` NO lleva `data-reveal="stagger"`; si lo llevara, estos
  // dos tweens competirían por las mismas tarjetas.
  gsap.utils.toArray<HTMLElement>('[data-dish]').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 22, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 95%', once: true },
      }
    );
  });
}

/* ==========================================================================
   4. Marquee infinito
   ========================================================================== */

function marquees() {
  gsap.utils.toArray<HTMLElement>('[data-marquee]').forEach((track) => {
    const tween = gsap.to(track, {
      x: () => -track.scrollWidth / 2,
      duration: () => track.scrollWidth / 2 / 55,
      ease: 'none',
      repeat: -1,
    });

    // La métrica cambia al rotar el móvil: recalcula.
    const ro = new ResizeObserver(() => {
      tween.invalidate();
      ScrollTrigger.refresh();
    });
    ro.observe(track);
  });
}

/* ==========================================================================
   5. Parallax de blobs e ilustraciones
   ========================================================================== */

function parallax() {
  const layers: [string, number][] = [
    ['.hero__blob--gold', -10],
    ['.hero__blob--sage', 12],
    ['.hero__art', 18],
    ['.footer__blob', -10],
  ];

  layers.forEach(([sel, y]) => {
    const el = document.querySelector<HTMLElement>(sel);
    if (!el) return;
    gsap.fromTo(
      el,
      { yPercent: y },
      {
        yPercent: -y,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section, header, footer') ?? el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });

  // Ilustración de cada sección: deriva lenta hacia arriba.
  gsap.utils.toArray<HTMLElement>('.sechead__art').forEach((el) => {
    gsap.fromTo(
      el,
      { yPercent: 8 },
      {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section') ?? el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });
}

/* ==========================================================================
   6. Barra de progreso + ocultar la barra superior
   ========================================================================== */

function chrome() {
  const bar = document.getElementById('progress');
  const topbar = document.getElementById('topbar');

  if (bar) {
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        gsap.set(bar, { scaleX: self.progress });
        bar.setAttribute('aria-valuenow', String(Math.round(self.progress * 100)));
      },
    });
  }

  if (topbar && lenis) {
    let last = 0;
    lenis.on('scroll', ({ scroll }) => {
      if (scroll < 200) {
        topbar.dataset.hidden = 'false';
      } else {
        topbar.dataset.hidden = scroll > last + 3 ? 'true' : 'false';
      }
      last = scroll;
    });
  }
}

/* ==========================================================================
   7. Categoría activa en la barra inferior
   ========================================================================== */

function activeCategory() {
  const nav = document.getElementById('catnav');
  const sections = gsap.utils.toArray<HTMLElement>('[data-section]');
  if (!nav || !sections.length) return;

  const items = new Map<string, HTMLElement>();
  nav.querySelectorAll<HTMLElement>('[data-cat]').forEach((el) =>
    items.set(el.dataset.cat!, el)
  );

  const setActive = (id: string) => {
    items.forEach((el, key) => {
      if (key === id) el.setAttribute('aria-current', 'true');
      else el.removeAttribute('aria-current');
    });

    // Centra la píldora activa sin desplazar la página.
    const pill = items.get(id);
    const track = nav.querySelector<HTMLElement>('.catnav__scroll');
    if (pill && track) {
      const target = pill.offsetLeft - (track.clientWidth - pill.offsetWidth) / 2;
      track.scrollTo({ left: target, behavior: 'smooth' });
    }
  };

  sections.forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => {
        if (self.isActive) setActive(sec.dataset.section!);
      },
    });
  });

  setActive(sections[0].dataset.section!);
}

/* ==========================================================================
   8. Botón "volver arriba"
   ========================================================================== */

function backToTop() {
  document.querySelectorAll('[data-scroll-top]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      scrollTo('#hero', 0);
    });
  });
}

/* ==========================================================================
   Arranque
   ========================================================================== */

function init() {
  if (REDUCED) {
    // Sin animación: todo queda visible y con el scroll nativo.
    gsap.set('[data-reveal], [data-hero], [data-hero-line]', { clearProps: 'all' });
    backToTop();
    return;
  }

  heroIntro();
  revealOnScroll();
  marquees();
  parallax();
  chrome();
  activeCategory();
  backToTop();

  // Las fuentes display cambian el layout al cargar: recalcula triggers.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}