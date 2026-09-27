import { expect, test } from '@playwright/test';

/**
 * StampBadge's one authored motion (src/components/StampBadge.astro):
 * `stamp-settle` (translate + fade) normally, `stamp-appear` (fade only)
 * under prefers-reduced-motion: reduce.
 */
test.describe('with no motion preference', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('the hero stamp settles in with the translate+fade animation', async ({ page }) => {
    await page.goto('');
    const stamp = page.locator('[data-strike]').first();
    await expect(stamp).toHaveCSS('animation-name', 'stamp-settle');
  });
});

test.describe('with prefers-reduced-motion: reduce', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the hero stamp only fades in, without the translate', async ({ page }) => {
    await page.goto('');
    const stamp = page.locator('[data-strike]').first();
    await expect(stamp).toHaveCSS('animation-name', 'stamp-appear');
  });

  test('a case-study header stamp also only fades in', async ({ page }) => {
    await page.goto('work/documind-ai');
    const stamp = page.locator('[data-strike]').first();
    await expect(stamp).toHaveCSS('animation-name', 'stamp-appear');
  });
});
