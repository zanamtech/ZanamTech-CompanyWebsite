/**
 * Leadership profile for /about (spec 002 FR-025). Capability bio only: no years, no badges until earned, no city.
 * Empty strings hide the related element; certifications render only once earned.
 */
export interface LeadershipProfile {
  name: string;
  role: string;
  bio: string[];
  linkedin: string;
  companyLinkedin: string;
  photo: string;
  certifications: { name: string; verifyUrl: string }[];
}

export const leadership: LeadershipProfile = {
  name: 'Mubashir Ahmed',
  role: 'Founder & Lead Architect',
  bio: [
    'Leads every ZanamTech engagement from architecture through delivery and reporting.',
    'Runs production Azure estates end to end: App Services, load balancing, managed databases, Dev/QA/UAT/Prod environments, CI/CD pipelines, backups and repository governance with written SOPs.',
    'Builds cloud-native web applications and practical AI automations on managed cloud services.',
  ],
  linkedin: '',
  companyLinkedin: '',
  photo: '',
  certifications: [],
};
