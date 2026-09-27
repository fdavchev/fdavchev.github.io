// @ts-check
import { defineConfig } from 'astro/config';

// Swapped to the root 2026-09-27 (was staged at /v2/ — see docs/DECISIONS.md).
// Every link reads BASE_URL, so this was the only file that needed to change.
export default defineConfig({
  site: 'https://fdavchev.github.io',
  trailingSlash: 'never',
  build: {
    // work/kvit.html rather than work/kvit/index.html: GitHub Pages serves
    // /work/kvit straight from the .html file instead of redirecting to
    // /work/kvit/, which is what trailingSlash 'never' needs.
    format: 'file',
  },
});
