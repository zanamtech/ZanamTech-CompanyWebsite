export const site = {
  name: 'ZanamTech',
  tagline: 'Cloud, DevOps & AI Engineering',
  description:
    'ZanamTech is a Cloud, DevOps & AI engineering firm. We run, secure and modernise the cloud platforms growing businesses depend on, and automate the work that slows them down, with documented runbooks, transparent reporting and no lock-in.',
  /** Home page meta description (≤ 155 characters, checked by lint:content); `description` stays in the JSON-LD. */
  metaDescription:
    'ZanamTech runs, secures and modernises AWS, Azure and Google Cloud platforms and automates manual work with practical AI. Documented runbooks, no lock-in.',
  email: 'contact@zanamtech.com',
  privacyEmail: 'privacy@zanamtech.com',
  securityEmail: 'security@zanamtech.com',
} as const;

/** Footer wording (shorter than the site description). */
export const footerCopy = {
  tagline: 'Cloud, DevOps & AI engineering',
  description:
    'Cloud, DevOps & AI engineering for growing businesses. We run, secure and modernise cloud platforms on AWS, Azure and Google Cloud, with documented runbooks and no lock-in.',
} as const;

export const cta = {
  primary: 'Book a Strategy Consultation',
  href: '/contact',
} as const;

export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: 'Services', href: '/services' },
  { label: 'How We Work', href: '/approach' },
  { label: 'Insights', href: '/insights' },
  { label: 'About', href: '/about' },
];

export const companyLinks: NavLink[] = [
  { label: 'About', href: '/about' },
  { label: 'How We Work', href: '/approach' },
  { label: 'Start here', href: '/start-here' },
  { label: 'Industries', href: '/industries' },
  { label: 'Insights', href: '/insights' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Contact', href: '/contact' },
];

/** Legal and trust links shown in the footer bar. */
export const legalLinks: NavLink[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Trust', href: '/trust' },
];

/** Regions served: one list for /about "At a glance" and the contact form's Region dropdown (plus "Other"). */
export const regionsServed = [
  'United States',
  'Canada',
  'United Kingdom',
  'Europe',
  'Gulf Cooperation Council (GCC)',
  'Australia & New Zealand',
] as const;
