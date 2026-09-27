# Portfolio v2 — design iteration after the first build

**Date:** 2026-09-27
**Branch:** `feat/01-portfolio-v2` (still nothing committed)

Follow-up to `2026-09-27-portfolio-v2-first-build.md`, covering the round of feedback and fixes after
Filip reviewed the first build's screenshots.

## What changed this round

1. **About photo → circular crop.** VERIFIED by live run (rebuilt and screenshotted after each attempt).
   First attempt clipped the thumbs-up because a circle mask cuts corners and the thumb sat near one;
   fixed by zooming out to a looser 900x900 crop `(250,300)-(1150,1200)` from the 1200x1600 source, which
   keeps both face and thumb inside the circle. File: `v2/src/pages/index.astro` (`.about__crop` rule).

2. **Nav logomark exploration → rejected, reverted to plain "fd."** Spawned a coder subagent (on Opus, at
   Filip's explicit request) to design 3 nav mark options in the Proof Sheet world (a stamp monogram, a
   registration-cross monogram, a Caslon "fd⊙" proof mark). Filip rejected all 3 and asked for something
   closer to v1's simple "fd·" mark. Reverted `v2/src/components/Nav.astro` to a plain "fd." (mono font,
   red dot), removed `RegistrationMark` from the nav. Deleted the review page and 3 unused components
   the design-exploration agent created (`logomark-review.astro`, `StampMonogram.astro`,
   `RegistrationMonogram.astro`, `ProofMark.astro`) — none of this is in the final build.

3. **Project state badges redesigned twice, second version chosen.** Filip said he didn't like the
   original tilted double-rule "rubber stamp" look (confirmed: about the look, not the underlying
   verified/open concept, which stays). First redesign: a small tick mark + underlined label (Filip liked
   this — **saved to persistent memory** as `v2-status-badge-liked.md` so it survives a session change).
   Second redesign, tried for comparison at Filip's request: `[ SHIPPED ]` / `[ IN PROGRESS ]` in
   brackets, no drawn shape, italic for in-progress. **Filip chose this bracket version** — it's what's
   currently in `v2/src/components/StampBadge.astro`. Also removed now-dead `--stamp-tilt` rotation
   variables from `v2/src/components/ProjectRow.astro`.

## Verification after these changes

- `npm run check` (from `v2/`): 19 files, 0 errors/warnings/hints. VERIFIED by automated test.
- `npm run build`: 5 pages built, no errors. VERIFIED by automated test.
- Visual check via Playwright screenshots (light + dark, desktop) after each change, read and confirmed
  by me before moving on. VERIFIED by live run.
- **NOT re-run since these changes:** the full 94-check Playwright suite the coder subagent ran on the
  first build (it lived in scratchpad, not the repo, so it no longer exists to re-run as-is — see gap
  below). The contact form flow, mobile widths, and reduced-motion checks have not been re-verified since
  the Nav/StampBadge edits, though those edits don't touch any of that logic.

## Gap worth knowing about

**There is no committed test suite.** All verification so far (both the coder subagent's 94 checks and
my own follow-up checks) used one-off Playwright scripts written to the OS scratchpad, not saved into
the repo. If a next session wants to re-run the full check rather than trusting this report, those
scripts need writing again. Worth fixing properly before shipping: either commit a real `v2/tests/`
Playwright suite, or accept that each verification pass is a fresh throwaway script.

## Files changed (still uncommitted)

Everything from the first build (see the previous report) plus this round's edits:
`v2/src/pages/index.astro`, `v2/src/components/Nav.astro`, `v2/src/components/StampBadge.astro`,
`v2/src/components/ProjectRow.astro`. `docs/DECISIONS.md`, `docs/ROADMAP.md`, `docs/STATUS.md`,
`docs/BACKLOG.md` updated. New memory files at
`C:\Users\Davchev\.claude\projects\c--Users-Davchev-Projects-fdavchev-github-io\memory\`.
