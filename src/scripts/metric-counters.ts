/**
 * Metric count-up (US4). No animation library: one requestAnimationFrame loop per counter.
 *
 * - Server HTML always contains the final value (no-JS and reduced-motion users see it as-is).
 * - When a counter group comes within 300px of the viewport its counters are set to zero; each one then counts up once,
 *   from zero, when at least 60% of it is visible: 1.4s on cubic-bezier(0.16, 1, 0.3, 1), the curve and duration the
 *   Framer Motion version used, solved the same way.
 * - Works with client-side navigation: re-runs on `astro:page-load`, never binds an element twice, and drops its
 *   observers and frame loops before a swap.
 */
import { reducedMotion } from './motion';

const DURATION_MS = 1400;

// cubic-bezier(x1, y1, x2, y2) solved by binary subdivision, as in Framer Motion (motion-utils cubicBezier).
// Same operation order as the original, so every frame rounds the same.
const bezier = (t: number, a1: number, a2: number) =>
  (((1 - 3 * a2 + 3 * a1) * t + (3 * a2 - 6 * a1)) * t + 3 * a1) * t;
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const tForX = (x: number) => {
    let lower = 0;
    let upper = 1;
    let t: number;
    let delta: number;
    let i = 0;
    do {
      t = lower + (upper - lower) / 2;
      delta = bezier(t, x1, x2) - x;
      if (delta > 0) upper = t;
      else lower = t;
    } while (Math.abs(delta) > 1e-7 && ++i < 12);
    return t;
  };
  return (p: number) => (p === 0 || p === 1 ? p : bezier(tForX(p), y1, y2));
}
const ease = cubicBezier(0.16, 1, 0.3, 1);

const observers: IntersectionObserver[] = [];
/** The running frame request of each counter. */
const frames = new Map<HTMLElement, number>();

function format(el: HTMLElement, n: number) {
  const decimals = Number(el.dataset.decimals ?? 0);
  return `${n.toFixed(decimals)}${el.dataset.suffix ?? ''}`;
}

function countUp(el: HTMLElement) {
  const target = Number(el.dataset.value);
  // Timed as Framer Motion did: from the moment the counter came into view, in whole milliseconds, read on each frame.
  const start = performance.now();
  const tick = () => {
    const p = Math.min(1, Math.round(performance.now() - start) / DURATION_MS);
    el.textContent = format(el, target * ease(p));
    if (p < 1) frames.set(el, requestAnimationFrame(tick));
    else frames.delete(el);
  };
  frames.set(el, requestAnimationFrame(tick));
}

function start(counters: HTMLElement[]) {
  const inView = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        inView.unobserve(e.target); // once
        countUp(e.target as HTMLElement);
      }
    },
    { threshold: 0.6 },
  );
  observers.push(inView);
  for (const el of counters) {
    el.textContent = format(el, 0);
    inView.observe(el);
  }
}

function teardown() {
  observers.forEach((o) => o.disconnect());
  observers.length = 0;
  frames.forEach((f) => cancelAnimationFrame(f));
  frames.clear();
}

function setup() {
  const counters = Array.from(
    document.querySelectorAll<HTMLElement>('[data-counter][data-value]:not([data-motion-bound])'),
  );
  if (!counters.length || reducedMotion() || !('IntersectionObserver' in window)) return;
  counters.forEach((el) => (el.dataset.motionBound = ''));

  const loader = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        loader.disconnect();
        start(counters);
      }
    },
    { rootMargin: '300px 0px' },
  );
  observers.push(loader);
  counters.forEach((el) => loader.observe(el));
}

setup();
document.addEventListener('astro:page-load', setup);
document.addEventListener('astro:before-swap', teardown);

export {};
