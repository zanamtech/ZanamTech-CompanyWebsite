import { PUBLIC_FORM_ACCESS_KEY, PUBLIC_FORM_ENDPOINT } from 'astro:env/client';

// The form endpoint and its public, domain-restricted key (astro:env schema in astro.config.mjs). Docker passes an unset
// build arg as an empty string, so an empty value falls back to the default too.
export const FORM_ENDPOINT = PUBLIC_FORM_ENDPOINT || 'https://api.web3forms.com/submit';
export const FORM_ACCESS_KEY = PUBLIC_FORM_ACCESS_KEY || '';
