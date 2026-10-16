import type { Alpine } from 'alpinejs';
import { registerTheme } from './alpine/theme';
import { registerRouter } from './alpine/router';
import { registerHeader } from './alpine/header';
import { registerHero } from './alpine/hero';
import { registerLeadForm } from './alpine/lead-form';

// Alpine entrypoint (astro.config.mjs): the integration calls this, then starts Alpine on DOMContentLoaded. Every
// component is registered here, the contact form included: after a client-side navigation into /contact, Alpine
// initializes the new page before that page's own scripts run, so a component registered from ContactForm.astro would
// not exist yet.
export default (Alpine: Alpine) => {
  registerRouter(registerTheme(Alpine));
  registerHeader(Alpine);
  registerHero(Alpine);
  registerLeadForm(Alpine);
};
