import type { Alpine } from 'alpinejs';
import { reducedMotion } from '../motion';

/** The floating header: scroll backdrop, Services mega-menu (hover, focus and touch) and the mobile drawer. */
export function registerHeader(Alpine: Alpine) {
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
        window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
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
}
