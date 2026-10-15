import type { ThemeStore } from './theme';

/** ClientRouter glue: carry theme and input modality into the new document, move focus, re-sync the active nav. */
export function registerRouter(themeStore: ThemeStore) {
  // The router replaces <html> attributes with the incoming page's (which never carry `.dark`),
  // and the inline no-flash script does not re-run. Carry the theme into the new document before the swap.
  // The same applies to the input modality (data-modality): without it, a link clicked with the mouse would show a
  // keyboard focus ring after the swap.
  document.addEventListener('astro:before-swap', (event) => {
    const { newDocument } = event as Event & { newDocument: Document };
    newDocument.documentElement.classList.toggle('dark', themeStore.current === 'dark');
    const modality = document.documentElement.dataset.modality;
    if (modality) newDocument.documentElement.dataset.modality = modality;
  });

  // After a client-side navigation, move focus to <main> (tabindex="-1", no outline) so screen readers start at the
  // new content and focus never stays on the clicked link. The first page load keeps the browser's default focus.
  let navigated = false;
  document.addEventListener('astro:after-swap', () => {
    navigated = true;
  });
  document.addEventListener('astro:page-load', () => {
    if (!navigated) return;
    navigated = false;
    document.getElementById('main')?.focus({ preventScroll: true });
  });

  // The header persists across navigation, so its server-rendered active state must be re-synced.
  const syncActiveNav = () => {
    const path = location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]').forEach((link) => {
      const href = link.getAttribute('href') ?? '';
      const active = path === href || path.startsWith(`${href}/`);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
      if (link.dataset.navLink === 'desktop') {
        link.classList.toggle('text-accent', active);
        link.classList.toggle('text-muted', !active);
      }
    });
  };
  document.addEventListener('astro:page-load', syncActiveNav);
}
