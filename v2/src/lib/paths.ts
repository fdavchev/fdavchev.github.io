// Every internal URL goes through here, reading Astro's BASE_URL rather than
// a hardcoded prefix (there's no `base` in astro.config.mjs since the 2026-09-27 root swap).
const base = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** The home page path: '/' now that the site lives at the root. */
export const homePath = base || '/';

/** Prefix a site-relative path with the configured base: withBase('work/kvit') -> '/work/kvit'. */
export function withBase(path: string): string {
  return `${base}/${path.replace(/^\/+/, '')}`;
}

/** Link to a section of the home page, as an in-page hash when already on the home page. */
export function sectionHref(sectionId: string, currentPathname: string): string {
  const isHome = (currentPathname.replace(/\/+$/, '') || '/') === homePath;
  return isHome ? `#${sectionId}` : `${homePath}#${sectionId}`;
}
