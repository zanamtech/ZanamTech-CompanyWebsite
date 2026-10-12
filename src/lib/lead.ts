// Lead validation and submission — contract: specs/002-enterprise-repositioning/contracts/lead-submission.md

export interface LeadInput {
  name: string;
  email: string;
  company: string;
  /** Optional; international format encouraged (e.g. +1 555 010 0000). */
  phone: string;
  service: string;
  /** Optional qualifying fields (spec 002 FR-033). */
  region: string;
  companySize: string;
  cloudPlatform: string;
  /** Optional engagement-size band (no currency amounts, per Constitution III). */
  budget: string;
  message: string;
  consent: boolean;
  /** Honeypot; must stay empty for genuine visitors. */
  botcheck: string;
}

export type LeadField = Exclude<keyof LeadInput, 'botcheck'>;
export type LeadErrors = Partial<Record<LeadField, string>>;

export type SubmitResult =
  | { ok: true; spam?: boolean }
  | { ok: false; reason: 'rejected' | 'server' | 'network' | 'timeout' };

export const TIMEOUT_MS = 10_000;

/** Fallback choice in the required service dropdown. */
export const OTHER_SERVICE = 'Other / Not sure yet';

/** Agency partnership option (spec 002 FR-032); also selectable via ?service=agency-partnership. */
export const AGENCY_PARTNERSHIP = 'Agency partnership';
export const AGENCY_PARTNERSHIP_SLUG = 'agency-partnership';

export const REGION_OPTIONS = ['US / Canada', 'UK / Europe', 'GCC', 'Other'] as const;
export const COMPANY_SIZE_OPTIONS = ['1–10', '11–50', '51–200', '201–1,000', '1,000+'] as const;
export const CLOUD_PLATFORM_OPTIONS = ['AWS', 'Azure', 'Google Cloud', 'Multi-cloud', 'Other'] as const;

/** Engagement-size bands for the optional budget question; scope-based labels, no prices. */
export const BUDGET_OPTIONS = [
  'Focused engagement (single workload or audit)',
  'Mid-size project (multiple systems)',
  'Large-scale program (organization-wide)',
  'Not sure yet',
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9][0-9\s().-]{6,19}$/;

/** Field order used to focus the first invalid control. */
export const FIELD_ORDER: LeadField[] = [
  'name',
  'email',
  'company',
  'phone',
  'service',
  'budget',
  'region',
  'companySize',
  'cloudPlatform',
  'message',
  'consent',
];

const OPTIONAL_SELECTS = [
  ['region', REGION_OPTIONS],
  ['companySize', COMPANY_SIZE_OPTIONS],
  ['cloudPlatform', CLOUD_PLATFORM_OPTIONS],
] as const;

export function validateLead(input: LeadInput, allowedServices: readonly string[] = []): LeadErrors {
  const errors: LeadErrors = {};
  const name = input.name.trim();
  const company = input.company.trim();
  const message = input.message.trim();

  if (name.length < 2 || name.length > 100) errors.name = 'Please enter your full name.';
  if (!EMAIL_RE.test(input.email.trim())) errors.email = 'Please enter a valid email address.';
  if (company.length < 1 || company.length > 120) errors.company = 'Please enter your company name.';
  const phone = input.phone.trim();
  if (phone && !PHONE_RE.test(phone)) errors.phone = 'Please enter a valid phone number, including the country code.';
  if (!input.service) errors.service = 'Please select the service you need.';
  else if (allowedServices.length > 0 && !allowedServices.includes(input.service)) {
    errors.service = 'Please choose a service from the list.';
  }
  if (input.budget && !(BUDGET_OPTIONS as readonly string[]).includes(input.budget)) {
    errors.budget = 'Please choose an option from the list.';
  }
  for (const [field, options] of OPTIONAL_SELECTS) {
    if (input[field] && !(options as readonly string[]).includes(input[field])) errors[field] = 'Please choose an option from the list.';
  }
  if (message.length < 20) errors.message = 'Please describe your requirements (at least 20 characters).';
  else if (message.length > 2000) errors.message = 'Please keep your message under 2000 characters.';
  if (!input.consent) errors.consent = 'Please accept the privacy notice to continue.';

  return errors;
}

interface SubmitOptions {
  endpoint: string;
  accessKey: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

export async function submitLead(input: LeadInput, options: SubmitOptions): Promise<SubmitResult> {
  // Honeypot filled: report success without sending, so automated agents get no signal.
  if (input.botcheck) return { ok: true, spam: true };

  const { endpoint, accessKey, timeoutMs = TIMEOUT_MS, fetchImpl = fetch } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: 'New consultation request — ZanamTech website',
        from_name: 'ZanamTech Website',
        name: input.name.trim(),
        email: input.email.trim(),
        company: input.company.trim(),
        phone: input.phone.trim(),
        service: input.service,
        region: input.region || 'Not specified',
        companySize: input.companySize || 'Not specified',
        cloudPlatform: input.cloudPlatform || 'Not specified',
        budget: input.budget || 'Not specified',
        message: input.message.trim(),
        consent: true,
        botcheck: '',
      }),
      signal: controller.signal,
    });
    if (response.ok) return { ok: true };
    return { ok: false, reason: response.status >= 500 ? 'server' : 'rejected' };
  } catch (error) {
    return { ok: false, reason: (error as Error)?.name === 'AbortError' ? 'timeout' : 'network' };
  } finally {
    clearTimeout(timer);
  }
}
