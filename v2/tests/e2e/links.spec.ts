import { expect, test } from '@playwright/test';
import { ORIGIN } from './support/config';
import { ROUTES } from './support/routes';

/** True for a link that points somewhere on this site, as opposed to mailto:, tel:, or another domain. */
function isInternal(href: string): boolean {
  return href.startsWith('/') || href.startsWith('#');
}

test('every internal link across all 5 pages resolves', async ({ page, request }) => {
  const internalHrefs = new Set<string>();
  const externalHrefs = new Set<string>();

  for (const route of ROUTES) {
    await page.goto(route);
    const hrefs = await page.$$eval('a[href]', (anchors) => anchors.map((a) => a.getAttribute('href') ?? ''));
    for (const href of hrefs) {
      if (isInternal(href)) internalHrefs.add(href);
      else externalHrefs.add(href);
    }
  }

  expect(internalHrefs.size, 'expected to find internal links across the 5 pages').toBeGreaterThan(0);
  expect(externalHrefs.size, 'expected to find at least the external contact/social links').toBeGreaterThan(0);

  const brokenLinks: string[] = [];
  for (const href of internalHrefs) {
    if (href.startsWith('#')) continue; // same-page anchor, not a separate route
    expect(href, `internal link should be site-relative: ${href}`).toMatch(/^\/(?!\/)/);

    const response = await request.get(`${ORIGIN}${href}`);
    if (!response.ok()) brokenLinks.push(`${href} -> ${response.status()}`);
  }

  expect(brokenLinks, `broken internal links:\n${brokenLinks.join('\n')}`).toHaveLength(0);
});
