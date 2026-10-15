/**
 * Group fade/rise for card grids marked `data-reveal-group` (each direct child is one item). CSS transitions driven by
 * a `data-reveal` attribute; no animation library, nothing inline.
 * Optional per-group tuning: `data-reveal-distance` (rise in px, default 16), `data-reveal-x` (horizontal offset in px,
 * default 0), `data-reveal-scale` (starting scale, default 1).
 *
 * Fail-safe rules (a card must never be left blank):
 * - Visible by default: only this script hides anything, by setting data-reveal="hidden" on items of groups that are
 *   entirely below the fold at init. Groups in or above the viewport are never touched.
 * - The end state is an attribute, not an animation: data-reveal="shown" is opacity 1 whatever happens to the transition.
 *   Once the transition is over the attribute is removed, so a revealed card carries no opacity/transform at all.
 *   (A glass card left on its own compositor layer with backdrop-filter can stay unpainted in Chromium until a repaint.)
 * - Once revealed, an element is never hidden again (WeakSet), whatever re-runs.
 * - Per-group safety timeout: from the moment any part of a group enters the viewport, it has 4s to finish; then it is
 *   shown and stripped of reveal styles whatever state it is in. Lower sections still fade in when reached.
 * - Re-initialised on each `astro:page-load`: the previous observers and timers are torn down first; the scroll/pageshow/
 *   visibility watchdog listeners are bound once for the whole session.
 * - The theme toggle never touches reveal state. prefers-reduced-motion: nothing is hidden.
 */
const SAFETY_MS = 4000;
const STAGGER_S = 0.06;
const DONE_MS = 900;

const revealed = new WeakSet<Element>();
let pending: HTMLElement[] = [];
let observer: IntersectionObserver | null = null;
/** Watches for the first visible pixel of each pending group to start its safety timer. */
let safetyObserver: IntersectionObserver | null = null;
const safetyTimers = new Map<HTMLElement, number>();

function itemsOf(group: HTMLElement): HTMLElement[] {
  return Array.from(group.children) as HTMLElement[];
}

/** Clear every reveal style from the group's items. */
function clean(group: HTMLElement) {
  for (const el of itemsOf(group)) {
    el.removeAttribute('data-reveal');
    el.style.removeProperty('--reveal-delay');
    el.style.removeProperty('--reveal-from');
  }
}

function reveal(group: HTMLElement, animate = true) {
  if (revealed.has(group)) return;
  revealed.add(group);
  observer?.unobserve(group);
  pending = pending.filter((g) => g !== group);
  if (!animate) {
    clean(group);
    return;
  }
  const items = itemsOf(group);
  // Whole group under way within 240ms, never card by card.
  const stagger = Math.min(STAGGER_S, 0.24 / Math.max(1, items.length - 1));
  items.forEach((el, i) => {
    el.style.setProperty('--reveal-delay', `${i * stagger}s`);
    el.setAttribute('data-reveal', 'shown');
  });
  window.setTimeout(() => clean(group), DONE_MS + items.length * stagger * 1000);
}

function check() {
  for (const group of [...pending]) {
    if (!group.isConnected) continue;
    const r = group.getBoundingClientRect();
    if (r.bottom <= 0) reveal(group, false);
    else if (r.top < window.innerHeight) {
      armSafety(group);
      reveal(group);
    }
  }
}

let queued = false;
function scheduleCheck() {
  if (queued || !pending.length) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    check();
  });
}

/** Start the group's safety timer once (on entering the viewport). When it fires the group ends visible and clean. */
function armSafety(group: HTMLElement) {
  if (safetyTimers.has(group)) return;
  safetyObserver?.unobserve(group);
  safetyTimers.set(
    group,
    window.setTimeout(() => {
      safetyTimers.delete(group);
      if (!revealed.has(group)) reveal(group, false);
      else clean(group);
    }, SAFETY_MS),
  );
}

function teardown() {
  observer?.disconnect();
  observer = null;
  safetyObserver?.disconnect();
  safetyObserver = null;
  safetyTimers.forEach((t) => window.clearTimeout(t));
  safetyTimers.clear();
  pending = [];
}

function init() {
  teardown();
  const groups = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal-group]'));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    groups.forEach((g) => {
      revealed.add(g);
      clean(g);
    });
    return;
  }

  for (const group of groups) {
    if (revealed.has(group)) continue;
    const alreadyHidden = itemsOf(group).some((el) => el.dataset.reveal === 'hidden');
    // In or above the viewport: never hidden.
    if (!alreadyHidden && group.getBoundingClientRect().top < window.innerHeight) {
      revealed.add(group);
      continue;
    }
    const d = group.dataset;
    const from = `translate3d(${Number(d.revealX ?? 0)}px, ${Number(d.revealDistance ?? 16)}px, 0) scale(${Number(d.revealScale ?? 1)})`;
    for (const el of itemsOf(group)) {
      el.style.setProperty('--reveal-from', from);
      el.setAttribute('data-reveal', 'hidden');
    }
    pending.push(group);
  }
  if (!pending.length) return;

  observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && reveal(e.target as HTMLElement)),
    { rootMargin: '0px 0px -10% 0px' },
  );
  safetyObserver = new IntersectionObserver((entries) =>
    entries.forEach((e) => e.isIntersecting && armSafety(e.target as HTMLElement)),
  );
  pending.forEach((g) => {
    observer!.observe(g);
    safetyObserver!.observe(g);
  });
  scheduleCheck();
}

// Bound once for the whole session (the module runs once; the ClientRouter only swaps the page body).
window.addEventListener('scroll', scheduleCheck, { passive: true });
window.addEventListener('pageshow', scheduleCheck);
document.addEventListener('visibilitychange', scheduleCheck);
// Before a client-side swap, drop the old page's observer and timer.
document.addEventListener('astro:before-swap', teardown);
// Fires on the first load and after every client-side navigation. init() is idempotent, so running it now as well
// covers a page-load event dispatched before this module ran.
document.addEventListener('astro:page-load', init);
init();

export {};
