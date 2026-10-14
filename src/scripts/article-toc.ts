/**
 * Article "On this page" list: highlights the section being read. Each H2 is observed; the active item is the last
 * heading that has crossed the upper part of the viewport. The active link gets aria-current="location" (styled in
 * the page). Re-binds after client-side navigation.
 */
let observer: IntersectionObserver | null = null;

function setup() {
  observer?.disconnect();
  observer = null;
  const toc = document.querySelector<HTMLElement>('[data-article-toc]');
  if (!toc || !('IntersectionObserver' in window)) return;
  const links = Array.from(toc.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
  const headings = links
    .map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))))
    .filter((h): h is HTMLElement => h !== null);
  if (!headings.length) return;

  const setActive = (id: string) =>
    links.forEach((a) => {
      if (a.hash.slice(1) === id) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });

  const update = () => {
    const line = window.innerHeight * 0.3;
    let current = headings[0];
    for (const h of headings) if (h.getBoundingClientRect().top <= line) current = h;
    setActive(current.id);
  };

  observer = new IntersectionObserver(update, { rootMargin: '0px 0px -70% 0px', threshold: [0, 1] });
  headings.forEach((h) => observer!.observe(h));
  update();
}

document.addEventListener('astro:page-load', setup);
