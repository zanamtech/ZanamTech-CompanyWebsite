import { defineMiddleware } from 'astro:middleware';

/**
 * External links, site-wide: every <a href="http(s)://…"> pointing at another origin opens in a new tab with
 * rel="noopener noreferrer". Applied while rendering (dev and the static build), so no page has to remember it.
 * Astro's ClientRouter already leaves such links alone (other origin, target="_blank", download, mailto:/tel:,
 * modifier keys, non-left clicks), so the browser handles them natively.
 */
const ANCHOR = /<a\b([^>]*?)>/gi;
const HREF = /\bhref\s*=\s*"(https?:\/\/[^"]+)"/i;

export function markExternalLinks(html: string, siteOrigin: string): string {
  return html.replace(ANCHOR, (tag, attrs: string) => {
    const href = attrs.match(HREF)?.[1];
    if (!href) return tag;
    let origin: string;
    try {
      origin = new URL(href).origin;
    } catch {
      return tag;
    }
    if (origin === siteOrigin) return tag;
    let next = attrs;
    if (/\btarget\s*=/i.test(next)) next = next.replace(/\btarget\s*=\s*"[^"]*"/i, 'target="_blank"');
    else next += ' target="_blank"';
    const rel = next.match(/\brel\s*=\s*"([^"]*)"/i);
    if (rel) {
      const values = new Set([...rel[1].split(/\s+/).filter(Boolean), 'noopener', 'noreferrer']);
      next = next.replace(rel[0], `rel="${[...values].join(' ')}"`);
    } else next += ' rel="noopener noreferrer"';
    return `<a${next}>`;
  });
}

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;
  const siteOrigin = (context.site ?? context.url).origin;
  const html = markExternalLinks(await response.text(), siteOrigin);
  return new Response(html, { status: response.status, statusText: response.statusText, headers: response.headers });
});
