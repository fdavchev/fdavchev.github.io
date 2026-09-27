import type { Page } from '@playwright/test';

/**
 * The 5 pages the site has: home plus one case study per project in
 * src/content/projects. Relative to `baseURL` (no leading slash) so
 * `page.goto()` resolves under `/v2` instead of the server root — see
 * support/config.ts for why a leading slash would drop the base path.
 */
export const ROUTES = ['', 'work/documind-ai', 'work/book-scanner', 'work/classroom-presence', 'work/kvit'] as const;

/** A human-readable label for a route, for test titles. */
export function routeLabel(route: string): string {
  return route === '' ? 'home' : `/${route}`;
}

export const VIEWPORTS = {
  mobile: { width: 390, height: 844 },
  desktop: { width: 1440, height: 900 },
} as const;

export const THEMES = ['light', 'dark'] as const;

/**
 * Starts collecting this page's console errors and uncaught page errors.
 * Call after the page is created, before navigating, so nothing is missed.
 */
export function trackConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

/** Sets the stored theme preference before the page's first script runs. */
export async function setStoredTheme(page: Page, theme: 'light' | 'dark'): Promise<void> {
  await page.addInitScript((value) => {
    localStorage.setItem('theme', value);
  }, theme);
}
