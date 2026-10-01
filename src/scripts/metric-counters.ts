/**
 * Metric count-up (US4) using Framer Motion's DOM animation engine — no React runtime required.
 *
 * - Server HTML always contains the final value (no-JS and reduced-motion users see it as-is).
 * - Framer Motion is only downloaded when a counter group approaches the viewport.
 * - Each counter animates once, from zero, when at least 60% visible.
 * - Works with client-side navigation: re-runs on `astro:page-load`, and never binds an element twice.
 */
function format(el: HTMLElement, n: number) {
  const decimals = Number(el.dataset.decimals ?? 0);
  return `${n.toFixed(decimals)}${el.dataset.suffix ?? ''}`;
}

async function start(counters: HTMLElement[]) {
  const { animate, inView } = await import('framer-motion/dom');
  for (const el of counters) {
    if (!el.isConnected) continue; // page changed before the chunk loaded
    const target = Number(el.dataset.value);
    el.textContent = format(el, 0);
    const cancel = inView(
      el,
      () => {
        cancel(); // once; IntersectionObserver callbacks are async, so `cancel` is assigned
        animate(0, target, {
          duration: 1.4,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (latest: number) => {
            el.textContent = format(el, latest);
          },
        });
      },
      { amount: 0.6 },
    );
  }
}

function setup() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const counters = Array.from(document.querySelectorAll<HTMLElement>('[data-counter][data-value]:not([data-motion-bound])'));
  if (!counters.length || reduceMotion || !('IntersectionObserver' in window)) return;
  counters.forEach((el) => (el.dataset.motionBound = ''));

  const loader = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        loader.disconnect();
        void start(counters);
      }
    },
    { rootMargin: '300px 0px' },
  );
  counters.forEach((el) => loader.observe(el));
}

setup();
document.addEventListener('astro:page-load', setup);

export {};
