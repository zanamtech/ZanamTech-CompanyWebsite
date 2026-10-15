import type { Alpine } from 'alpinejs';
import { FIELD_ORDER, OTHER_SERVICE, submitLead, validateLead, type LeadErrors, type LeadInput } from '../../lib/lead';
import { FORM_ACCESS_KEY, FORM_ENDPOINT } from '../../lib/form-config';

interface ServiceOption {
  slug: string;
  name: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';
type MenuField = 'service' | 'budget' | 'region' | 'companySize' | 'cloudPlatform';

interface LeadFormConfig {
  services: ServiceOption[];
  idPrefix: string;
  /** Each dropdown's option values, in display order (the same lists the server rendered). */
  options: Record<MenuField, string[]>;
}

const FAILURE_MESSAGES = {
  rejected:
    'Your request could not be sent because it was rejected by our form service. Please review your details and try again.',
  server:
    'Your request could not be sent due to a temporary service issue. Your details are preserved; please try again.',
  network: 'Your request could not be sent. Please check your connection and try again; your details are preserved.',
  timeout: 'Your request could not be sent because the service took too long to respond. Please try again.',
} as const;

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

/** The contact form (src/components/ContactForm.astro): validation, the custom dropdowns and submission. */
export function registerLeadForm(Alpine: Alpine) {
  Alpine.data('leadForm', (config: LeadFormConfig) => ({
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
      return config.options[field];
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
}
