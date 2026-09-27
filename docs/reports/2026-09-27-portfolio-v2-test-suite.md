# Portfolio v2 — a real, committed Playwright test suite

**Date:** 2026-09-27
**Branch:** `feat/01-portfolio-v2` (still nothing committed — files below are written and verified, not committed)

Follow-up to `2026-09-27-portfolio-v2-design-iteration.md`'s gap: until now, all verification of v2 was
one-off Playwright scripts written to the OS scratchpad and thrown away. This adds a permanent suite at
`v2/tests/e2e/`, re-verified against the current code (plain "fd." nav, `[ SHIPPED ]` / `[ IN PROGRESS ]`
bracket badges, circular About photo).

## What was installed

- `@playwright/test` and `@types/node` as devDependencies in `v2/package.json` (both scoped to `v2/`,
  nothing touches the root `package.json` or v1).
- Chromium's browser binary via `npx playwright install chromium` (was already cached locally; a clean
  machine would need this step once).
- `v2/playwright.config.ts`: runs against a **production build served by `astro preview`** (not `astro
  dev`), because the build uses `format: 'file'` output (e.g. `/v2/work/kvit` → `work/kvit.html` directly,
  no redirect) and that's what GitHub Pages actually serves. Playwright's `webServer` option runs
  `npm run build && npm run preview` itself, so `npm test` is a single standalone command — no one has to
  start a server by hand first. Chromium only, matching the coverage the first-build report already
  accepted (WebKit/Safari and real phones remain an open gap, noted in the config's comments).
- `.gitignore` extended with `test-results/`, `playwright-report/`, `blob-report/`, `playwright/.cache/`.

**Run it with:** `cd v2 && npm test` (equivalent to `npx playwright test`).

## What the suite covers

7 spec files under `v2/tests/e2e/`, 44 tests total:

- **`pages.spec.ts`** — all 5 pages (home + 4 case studies) x 2 viewports (390px, 1440px) x 2 themes = 20
  cases. Each asserts HTTP 200, no horizontal scroll (`scrollWidth` vs `clientWidth`), and zero console
  errors or uncaught page errors.
- **`theme.spec.ts`** — a stored `dark` preference is applied before first paint (checked right after
  `domcontentloaded`, since the theme script is inline and synchronous in `<head>`); falls back to the OS
  `prefers-color-scheme` when nothing is stored; the toggle stores the new value under the **shared**
  `theme` localStorage key (asserts the *entire* localStorage contents equal `{ theme: 'dark' }`, so a
  future namespacing change would be caught); the theme survives a client-side navigation into a case
  study.
- **`navigation.spec.ts`** — proves work-list navigation (and the "All work" back-link) uses Astro's
  ClientRouter transition, not a full reload, via the standard technique: set a plain property on
  `window` before navigating, then check it's still there after — a full reload would recreate the JS
  context and wipe it, a client-side transition wouldn't.
- **`stamp-badge.spec.ts`** — `prefers-reduced-motion: reduce` gets `stamp-appear` (fade only);
  `no-preference` gets `stamp-settle` (translate+fade), checked via `toHaveCSS('animation-name', …)` on
  both the home hero stamp and a case-study header stamp.
- **`specimen.spec.ts`** — for every `.specimen` on the home page, at both viewports, reads the label's
  text and the sibling text's live `getComputedStyle().fontSize`, and asserts the label equals
  `round(px * 0.75) + ' pt'` — no hardcoded expected sizes, so it can't drift from the component's own math.
- **`contact-form.spec.ts`** (13 tests) — every validator message in `ContactForm.astro`'s `validators`
  object (all 4 required-empty messages plus each field's minimum-length/format message); a fixed field
  clears its own error on the next input; the honeypot (`name="website"`) blocks a submit with no network
  request and no status change; a valid submit is intercepted at `**/api.emailjs.com/**` and the captured
  request body is asserted to match exactly — `service_id: service_5hchpb7`, `template_id:
  template_ypbcgdx`, `user_id: Q9eb1Tl_INctb6Lbm` (EmailJS's param name for the public key), and
  `template_params` with `from_name`/`from_email`/`subject`/`message`/`to_email`; "Sending…" shown while
  disabled; the success message; a rejected send (mocked HTTP 500) shows "Failed, try again" and reverts
  to "Send message" after ~3s; a blocked script (`**/email.min.js` aborted) shows "Mail service
  unavailable" without attempting a send.
- **`links.spec.ts`** — collects every `<a href>` across the 5 pages, asserts every internal one (as
  opposed to `mailto:`, `#anchor`, or another domain) is prefixed `/v2`, then fetches each and asserts 200.

## How the request shape was determined

Rather than guess EmailJS's wire format from the SDK's public API, I ran an exploratory Playwright script
against the real `@emailjs/browser@4` CDN script with network interception and read the actual outgoing
request. It POSTs to `https://api.emailjs.com/api/v1.0/email/send` with a JSON body of
`{ lib_version, user_id, service_id, template_id, template_params }` — the test's assertions are built from
that captured shape, not from assumption.

## Result — VERIFIED by automated test

**Command:** `cd v2 && npx playwright test`

First run, output captured directly (not summarized from memory):

```
43 passed (12.5s)
1 failed
  [chromium] › tests/e2e/contact-form.spec.ts:146:3 › sending through EmailJS › the submit button visually
  hides once the message sends successfully
```

The one failure was a real bug (see below), fixed as a one-line CSS change once Filip confirmed it was
small enough to do directly rather than through the coder subagent. Re-ran after the fix:

```
44 passed (6.0s)
```

**44/44 passing, VERIFIED by automated test**, re-run after the fix, output captured directly.

`npm run check` (astro check): 0 errors/warnings/hints, VERIFIED by automated test. `npm run build`: 5
pages, no errors, VERIFIED by automated test. `git status` at the repo root before and after this work
shows only `v2/` changed (plus the pre-existing, unrelated `.github/workflows/deploy-pages.yml` diff that
was already there at the start of this task) — v1 untouched, VERIFIED by automated test.

## A bug this suite found — fixed

**File:** `v2/src/components/ContactForm.astro` line 140 (`submitButton.hidden = true;`) interacting with
`v2/src/styles/global.css` lines 276-277 (`.button { display: inline-flex; … }`).

**What's wrong:** on a successful send, the code hides the submit button by setting its `hidden` DOM
property. But `.button`'s `display: inline-flex` is an **author** stylesheet rule, and the browser's
default `[hidden] { display: none }` is a **user-agent** stylesheet rule — author rules always win over
user-agent rules regardless of selector specificity. So `hidden=""` is present in the DOM (confirmed in the
failing test's locator dump) but the button stays visually `display: flex` and fully visible, forever
showing "Sending…" after a successful send instead of disappearing.

**Minimal repro:**
```js
await page.goto('/v2/');
console.log(await page.locator('[data-submit]').evaluate(el => getComputedStyle(el).display)); // "flex"
await page.evaluate(() => { document.querySelector('[data-submit]').hidden = true; });
console.log(await page.locator('[data-submit]').evaluate(el => getComputedStyle(el).display)); // still "flex"
```
Verified live (not just in the test) — same result both ways.

This was isolated into its own test (`contact-form.spec.ts:146`) so it failed on its own without blocking
the other 43 tests. Since the fix is a genuine one-liner, Filip had it done directly instead of routed to
the coder subagent: added `.button[hidden] { display: none; }` right after the existing `.button:active`
rule in `v2/src/styles/global.css`, which wins on source order at equal specificity against the base
`.button` rule. Rebuilt and re-ran the previously-failing test alone (passed), then the full suite (44/44).

## Gaps still open (unchanged from the design-iteration report)

- WebKit/Safari and real phones: still Chromium only, by design (matches the accepted scope of the
  original 94-check pass). Would need `devices['iPhone ...']`/`webkit` projects added to
  `playwright.config.ts` if wanted.
- The actual GitHub Actions deploy and GitHub Pages serving behavior: this suite runs entirely against a
  local `astro preview`, not the real Pages host.
- A real EmailJS send: deliberately never attempted; every contact-form test intercepts or blocks the
  network.
