import { expect, test } from '@playwright/test';
import { ROUTES, THEMES, VIEWPORTS, routeLabel, setStoredTheme, trackConsoleErrors } from './support/routes';

/**
 * The full page/viewport/theme matrix (5 pages x 2 viewports x 2 themes),
 * re-verifying what the original 94-check scratchpad run covered: every page
 * loads, fits its viewport with no horizontal scroll, and logs no console
 * errors, in both themes.
 */
for (const route of ROUTES) {
  for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
    for (const theme of THEMES) {
      test(`${routeLabel(route)} loads at ${viewportName} in ${theme} theme with no horizontal scroll or console errors`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        await setStoredTheme(page, theme);
        const errors = trackConsoleErrors(page);

        const response = await page.goto(route);
        expect(response?.status()).toBe(200);

        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        expect(scrollWidth, `page is ${scrollWidth - clientWidth}px wider than its viewport`).toBeLessThanOrEqual(
          clientWidth + 1,
        );

        expect(errors, `console errors on ${route}: ${errors.join(' | ')}`).toHaveLength(0);
      });
    }
  }
}
