import type { Alpine } from 'alpinejs';
import { FIELD_ORDER, NOT_SURE, submitLead, validateLead, type LeadErrors, type LeadInput } from '../lib/lead';

export const THEME_KEY = 'zt-theme';
type Theme = 'light' | 'dark';

interface ThemeStore {
  current: Theme;
  readonly isDark: boolean;
  set(theme: Theme): void;
  toggle(): void;
}

interface ContactStore {
  /** Pre-selected service slug ('' when none). */
  service: string;
  intent: 'consultation' | 'proposal';
  /** Increments on every open so forms can react even when the service is unchanged. */
  opened: number;
  open(trigger: HTMLElement | null, params?: URLSearchParams): void;
  close(): void;
}

interface ServiceOption {
  slug: string;
  name: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const FORM_ENDPOINT = import.meta.env.PUBLIC_FORM_ENDPOINT || 'https://api.web3forms.com/submit';
const FORM_ACCESS_KEY = import.meta.env.PUBLIC_FORM_ACCESS_KEY || '';

const FAILURE_MESSAGES = {
  rejected: 'Your request could not be sent because it was rejected by our form service. Please review your details and try again.',
  server: 'Your request could not be sent due to a temporary service issue. Your details are preserved; please try again.',
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
  role: '',
  service: '',
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
      if (!reduceMotion) root.classList.add('theme-transition');
      root.classList.toggle('dark', theme === 'dark');
      this.current = theme;
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch {
        /* storage unavailable: theme applies for this page view only */
      }
      if (!reduceMotion) window.setTimeout(() => root.classList.remove('theme-transition'), 250);
    },

    toggle() {
      this.set(this.current === 'dark' ? 'light' : 'dark');
    },
  };
  Alpine.store('theme', themeStore);

  /* ------------------------------------------------------ contact dialog */
  let lastTrigger: HTMLElement | null = null;
  const dialog = () => document.getElementById('contact-dialog') as HTMLDialogElement | null;

  const contactStore: ContactStore = {
    service: '',
    intent: 'consultation',
    opened: 0,

    open(trigger, params) {
      const el = dialog();
      if (!el) return;
      lastTrigger = trigger;
      this.service = params?.get('service') ?? '';
      this.intent = params?.get('intent') === 'proposal' ? 'proposal' : 'consultation';
      this.opened += 1;
      window.dispatchEvent(new CustomEvent('contact-dialog-opened'));
      document.documentElement.classList.add('overflow-hidden');
      el.showModal();
      el.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    },

    close() {
      dialog()?.close();
    },
  };
  Alpine.store('contact', contactStore);

  // Progressive enhancement: CTAs are plain links to /contact; with JS they open the dialog instead.
  // Capture phase: runs before Astro's ClientRouter link handler, which skips clicks that are already prevented.
  document.addEventListener(
    'click',
    (event) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[data-contact-cta]');
      if (!link || !dialog()) return;
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      contactStore.open(link, new URL(link.href, location.href).searchParams);
    },
    { capture: true },
  );

  // The dialog persists across client-side navigation (transition:persist), so bind its listeners once.
  const bindDialog = () => {
    const el = dialog();
    if (!el || el.dataset.bound) return;
    el.dataset.bound = 'true';
    el.addEventListener('close', () => {
      document.documentElement.classList.remove('overflow-hidden');
      window.dispatchEvent(new CustomEvent('contact-dialog-closed'));
      lastTrigger?.focus();
      lastTrigger = null;
    });
    // Close on backdrop click (clicks on the dialog element itself, outside its content box).
    el.addEventListener('click', (event) => {
      if (event.target === el) el.close();
    });
  };
  document.addEventListener('DOMContentLoaded', bindDialog);
  document.addEventListener('astro:page-load', bindDialog);

  /* ------------------------------------------------- client-side navigation */
  // The router replaces <html> attributes with the incoming page's (which never carry `.dark`),
  // and the inline no-flash script does not re-run. Carry the theme into the new document before the swap.
  document.addEventListener('astro:before-swap', (event) => {
    const { newDocument } = event as Event & { newDocument: Document };
    newDocument.documentElement.classList.toggle('dark', themeStore.current === 'dark');
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
    closeTimer: 0,
    suppressFocusOpen: false,

    init() {
      // The header persists across client-side navigation: close any open menu once the new page is in place.
      document.addEventListener('astro:after-swap', () => {
        this.open = false;
        this.services = false;
      });
    },

    /** Hover intent: open immediately and cancel any pending close. */
    openServices() {
      window.clearTimeout(this.closeTimer);
      this.services = true;
    },

    /** Keyboard users reach the menu by focusing the Services link (Tab then moves into the panel). */
    openServicesOnFocus() {
      if (!this.suppressFocusOpen) this.openServices();
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

  /* ---------------------------------------------------------- lead form */
  Alpine.data('leadForm', (config: { services: ServiceOption[]; source: 'dialog' | 'page' }) => ({
    fields: emptyLead(),
    errors: {} as LeadErrors,
    status: 'idle' as FormStatus,
    failure: '',
    attempted: false,
    announcement: '',

    init() {
      if (config.source === 'page') {
        this.preselect(new URL(location.href).searchParams.get('service') ?? '');
      }
    },

    /** Called whenever the dialog opens. */
    onOpen() {
      if (this.status === 'success') this.reset();
      this.preselect(Alpine.store('contact') ? (Alpine.store('contact') as ContactStore).service : '');
    },

    preselect(slug: string) {
      const match = config.services.find((s) => s.slug === slug);
      if (match) this.fields.service = match.name;
    },

    reset() {
      this.fields = emptyLead();
      this.errors = {};
      this.status = 'idle';
      this.failure = '';
      this.attempted = false;
      this.announcement = '';
    },

    validate() {
      this.errors = validateLead(this.fields, [...config.services.map((s) => s.name), NOT_SURE]);
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
        this.$nextTick(() => this.$root.querySelector<HTMLElement>(`[name="${first}"]`)?.focus());
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
