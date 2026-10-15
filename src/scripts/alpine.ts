import type { Alpine } from 'alpinejs';
import { FIELD_ORDER, OTHER_SERVICE, submitLead, validateLead, type LeadErrors, type LeadInput } from '../lib/lead';

// The same key is hard-coded in the inline no-flash script (src/layouts/BaseLayout.astro, which cannot import) and in
// tests/e2e/fixtures.ts. Change all three together.
const THEME_KEY = 'zt-theme';
type Theme = 'light' | 'dark';

interface ThemeStore {
  current: Theme;
  readonly isDark: boolean;
  set(theme: Theme): void;
  toggle(): void;
}

interface ServiceOption {
  slug: string;
  name: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const FORM_ENDPOINT = import.meta.env.PUBLIC_FORM_ENDPOINT || 'https://api.web3forms.com/submit';
const FORM_ACCESS_KEY = import.meta.env.PUBLIC_FORM_ACCESS_KEY || '';

const FAILURE_MESSAGES = {
  rejected:
    'Your request could not be sent because it was rejected by our form service. Please review your details and try again.',
  server:
    'Your request could not be sent due to a temporary service issue. Your details are preserved; please try again.',
  network: 'Your request could not be sent. Please check your connection and try again; your details are preserved.',
  timeout: 'Your request could not be sent because the service took too long to respond. Please try again.',
} as const;

function readStoredTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

const emptyLead = (): LeadInput => ({
  name: '',
  email: '',
  company: '',
  phone: '',
  service: '',
  region: '',
  companySize: '',
  cloudPlatform: '',
  budget: '',
  message: '',
  consent: false,
  botcheck: '',
});

export default (Alpine: Alpine) => {
  /* ---------------------------------------------------------------- theme */
  const themeStore: ThemeStore = {
    current: readStoredTheme(),

    get isDark(): boolean {
      return this.current === 'dark';
    },

    set(theme: Theme) {
      const root = document.documentElement;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
      if (reduceMotion) {
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

  /* ------------------------------------------------- client-side navigation */
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

  /* ------------------------------------------------------------- header */
  Alpine.data('siteHeader', () => ({
    open: false,
    services: false,
    /** Mobile drawer: the expandable Services group (pillars inside are native <details>). */
    mobileServices: false,
    closeTimer: 0,
    suppressFocusOpen: false,
    /** Pointer type of the most recent press on the Services item ('mouse' | 'touch' | 'pen' | ''). */
    lastPointerType: '',
    /** True once the page is scrolled: shows the full-width backdrop behind the floating bar. */
    scrolled: false,

    init() {
      const onScroll = () => {
        this.scrolled = window.scrollY > 0;
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      document.addEventListener('astro:page-load', onScroll);

      // The header persists across client-side navigation: close every menu as soon as a navigation starts (before
      // the page transition runs), and again after the swap as a safety net.
      const closeAll = () => {
        window.clearTimeout(this.closeTimer);
        this.open = false;
        this.services = false;
        this.mobileServices = false;
      };
      document.addEventListener('astro:before-preparation', closeAll);
      document.addEventListener('astro:before-swap', closeAll);
      document.addEventListener('astro:after-swap', closeAll);
    },

    /**
     * Any link chosen inside the mega-menu closes it immediately, before any navigation or transition. A link to the
     * page already shown does not navigate: the menu closes and the page scrolls smoothly to the top.
     */
    closeServicesOnLink(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a');
      if (!link) return;
      window.clearTimeout(this.closeTimer);
      this.services = false;
      const url = new URL(link.href, location.href);
      const here = (p: string) => p.replace(/\/$/, '') || '/';
      if (url.origin === location.origin && here(url.pathname) === here(location.pathname) && !url.hash) {
        event.preventDefault(); // also stops Astro's ClientRouter, which skips prevented clicks
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      }
    },

    /** Hover intent: open immediately and cancel any pending close. */
    openServices() {
      window.clearTimeout(this.closeTimer);
      this.services = true;
    },

    /** Keyboard users reach the menu by focusing the Services link (Tab then moves into the panel). */
    openServicesOnFocus() {
      // A touch tap also focuses the link; the tap's click handler owns the toggle in that case.
      if (this.suppressFocusOpen || this.isTouchPress()) return;
      this.openServices();
    },

    rememberPointer(event: PointerEvent) {
      this.lastPointerType = event.pointerType;
    },

    /**
     * Touch semantics for this press? Trust the actual pointer when known (a mouse on a touch-capable laptop or an
     * iPad trackpad still navigates); otherwise fall back to whether the device's primary input can hover.
     */
    isTouchPress() {
      if (this.lastPointerType === 'mouse') return false;
      if (this.lastPointerType === 'touch' || this.lastPointerType === 'pen') return true;
      return window.matchMedia('(hover: none)').matches;
    },

    /** Hover-to-open is for real mice only; touch taps emit compatibility pointer/mouse events we must ignore. */
    onServicesPointerEnter(event: PointerEvent) {
      if (event.pointerType === 'mouse') this.openServices();
    },

    onServicesPointerLeave(event: PointerEvent) {
      if (event.pointerType === 'mouse') this.closeServicesSoon();
    },

    /**
     * Mouse/keyboard: let the link navigate to /services.
     * Touch / no-hover devices: the first tap must not navigate — toggle the menu instead.
     */
    toggleServices(event: MouseEvent) {
      const touch = this.isTouchPress();
      this.lastPointerType = '';
      if (!touch) return;
      event.preventDefault(); // also stops Astro's ClientRouter, which skips prevented clicks
      window.clearTimeout(this.closeTimer);
      this.services = !this.services;
    },

    /** Short grace period so diagonal cursor movement toward the panel doesn't close it. */
    closeServicesSoon() {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = window.setTimeout(() => {
        this.services = false;
      }, 150);
    },

    /** Close when keyboard focus leaves the Services item (link + panel). */
    closeServicesIfFocusLeft(event: FocusEvent) {
      const item = event.currentTarget as HTMLElement | null;
      if (!item?.contains(event.relatedTarget as Node | null)) this.services = false;
    },

    /** Escape closes the innermost open menu and returns focus to its trigger. */
    onEscape() {
      if (this.services) {
        window.clearTimeout(this.closeTimer);
        this.services = false;
        this.suppressFocusOpen = true;
        (this.$refs.servicesLink as HTMLElement | undefined)?.focus();
        this.suppressFocusOpen = false;
      } else if (this.open) {
        this.open = false;
        (this.$refs.menuButton as HTMLElement | undefined)?.focus();
      }
    },
  }));

  /* ------------------------------------------------ hero blueprint stepper */
  // Loop: each step is active for 1.8s (earlier steps stay ticked) → 2s pause after step 4 (1.3s neutral with every
  // step ticked, then 0.7s while the ticks fade out) → step 1 again. 'off' (reduced motion / before Alpine) shows the static card.
  type StepperPhase = 'off' | 'play' | 'rest' | 'reset';
  const STEPPER_DELAY: Record<StepperPhase, number> = { off: 0, play: 1800, rest: 1300, reset: 700 };

  Alpine.data('blueprintStepper', (steps: number) => ({
    activeStep: 0,
    phase: 'off' as StepperPhase,
    timer: 0,
    isHovered: false,

    init() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      this.phase = 'reset';
      this.schedule();
    },

    destroy() {
      window.clearTimeout(this.timer);
    },

    schedule() {
      window.clearTimeout(this.timer);
      this.timer = window.setTimeout(() => {
        if (!this.isHovered && !document.hidden) this.advance();
        this.schedule();
      }, STEPPER_DELAY[this.phase]);
    },

    advance() {
      if (this.phase === 'reset') {
        this.phase = 'play';
        this.activeStep = 1;
      } else if (this.phase === 'play' && this.activeStep < steps) {
        this.activeStep += 1;
      } else if (this.phase === 'play') {
        this.phase = 'rest';
        this.activeStep = 0;
      } else {
        this.phase = 'reset';
      }
    },

    pause() {
      this.isHovered = true;
      window.clearTimeout(this.timer);
    },

    resume() {
      this.isHovered = false;
      if (this.phase !== 'off') this.schedule();
    },

    /** 'active' (current) | 'done' (ticked, neutral) | 'idle' (upcoming, dimmed, no tick) | 'clear' (neutral, no
     * tick); '' for the static card. */
    stepState(step: number) {
      if (this.phase === 'off') return '';
      if (this.phase === 'rest') return 'done';
      if (this.phase === 'reset') return 'clear';
      if (step === this.activeStep) return 'active';
      return step < this.activeStep ? 'done' : 'idle';
    },
  }));

  /* --------------------------------------------- process cards reveal */
  // Group reveal: when the grid enters the viewport every card appears together, 60ms apart (odd steps = cards, even
  // steps = the connector segments between them, 30ms after each card), so the whole set is under way within 300ms
  // and no card is left faded or invisible while the visitor scrolls. Everything stays visible without JS, under
  // reduced motion, and when the section is already on screen at load (no flash).
  const PROCESS_STEP_MS = 30;

  Alpine.data('processReveal', (count: number) => ({
    step: count * 2 - 1,
    /** True once the sequence has finished: cards then carry no reveal styles at all (data-shown="done"). */
    done: true,
    started: false,
    timers: [] as number[],
    observer: null as IntersectionObserver | null,
    watchdog: null as (() => void) | null,
    safetyTimer: 0,

    init() {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce || !('IntersectionObserver' in window)) return;
      if (this.$el.getBoundingClientRect().top < window.innerHeight) return;
      this.step = 0;
      this.done = false;
      // Observe the grid container; a grid taller than the screen (stacked on phones) asks only for what can fit.
      const threshold = Math.min(
        0.2,
        (window.innerHeight * 0.5) / Math.max(1, this.$el.getBoundingClientRect().height),
      );
      this.observer = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && this.start(), {
        threshold,
      });
      this.observer.observe(this.$el);
      // Safety net: if the observer misses the entry (scroll restoration on reload, a back/forward-cache restore, a
      // jump past the section, a tab hidden mid-load), start as soon as any part of the steps is on screen.
      let queued = false;
      const check = () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          const r = this.$el.getBoundingClientRect();
          if (r.bottom <= 0) this.finish();
          else if (r.top < window.innerHeight) this.start();
        });
      };
      this.watchdog = check;
      window.addEventListener('scroll', check, { passive: true });
      window.addEventListener('pageshow', check);
      document.addEventListener('visibilitychange', check);
      // Last resort, as in reveal.ts: whatever has not started by now is shown as finished.
      this.safetyTimer = window.setTimeout(() => !this.started && this.finish(), 4000);
    },

    start() {
      if (this.started || this.done) return;
      this.started = true;
      this.stopWatching();
      const total = count * 2 - 1;
      this.timers = Array.from({ length: total }, (_, i) =>
        window.setTimeout(() => (this.step = i + 1), i * PROCESS_STEP_MS),
      );
      this.timers.push(window.setTimeout(() => (this.done = true), (total - 1) * PROCESS_STEP_MS + 900));
    },

    /** Already scrolled past (fast scroll, jump, scroll restoration): show the finished state without animating. */
    finish() {
      this.stopWatching();
      this.timers.forEach((t) => window.clearTimeout(t));
      this.started = true;
      this.step = count * 2 - 1;
      this.done = true;
    },

    stopWatching() {
      window.clearTimeout(this.safetyTimer);
      this.observer?.disconnect();
      if (this.watchdog) {
        window.removeEventListener('scroll', this.watchdog);
        window.removeEventListener('pageshow', this.watchdog);
        document.removeEventListener('visibilitychange', this.watchdog);
        this.watchdog = null;
      }
    },

    destroy() {
      this.stopWatching();
      this.timers.forEach((t) => window.clearTimeout(t));
    },

    /** Card n (1-based) appears on step 2n-1; "done" once the whole sequence has played. */
    isShown(card: number) {
      if (this.done) return 'done';
      return this.step >= card * 2 - 1 ? 'true' : 'false';
    },

    /** Connector segment n (between card n and n+1) draws on step 2n. */
    isDrawn(segment: number) {
      return this.done || this.step >= segment * 2 ? 'true' : 'false';
    },
  }));

  /* ---------------------------------------------------- hero scroll cue */
  // The link's href (e.g. #core-services) is the no-JS fallback; with JS, scroll smoothly (instantly under reduced motion)
  // without letting the ClientRouter treat it as a navigation.
  Alpine.data('scrollCue', () => ({
    go(event: MouseEvent) {
      const target = document.querySelector((event.currentTarget as HTMLAnchorElement).hash);
      if (!target) return;
      event.preventDefault();
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    },
  }));

  /* ---------------------------------------------------------- lead form */
  type MenuField = 'service' | 'budget' | 'region' | 'companySize' | 'cloudPlatform';

  Alpine.data('leadForm', (config: { services: ServiceOption[]; idPrefix: string }) => ({
    fields: emptyLead(),
    /** Custom dropdown (select-only combobox) state. */
    openMenu: '' as MenuField | '',
    activeIndex: -1,
    menuUp: false,
    menuStyle: { maxHeight: '14rem' } as Record<string, string>,
    errors: {} as LeadErrors,
    status: 'idle' as FormStatus,
    failure: '',
    attempted: false,
    announcement: '',

    /** ?service=<slug> preselects "Service needed" on load; unknown slugs are ignored and nothing is stored. */
    init() {
      const fromUrl = () => this.preselect(new URL(location.href).searchParams.get('service') ?? '');
      fromUrl();
      // After a client-side navigation the component can initialise before the router updates the address bar, so
      // read the URL again once the new page has loaded.
      document.addEventListener('astro:page-load', fromUrl, { once: true });
    },

    preselect(slug: string) {
      const match = config.services.find((s) => s.slug === slug);
      if (match) this.fields.service = match.name;
    },

    /* ---- custom dropdowns ---- */
    optionValues(field: MenuField): string[] {
      const list = document.getElementById(`${config.idPrefix}-${field}-listbox`);
      return Array.from(list?.querySelectorAll<HTMLElement>('[role="option"]') ?? []).map((o) => o.dataset.value ?? '');
    },

    trigger(field: MenuField) {
      return document.getElementById(`${config.idPrefix}-${field}`);
    },

    /** Open towards the side with more room in the viewport, capping height so nothing is clipped. */
    openMenuFor(field: MenuField) {
      const el = this.trigger(field);
      if (el) {
        const r = el.getBoundingClientRect();
        const below = window.innerHeight - r.bottom - 12;
        const above = r.top - 12;
        this.menuUp = below < 224 && above > below;
        this.menuStyle = { maxHeight: `${Math.max(120, Math.min(224, this.menuUp ? above : below))}px` };
      }
      const current = this.optionValues(field).indexOf(this.fields[field]);
      this.activeIndex = current >= 0 ? current : 0;
      this.openMenu = field;
      this.$nextTick(() => this.scrollActiveIntoView(field));
    },

    toggleMenu(field: MenuField) {
      if (this.openMenu === field) this.openMenu = '';
      else this.openMenuFor(field);
    },

    closeMenuIf(field: MenuField) {
      if (this.openMenu === field) this.openMenu = '';
    },

    chooseOption(field: MenuField, index: number) {
      const value = this.optionValues(field)[index];
      if (value === undefined) return;
      this.fields[field] = value;
      this.openMenu = '';
      this.trigger(field)?.focus();
      this.revalidate();
    },

    scrollActiveIntoView(field: MenuField) {
      document
        .getElementById(`${config.idPrefix}-${field}-listbox-${this.activeIndex}`)
        ?.scrollIntoView({ block: 'nearest' });
    },

    /** Keyboard model for a select-only combobox (WAI-ARIA APG): focus stays on the trigger. */
    onMenuKey(field: MenuField, event: KeyboardEvent) {
      const open = this.openMenu === field;
      const count = this.optionValues(field).length;
      const move = (to: number) => {
        this.activeIndex = Math.max(0, Math.min(count - 1, to));
        this.$nextTick(() => this.scrollActiveIntoView(field));
      };
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowUp':
          event.preventDefault();
          if (!open) this.openMenuFor(field);
          else move(this.activeIndex + (event.key === 'ArrowDown' ? 1 : -1));
          break;
        case 'Home':
        case 'End':
          if (!open) return;
          event.preventDefault();
          move(event.key === 'Home' ? 0 : count - 1);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (!open) this.openMenuFor(field);
          else this.chooseOption(field, this.activeIndex);
          break;
        case 'Escape':
          if (!open) return;
          // Close only the menu.
          event.preventDefault();
          event.stopPropagation();
          this.openMenu = '';
          break;
        case 'Tab':
          if (open) this.openMenu = '';
          break;
      }
    },

    activeId(field: MenuField) {
      return this.openMenu === field && this.activeIndex >= 0
        ? `${config.idPrefix}-${field}-listbox-${this.activeIndex}`
        : null;
    },

    optionSelected(field: MenuField, index: number) {
      return this.fields[field] !== '' && this.optionValues(field)[index] === this.fields[field] ? 'true' : 'false';
    },

    optionActive(field: MenuField, index: number) {
      return this.openMenu === field && this.activeIndex === index ? 'true' : 'false';
    },

    validate() {
      this.errors = validateLead(this.fields, [...config.services.map((s) => s.name), OTHER_SERVICE]);
      return Object.keys(this.errors).length === 0;
    },

    revalidate() {
      if (this.attempted) this.validate();
    },

    async submit() {
      if (this.status === 'submitting') return;
      this.attempted = true;
      // Read the honeypot from the DOM: automated agents often set `.value` without firing input events.
      this.fields.botcheck = this.$root.querySelector<HTMLInputElement>('[name="botcheck"]')?.value ?? '';
      if (!this.validate()) {
        const count = Object.keys(this.errors).length;
        this.announcement = `Please correct ${count} ${count === 1 ? 'field' : 'fields'} before sending.`;
        const first = FIELD_ORDER.find((f) => this.errors[f]);
        this.$nextTick(() =>
          (
            this.$root.querySelector<HTMLElement>(`[data-focus="${first}"]`) ??
            this.$root.querySelector<HTMLElement>(`[name="${first}"]`)
          )?.focus(),
        );
        return;
      }

      this.status = 'submitting';
      this.failure = '';
      this.announcement = 'Sending your request…';
      const result = await submitLead(this.fields, { endpoint: FORM_ENDPOINT, accessKey: FORM_ACCESS_KEY });

      if (result.ok) {
        this.status = 'success';
        this.announcement = '';
        this.$nextTick(() => this.$root.querySelector<HTMLElement>('[data-success-heading]')?.focus());
      } else {
        this.status = 'error';
        this.failure = FAILURE_MESSAGES[result.reason];
        this.announcement = '';
      }
    },
  }));
};
