import { expect, test } from '@playwright/test';

test('clicking into a case study from the work list uses a client-side transition, not a full page reload', async ({
  page,
}) => {
  await page.goto('');
  // A fresh document/JS context can't have this property; a full reload would
  // wipe it, but Astro's ClientRouter swaps content in place and keeps it.
  await page.evaluate(() => {
    (window as unknown as { __e2eMarker?: string }).__e2eMarker = 'kept-across-navigation';
  });

  await page.locator('.project-row__link').first().click();
  await page.waitForURL('**/work/**');
  await expect(page.locator('.case-header')).toBeVisible();

  const marker = await page.evaluate(() => (window as unknown as { __e2eMarker?: string }).__e2eMarker);
  expect(marker).toBe('kept-across-navigation');
});

test('following "All work" back to the home page is also a client-side transition', async ({ page }) => {
  await page.goto('work/kvit');
  await page.evaluate(() => {
    (window as unknown as { __e2eMarker?: string }).__e2eMarker = 'kept-across-navigation';
  });

  await page.locator('.case-header__back').click();
  await page.waitForURL('**/#work');

  const marker = await page.evaluate(() => (window as unknown as { __e2eMarker?: string }).__e2eMarker);
  expect(marker).toBe('kept-across-navigation');
});
