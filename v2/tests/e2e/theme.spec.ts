import { expect, test } from '@playwright/test';
import { setStoredTheme } from './support/routes';

test.describe('theme persistence', () => {
  test('a stored dark preference is applied before first paint, with no light flash', async ({ page }) => {
    await setStoredTheme(page, 'dark');
    await page.goto('');
    // The theme script is inline in <head> and runs synchronously, so by the
    // time 'domcontentloaded' fires the attribute is already set: nothing here
    // waits for a later event that could hide a flash.
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('falls back to the OS color-scheme preference when nothing is stored', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('clicking the toggle stores the new theme under the shared "theme" localStorage key', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await page.click('.theme-toggle');

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    const storage = await page.evaluate(() => ({ ...localStorage }));
    expect(storage).toEqual({ theme: 'dark' });
  });

  test('survives a client-side navigation into a case study without flashing back to the other theme', async ({
    page,
  }) => {
    await page.goto('');
    await page.click('.theme-toggle');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.locator('.project-row__link').first().click();
    await page.waitForURL('**/work/**');

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    const storage = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storage).toBe('dark');
  });
});
