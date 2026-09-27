# Decisions

## 2026-09-27 — Rebuild as v2, staged under /v2/, not a refactor of index.html

**What:** Build a new portfolio from scratch in `v2/`, deployed to `fdavchev.github.io/v2/` (noindex),
instead of editing the existing `index.html` in place.

**Why:** v1 is a single 1,786-line file that undersells real, tested, shipped work (e.g. Book Scanner is
a live PWA with 136+ tests and an accuracy benchmark; the site describes it as "a TypeScript web app").
Its facts are also stale (still says "3 months into an internship" and "graduating 2026" as future tense
after both happened). A clean rebuild was chosen over incremental edits so the visual language, copy, and
information architecture could all be reconsidered together rather than patched piecemeal.

**Alternatives rejected:** Editing index.html directly — rejected because GitHub Pages auto-deploys every
push to `main`, so a live in-place rebuild leaves the public site broken or half-done for the whole build
window, with no side-by-side comparison and no rollback.

## 2026-09-27 — Staging in a branch + /v2/ subfolder, not editing main/root directly

**What:** Work happens on branch `feat/01-portfolio-v2`; the new site lives at `/v2/` alongside the
untouched v1 root, and only gets swapped to the root once Filip has reviewed it (see BACKLOG.md).

**Why:** Filip checks work from his phone without a terminal and wants to preview the finished v2 live
before it replaces the current site. The branch keeps unfinished work off `main`; the `/v2/` path keeps
it off the live root URL until he approves the swap.

**Confirmed by Filip (2026-09-27):** when swapping v2 to the root later, remove v1's `index.html` from
git tracking only (`git rm --cached`), not from disk — he wants to keep a local copy.

## 2026-09-27 — Stack: Astro, plain CSS, Markdown content collection (not React, not Tailwind)

**What:** Astro with static output, custom-property CSS (no utility framework), projects stored as a
Markdown content collection.

**Why:** The site needs 4 case-study pages plus a home page sharing one layout, image optimisation, and
ideally a page transition between the project list and its case study — Astro gives all of this with zero
shipped JS for content that doesn't need it. React was considered (Filip's reference point, since "all the
sites I know are done w/ React") but rejected: it ships a JS runtime for what is fundamentally static
content, which is the wrong trade for a portfolio's load time and Core Web Vitals.

**Researched config (confirmed 2026-09-27, current Astro major = 7):**

- Content collections use the `glob()` loader (the pre-v5 `type: 'content'` syntax is gone):
  ```ts
  // src/content.config.ts
  import { defineCollection } from 'astro:content';
  import { glob } from 'astro/loaders';
  import { z } from 'astro/zod';

  const projects = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
    }),
  });
  export const collections = { projects };
  ```
- Astro 7 defaults to a new Markdown/MDX pipeline ("Sätteri") replacing remark/rehype by default. Fine for
  plain Markdown with no custom plugins; if a later content plugin needs remark/rehype, install
  `@astrojs/markdown-remark` explicitly to restore the old config surface.
- Subpath config:
  ```js
  // astro.config.mjs
  export default defineConfig({
    site: 'https://fdavchev.github.io',
    base: '/v2',
  });
  ```
  Both `site` and `base` are required together — `site` gives Astro the origin needed to build absolute
  canonical/OG URLs (`new URL(Astro.url.pathname, Astro.site)`), `base` alone isn't enough.
- **Every internal link/asset path must go through `import.meta.env.BASE_URL`, never a hardcoded `/v2/...`.**
  This is what makes the later "swap to root" a one-line config change (delete `base: '/v2'`) instead of a
  find-and-replace across every page. Set `trailingSlash: 'never'` explicitly and be consistent about
  writing (or not writing) a trailing `/` after `BASE_URL` in links — Astro won't add one for you.
- View transitions: `<ClientRouter />` (renamed from `<ViewTransitions />`, old name still works but is
  soft-deprecated). Astro handles `prefers-reduced-motion` itself — the component ships a built-in media
  query that disables the animation and falls back to an instant swap; no manual gating needed.
- Node 22.12.0+ required in CI (odd releases like v23 aren't supported).
- No existing "official" template combines a subfolder Astro build with untouched root static files into
  one GitHub Pages artifact — the researcher assembled the workflow from GitHub's documented custom-workflow
  building blocks (`actions/checkout` → `actions/setup-node` → `npm ci && npm run build` in `v2/` →
  manual `cp` assembly into `_site/` → `actions/upload-pages-artifact@v5` → `actions/deploy-pages@v5`).
  Untested end-to-end; verify the first CI run rather than trusting it blind. Exact root-file list to
  preserve (index.html, og-image.png, etc.) needs confirming against the actual repo root before wiring
  the `cp` commands, and the glob must not sweep up `v2/`'s own source.

## 2026-09-27 — Facts corrected from v1

- Internship: "3 months into an internship" (v1, present tense) → Engineer Intern, Imbrium Tech, Shtip,
  31 Jul – 31 Oct 2026 (per Filip + his CV; the CV itself says "Aug 2026 – Present", which is why we use
  Filip's dates directly and flag the CV as needing an update once the internship ends).
- Graduation: "Graduating Summer 2026" (future tense) → BSc Computer Science, UGD Shtip, graduated
  Fall 2026 (per CV).
- Kvit added as a 4th case study (not in v1 at all) — labelled clearly "in progress", since only the
  architecture skeleton exists so far.
- Internship description corrected again, from Filip directly (2026-09-27): not "real-time shipment
  tracking" (implies live location/GPS tracking, which the system doesn't do) — it's shipment *status*
  tracking (inbound, delivered, returned, not called, etc.) with real-time status reports, not real-time
  location. Copy updated in `docs/v2-copy-review.md`.

## 2026-09-27 — About photo: circular crop, and why the crop is wider than it looks like it needs to be

Filip asked for the About photo to be circular instead of square. A tight square crop around just the
face and thumbs-up looked right as a square, but a circle mask clips corners, and the thumbs-up sat close
to one — so the tight crop lost most of the thumb once masked. Fixed by zooming out to a looser square
(900x900 from the 1200x1600 source, at (250,300)-(1150,1200)) that keeps both face and thumb inside the
circle's safe area, verified visually before committing the CSS.

## 2026-09-27 — Nav mark: reverted to plain "fd." (v1's style), stamp badges redesigned

Filip rejected all 3 logomark options from a design round (proof stamp / registration monogram / proof
mark) and asked for something closer to v1's original small "fd·" nav mark instead of a bigger designed
symbol. Reverted `Nav.astro` to a plain "fd." (mono font, red dot), removing `RegistrationMark` from the
nav entirely (it's still used elsewhere, e.g. section rules).

Separately, Filip said he doesn't like the rubber-stamp visual (tilted double-rule red box) used for
project states ("Shipped" / "In progress") — confirmed this is about the *look*, not the underlying
concept of stamped/verified state, which stays. Redesigned `StampBadge.astro`: dropped the rotation and
thick double-border box in favor of a small solid/hollow tick mark plus an underlined mono label — closer
to a spec sheet's status column than a rubber stamp, while keeping the same semantic meaning (solid tick
+ red = shipped/approved, hollow tick + dashed underline = in progress). Removed the now-dead per-row
`--stamp-tilt` rotation variables from `ProjectRow.astro`.

## 2026-09-27 — Test/benchmark numbers verified by actually running the suites

Both the CV and repo READMEs had stale numbers. These are the current, live-run-verified counts to use in
case-study copy (do not use the CV's or README's older figures):

- **Book Scanner:** 189/189 unit tests pass (`npx vitest run`) — not 136 (CV) or 184 (README, stale).
  E2E: 40 passed, 5 skipped (all on the WebKit/iPhone project, 0 failed), across Desktop Chrome, Pixel 7,
  and iPhone 14 — `npx playwright test`. "15/15 exact title matches" is real and documented consistently
  across `README.md`, `docs/accuracy-covers-offline.md`, `docs/scanner-rebuild.md`, `docs/project-report.md`,
  and `DECISIONS.md`, but was not re-run live today (needs a network fetch of real covers) — cite it as
  from the repo's own accuracy report, not as re-verified this session.
- **DocuMind AI:** 294/294 tests pass (`pytest`, existing venv). Embedding model in current code is
  `nomic-embed-text-v2-moe` (confirmed in `documind/config.py:56`), not plain `nomic-embed-text` as the CV
  says — use the repo's name.
- **Kvit:** backend 26/26 (`dotnet test`), frontend 52/52 (`vitest run`), lint (`oxlint --deny-warnings`)
  and build (`tsc -b && vite build`) both clean — exactly matches its own STATUS.md claim.

## 2026-09-27 — Motion pass: center-out underline reveal, reused stamp-arrival gesture

Filip noticed the built site was almost entirely static (intentional per the direction contract — theme
switches and page navigation cut instantly by design) and asked for hover states to feel less like an
instant on/off snap, inspired by the project-row title's red hover underline. Explicitly rejected
scroll-reveal animation as a fix.

**What shipped:** a single new motion idiom — link/title hover underlines now grow from the center
outward (a `background-image` gradient sized via `background-size`/`background-position: 50% 100%`,
transitioning only `background-size` so it never fires during a theme switch), reused everywhere a link or
title previously had an instant `text-decoration-color` swap (global links, nav, project-row titles, the
case-study back-link and next-case-study link, footer, earlier-work links, the CV/Macedonian PDF link).
The existing `StampBadge` arrival keyframes moved to `global.css` and are now reused for contact-form
error/status messages instead of an instant pop-in. Buttons, the theme toggle, and form inputs got a quick
(110ms, linear) non-eased hover/focus color transition, guarded by a `data-theme-switching` attribute (set
for two animation frames around every theme flip) so these new transitions can never visibly fire during a
light/dark switch. `Base.astro`'s `transition:animate="none"` (instant page navigation) was not touched.

**Deviations from the approved plan, and why:**
- Introduced one shared `.underline-reveal` CSS class (in `global.css`) instead of duplicating the
  gradient technique into `ProjectRow.astro`'s scoped styles — same technique, defined once.
- `Base.astro`'s theme script: the new `astro:before-swap` listener replaced the old `astro:after-swap`
  listener rather than running alongside it (redundant once the theme is set pre-swap); the
  theme-persists-across-navigation test still passes.
- Footer colophon links (GitHub/LinkedIn/Email) needed a `<span>` wrapper not called out in the plan —
  they're flex items, so without it the new underline landed 5px lower than before.
- Nav link underline offset tuned by direct pixel measurement (`padding-bottom: 0.15em`) rather than the
  plan's placeholder value, to land on the exact same row as the old `text-underline-offset: 0.3em`.
- The "next case study" link, which used to keep a permanently grey line at rest (a scoped rule outranked
  the global `a:hover`), now turns red like every other link on hover — a minor, deliberately-flagged
  behavior change, not a regression.

**Known trade-off, unresolved — Filip to decide:** the new background-painted underline can't curve
around descenders the way a real text-underline did, so on body-text links the red hover line now sits
about 1px higher and lightly touches descenders (g/p/y). A `padding-bottom: 1px` fix exists but would also
add 1px to buttons and the "fd." nav mark's box, so it was left unapplied pending Filip's call.

**Verified:** `npm test` (44/44), `npm run check` (0 errors), `grep -rn "text-decoration-color" v2/src`
(no matches), `git status` shows only `v2/` and `v2/DESIGN.md` changed. Screenshots and paused-transition
pixel measurements (both themes, 1440px/390px, home + one case study) confirm center-out growth and
matching rest-state line positions except the two predicted exceptions (Caslon display titles drop ~2-3px
to clear descenders by design; the nav's offset was tuned to match exactly). Not verified: Safari (the
`-webkit-box-decoration-break` prefix), real Windows forced-colors mode, OS-level reduced motion.
