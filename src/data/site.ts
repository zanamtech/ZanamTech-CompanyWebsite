export const site = {
  name: 'ZanamTech',
  legalName: 'ZanamTech',
  tagline: 'Remote-first Cloud, DevOps & AI engineering',
  description:
    'ZanamTech is a remote-first Cloud, DevOps & AI engineering firm. We run, secure and modernise the cloud platforms growing businesses depend on, and automate the work that slows them down, with documented runbooks, transparent reporting and no lock-in.',
  email: 'contact@zanamtech.com',
  privacyEmail: 'privacy@zanamtech.com',
  securityEmail: 'security@zanamtech.com',
} as const;

export const pillars = ['Enterprise-grade', 'High-availability', 'Zero-trust security'] as const;

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
