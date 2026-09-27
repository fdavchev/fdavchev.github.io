import { expect, test } from '@playwright/test';
import { VIEWPORTS } from './support/routes';

/**
 * Specimen.astro reads the live computed font size and labels it in points
 * (`px * 0.75`, rounded). This measures the same way, from getComputedStyle,
 * so it fails if the label and the text it describes ever drift apart.
 */
for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
  test(`specimen size labels match the rendered font size at ${viewportName}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('');

    const specimens = page.locator('.specimen');
    const count = await specimens.count();
    expect(count).toBeGreaterThan(0);

    for (let index = 0; index < count; index += 1) {
      const specimen = specimens.nth(index);
      const labelText = await specimen.locator('[data-specimen-size]').textContent();
      const fontSizePx = await specimen
        .locator('.specimen__text')
        .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));
      const expectedPoints = Math.round(fontSizePx * 0.75);
      expect(labelText).toBe(`${expectedPoints} pt`);
    }
  });
}
