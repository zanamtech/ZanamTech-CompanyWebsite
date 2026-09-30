/**
 * Staggered fade/rise for card groups marked `data-reveal-group`, using Framer Motion's DOM engine.
 *
 * Safety rules:
 * - Nothing is hidden until Framer Motion has loaded, so content never disappears if the chunk fails.
 * - Only groups entirely below the fold are prepared, so there is no flash for visible content and no layout shift
 *   (opacity/transform only).
 * - Skipped entirely under prefers-reduced-motion.
 */
const groups = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal-group]'));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

async function start() {
  const { animate, inView } = await import('framer-motion/dom');
  const belowFold = groups.filter((g) => g.getBoundingClientRect().top > window.innerHeight);

  for (const group of belowFold) {
    const items = Array.from(group.children) as HTMLElement[];
    items.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
    });
    const cancel = inView(
      group,
      () => {
        cancel();
        items.forEach((el, i) => {
          animate(el, { opacity: 1, transform: 'translateY(0px)' }, { duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] });
        });
      },
      { amount: 0.15 },
    );
  }
}

if (groups.length && !reduceMotion && 'IntersectionObserver' in window) {
  void start();
}

export {};
