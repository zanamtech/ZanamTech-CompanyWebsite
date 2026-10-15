// @ts-check
/**
 * Markdown external links: every link to another origin opens in a new tab with rel="noopener noreferrer".
 * A hast plugin for Sätteri, Astro's default Markdown processor (the same role a rehype plugin plays in unified).
 * Component links set these attributes explicitly; this covers links written in Markdown content.
 *
 * @param {string} site The site URL; links to its origin are left alone.
 */
export function externalLinks(site) {
  const siteOrigin = new URL(site).origin;
  return {
    name: 'external-links',
    element: {
      filter: ['a'],
      /**
       * @param {{ properties?: Record<string, unknown> }} node
       * @param {{ setProperty(node: unknown, name: string, value: unknown): void }} ctx
       */
      visit(node, ctx) {
        const href = node.properties?.href;
        if (typeof href !== 'string' || !/^https?:\/\//i.test(href)) return;
        let origin;
        try {
          origin = new URL(href).origin;
        } catch {
          return;
        }
        if (origin === siteOrigin) return;
        const rel = node.properties?.rel;
        const existing = Array.isArray(rel) ? rel.map(String) : typeof rel === 'string' ? rel.split(/\s+/) : [];
        ctx.setProperty(node, 'target', '_blank');
        ctx.setProperty(node, 'rel', [...new Set([...existing.filter(Boolean), 'noopener', 'noreferrer'])]);
      },
    },
  };
}
