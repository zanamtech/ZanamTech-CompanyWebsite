import type { Alpine } from 'alpinejs';
import { reducedMotion } from '../motion';

// The same key is hard-coded in the inline no-flash script (src/layouts/BaseLayout.astro, which cannot import) and in
// tests/e2e/fixtures.ts. Change all three together.
const THEME_KEY = 'zt-theme';
type Theme = 'light' | 'dark';

export interface ThemeStore {
  current: Theme;
  readonly isDark: boolean;
  set(theme: Theme): void;
  toggle(): void;
}

function readStoredTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

/** The $store.theme store: light/dark with a 200ms crossfade (instant under reduced motion). */
export function registerTheme(Alpine: Alpine): ThemeStore {
  const themeStore: ThemeStore = {
    current: readStoredTheme(),

    get isDark(): boolean {
      return this.current === 'dark';
    },

    set(theme: Theme) {
      const root = document.documentElement;
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch {
        /* storage unavailable: theme applies for this page view only */
      }

      const apply = () => {
        root.classList.toggle('dark', theme === 'dark');
        this.current = theme;
      };

      // Reduced motion: switch instantly.
      if (reducedMotion()) {
        apply();
        return;
      }

      // Primary: a single 200ms crossfade snapshot (View Transitions API). Wait for Alpine to re-render
      // reactive bits (e.g. the toggle icon) so the "new" snapshot is complete.
      const doc = document as Document & {
        startViewTransition?: (cb: () => Promise<void> | void) => { finished: Promise<void> };
      };
      if (typeof doc.startViewTransition === 'function') {
        root.classList.add('theme-vt');
        const transition = doc.startViewTransition(() => {
          apply();
          return Alpine.nextTick();
        });
        transition.finished.finally(() => root.classList.remove('theme-vt'));
        return;
      }

      // Fallback: short CSS colour transitions, enabled only for the duration of the switch.
      root.classList.add('theme-transition');
      apply();
      window.setTimeout(() => root.classList.remove('theme-transition'), 250);
    },

    toggle() {
      this.set(this.current === 'dark' ? 'light' : 'dark');
    },
  };
  Alpine.store('theme', themeStore);
  return themeStore;
}
