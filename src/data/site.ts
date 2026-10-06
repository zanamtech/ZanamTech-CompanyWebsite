export const site = {
  name: 'ZanamTech',
  legalName: 'ZanamTech',
  tagline: 'Enterprise Cloud, Security & AI Engineering',
  description:
    'ZanamTech architects high-availability cloud environments, zero-trust security perimeters, DevSecOps automation and secure private AI workflows for growth-focused enterprises.',
  email: 'contact@zanamtech.com',
} as const;

export const pillars = ['Enterprise-grade', 'High-availability', 'Zero-trust security'] as const;

export const cta = {
  primary: 'Book a Strategy Consultation',
  href: '/contact',
} as const;

export const metricsFootnote =
  'Outcomes vary by environment; SLA commitments are defined per Statement of Work.';

export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: 'Services', href: '/services' },
  { label: 'Approach', href: '/approach' },
  { label: 'Industries', href: '/industries' },
  { label: 'About', href: '/about' },
];

export const companyLinks: NavLink[] = [
  { label: 'About', href: '/about' },
  { label: 'Approach', href: '/approach' },
  { label: 'Industries', href: '/industries' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy' },
];
