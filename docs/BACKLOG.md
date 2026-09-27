# Backlog

Not part of the current build. Revisit later.

## Swap v2 to the live root (next, once v2 ships)

Once v2 is reviewed and Filip approves it:
1. Move everything out of `v2/` up to the repo root (or point the Pages build at `v2/` as the site root).
2. Remove `index.html` (v1) **from git only** — `git rm --cached index.html`, not `rm index.html` — so it
   stops being tracked/deployed but the file stays on Filip's disk. Confirm it's still physically present
   locally after the commit before pushing.
3. Update `.github/workflows/deploy-pages.yml` back to a single build (no more "v1 root + v2 subfolder").
4. Remove the `noindex` meta tag from v2's pages once it's the only site.

## From the first build + design iteration (2026-09-27)

- No v2 OG image yet (v1's says "Software Engineering Intern", doesn't fit v2 — falls back to plain-text
  social preview for now).
- Case-study body copy is thin (2-3 short paragraphs each, built from the copy doc's one-liners). A
  deeper pass is optional, not blocking.
- **No committed test suite.** All verification so far used throwaway Playwright scripts in the OS
  scratchpad, not saved to the repo. Worth fixing before shipping — see the design-iteration report.
- The GitHub Actions deploy workflow has never run for real (only simulated locally) — watch its first
  real run closely.
- Only tested in Chromium so far, not Safari or a real phone.

## Other later items

- Macedonian-language version of the site.
- A DocuMind demo video.
- Kvit feature screenshots once its expense features actually exist.
- Classroom Presence System phone screenshots (student + teacher app) — Filip confirmed (2026-09-27) these
  aren't available; the case study runs on an authored diagram of the tap → dashboard flow instead. Revisit
  only if real screenshots become available later.
- Swap the About-section photo for a plain-background daylight shot if Filip takes one (current one is a casual car selfie).
