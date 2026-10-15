/**
 * Leadership profile for /about (spec 002 FR-025). Capability bio only: no years, no badges until earned, no city.
 * Empty strings hide the related element. The photo is src/assets/team/mubashir.jpg, imported by /about so Astro
 * resizes it (never the full original).
 */
export interface LeadershipProfile {
  name: string;
  role: string;
  bio: string[];
  linkedin: string;
  companyLinkedin: string;
}

export const leadership: LeadershipProfile = {
  name: 'Mubashir Ahmed',
  role: 'Founder & Lead Architect',
  bio: [
    'Leads every ZanamTech engagement from architecture through delivery and reporting.',
    'Runs production cloud estates end to end: app platforms, load balancing, managed databases, Dev/QA/UAT/Prod environments, CI/CD pipelines, backups and repository governance with written SOPs.',
    'Builds cloud-native web applications and practical AI automations on managed cloud services.',
  ],
  linkedin: 'https://www.linkedin.com/in/mubashir-ahmed-088800174',
  companyLinkedin: 'https://www.linkedin.com/company/zanamtech/',
};
