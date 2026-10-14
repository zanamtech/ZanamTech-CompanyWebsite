/**
 * Staggered fade/rise for card groups marked `data-reveal-group`, using Framer Motion's DOM engine.
 * Optional per-group tuning (all data attributes on the group):
 * - `data-reveal-stagger`  seconds between items (default 0.06). Capped at 0.06 and so that the whole group starts
 *                          within 300ms: the grid is revealed as one group, never card by card while scrolling.
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
 * - Never leaves content hidden: groups taller than the viewport use a smaller threshold, a scroll/pageshow/
 *   visibility watchdog starts any group that is on screen.
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
    const stagger = Math.min(Number(d.revealStagger ?? 0.06), 0.06, 0.24 / Math.max(1, items.length - 1));
    const y = Number(d.revealDistance ?? 16);
    const x = Number(d.revealX ?? 0);
    const scale = Number(d.revealScale ?? 1);
    const duration = Number(d.revealDuration ?? 0.5);
    items.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    });

    let started = false;
    const reveal = () => {
      if (started) return;
      started = true;
      cancel();
      stopWatching();
      items.forEach((el, i) => {
        animate(
          el,
          { opacity: 1, transform: 'translate3d(0px, 0px, 0) scale(1)' },
          { duration, delay: i * stagger, ease: [0.16, 1, 0.3, 1] },
        );
      });
    };

    // Already scrolled past (fast scroll, jump, scroll restoration): show the group as it would end, without animating.
    const showNow = () => {
      if (started) return;
      started = true;
      cancel();
      stopWatching();
      items.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    };

    // A group taller than the viewport can never show 15% of itself, so ask for what can actually fit on screen.
    const amount = Math.min(0.15, (window.innerHeight * 0.5) / Math.max(1, group.getBoundingClientRect().height));
    const cancel = inView(group, reveal, { amount });

    // Safety net, as in processReveal: start whenever the group is on screen even if the observer missed it (scroll
    // restoration, back/forward cache, a jump past the group, a tab hidden during load).
    let queued = false;
    const check = () => {
      if (queued || started) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const r = group.getBoundingClientRect();
        if (r.bottom <= 0) showNow();
        else if (r.top < window.innerHeight) reveal();
      });
    };
    const stopWatching = () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('pageshow', check);
      document.removeEventListener('visibilitychange', check);
    };
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('pageshow', check);
    document.addEventListener('visibilitychange', check);
  }
}

void setup();
document.addEventListener('astro:page-load', () => void setup());

export {};
