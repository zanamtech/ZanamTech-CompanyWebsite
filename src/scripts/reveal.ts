/**
 * Staggered fade/rise for card groups marked `data-reveal-group`, using Framer Motion's DOM engine.
 * Optional per-group tuning (all data attributes on the group):
 * - `data-reveal-stagger`  seconds between items (default 0.06)
 * - `data-reveal-distance` rise in px (default 16); `data-reveal-x` horizontal offset in px (default 0)
 * - `data-reveal-scale`    starting scale (default 1)
 * - `data-reveal-duration` seconds per item (default 0.5)
 *
 * Safety rules:
 * - Nothing is hidden until Framer Motion has loaded, so content never disappears if the chunk fails.
 * - Only groups entirely below the fold are prepared, so there is no flash for visible content and no layout shift
 *   (opacity/transform only).
 * - Skipped entirely under prefers-reduced-motion.
 * - Works with client-side navigation: re-runs on `astro:page-load`, and never binds a group twice.
 */
async function setup() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const groups = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal-group]:not([data-motion-bound])'));
  if (!groups.length || reduceMotion || !('IntersectionObserver' in window)) return;
  groups.forEach((g) => (g.dataset.motionBound = ''));

  const { animate, inView } = await import('framer-motion/dom');
  const belowFold = groups.filter((g) => g.isConnected && g.getBoundingClientRect().top > window.innerHeight);

  for (const group of belowFold) {
    const items = Array.from(group.children) as HTMLElement[];
    const d = group.dataset;
    const stagger = Number(d.revealStagger ?? 0.06);
    const y = Number(d.revealDistance ?? 16);
    const x = Number(d.revealX ?? 0);
    const scale = Number(d.revealScale ?? 1);
    const duration = Number(d.revealDuration ?? 0.5);
    items.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    });
    const cancel = inView(
      group,
      () => {
        cancel();
        items.forEach((el, i) => {
          animate(
            el,
            { opacity: 1, transform: 'translate3d(0px, 0px, 0) scale(1)' },
            { duration, delay: i * stagger, ease: [0.16, 1, 0.3, 1] },
          );
        });
      },
      { amount: 0.15 },
    );
  }
}

void setup();
document.addEventListener('astro:page-load', () => void setup());

export {};
