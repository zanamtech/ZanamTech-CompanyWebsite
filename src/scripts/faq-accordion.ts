/**
 * FAQ accordion height animation, fallback path.
 *
 * Browsers with `interpolate-size` animate the native <details> content in CSS (global.css). Others (Firefox, current
 * Safari) get the same ~280ms ease here through the Web Animations API, which the CSP allows (no style attributes).
 * The native <details>/<summary> stays in charge of semantics and keyboard support: Enter and Space fire the same click
 * handled below. Under reduced motion nothing is intercepted, so items open and close instantly.
 */
const DURATION = 280;
const cssAnimates = typeof CSS !== 'undefined' && CSS.supports('interpolate-size', 'allow-keywords');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const running = new WeakMap<HTMLElement, Animation>();

function animateHeight(body: HTMLElement, from: number, to: number, onFinish: () => void) {
  const animation = body.animate({ height: [`${from}px`, `${to}px`] }, { duration: DURATION, easing: 'ease' });
  running.set(body, animation);
  animation.onfinish = () => {
    running.delete(body);
    onFinish();
  };
}

if (!cssAnimates) {
  document.addEventListener('click', (event) => {
    if (reducedMotion.matches || !(event.target instanceof Element)) return;
    const summary = event.target.closest('[data-faq] > summary');
    const details = summary?.parentElement;
    const body = details?.querySelector<HTMLElement>('[data-faq-body]');
    if (!(details instanceof HTMLDetailsElement) || !body) return;
    event.preventDefault();

    // Start from the current height so a second click mid-animation reverses smoothly.
    const current = body.getBoundingClientRect().height;
    running.get(body)?.cancel();

    const closing = details.open && details.dataset.closing === undefined;
    if (closing) {
      details.dataset.closing = '';
      animateHeight(body, current, 0, () => {
        details.open = false;
        delete details.dataset.closing;
      });
    } else {
      const from = details.open ? current : 0;
      delete details.dataset.closing;
      details.open = true;
      animateHeight(body, from, body.scrollHeight, () => {});
    }
  });
}
