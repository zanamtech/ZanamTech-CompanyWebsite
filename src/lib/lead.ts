// Lead validation and submission — contract: specs/001-enterprise-website-baseline/contracts/lead-submission.md

export interface LeadInput {
  name: string;
  email: string;
  company: string;
  role: string;
  service: string;
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

export const NOT_SURE = 'Not sure yet';
export const TIMEOUT_MS = 10_000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Field order used to focus the first invalid control. */
export const FIELD_ORDER: LeadField[] = ['name', 'email', 'company', 'role', 'service', 'message', 'consent'];

export function validateLead(input: LeadInput, allowedServices: readonly string[] = []): LeadErrors {
  const errors: LeadErrors = {};
  const name = input.name.trim();
  const company = input.company.trim();
  const message = input.message.trim();

  if (name.length < 2 || name.length > 100) errors.name = 'Please enter your full name.';
  if (!EMAIL_RE.test(input.email.trim())) errors.email = 'Please enter a valid work email address.';
  if (company.length < 1 || company.length > 120) errors.company = 'Please enter your company name.';
  if (input.role.trim().length > 100) errors.role = 'Please keep your role under 100 characters.';
  if (input.service && allowedServices.length > 0 && !allowedServices.includes(input.service) && input.service !== NOT_SURE) {
    errors.service = 'Please choose a service from the list.';
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
        role: input.role.trim(),
        service: input.service || NOT_SURE,
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
