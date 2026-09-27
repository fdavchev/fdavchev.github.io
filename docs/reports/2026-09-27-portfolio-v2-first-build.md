# Portfolio v2 — first build report

**Date:** 2026-09-27
**Branch:** `feat/01-portfolio-v2` (not merged, not pushed, nothing committed)

## What exists now

A full Astro site in `v2/`: home page (hero, stamped work list, earlier-work links, experience, about
with your photo, contact form + both CVs) and 4 case-study pages at `/v2/work/<slug>`. Visual direction
is "The Proof Sheet" (the print-proof/type-specimen world you picked), built as its own thing, not a
refactor of v1. Screenshots sent to you directly: home page light + dark, and the DocuMind case study.

## Verified claims

- **Build is clean.** VERIFIED by automated test — `npx astro check`: 0 errors/warnings/hints.
  `npm ci && npm run build` from a clean install: 5 pages built with no errors.
- **Every internal link resolves.** VERIFIED by automated test — a link-checker script found 132
  internal URLs across the 5 pages, 0 failures, all correctly prefixed under `/v2`.
- **94/94 browser checks pass** (Playwright, Chromium only). VERIFIED by automated test. Covers: all 5
  pages at 390px and 1440px in both themes (status 200, no horizontal scroll, no console errors), the
  specimen font-size labels matching actual measured size, theme persistence with no flash, work-list
  navigation without a full page reload, the stamp animation respecting reduced-motion, and the full
  contact form flow (validation errors, honeypot blocking a send, a rejected send showing "Failed, try
  again", a blocked script showing "Mail service unavailable", and — critically — the intercepted request
  matched v1's exact EmailJS service ID, template ID, public key, and field names).
- **No design-detector findings.** VERIFIED by automated test — `impeccable detect --json` returned `[]`
  on the source and on three rendered viewports, after one round of fixing (12 false-positive
  contrast warnings on the Classroom diagram, caused by CSS trim marks sitting under the text — moved
  to their own layer).
- **v1 untouched.** VERIFIED by automated test — `git diff` shows only the GitHub Actions workflow
  changed; `index.html` at the repo root is byte-identical to before.
- **No real email was sent, nothing left running.** Stated by the coder, consistent with what it was
  asked to do (EmailJS was intercepted in tests, not actually called).

## NOT verified — you should know about these before we go further

- **The actual GitHub Actions deploy.** The combined workflow (build `v2/`, copy v1's three root files
  by name, ship both together) has never run on GitHub — only simulated locally. This needs watching on
  its first real run; it's a workflow pattern with no ready-made template, assembled from GitHub's own
  documented building blocks.
- **Whether GitHub Pages actually serves `/v2/work/kvit` without a redirect.** Checked locally only.
- **Safari/WebKit and real phones.** Every check above ran in Chromium only.
- **A real email send.** Deliberately not done — the request shape was checked against v1's values, but
  no message was actually sent through EmailJS.

## Decisions the coder made that you should look at

1. **Display serif: Libre Caslon Display.** Chosen because Caslon's 1734 specimen sheet is *the* classic
   type specimen — ties directly to the "proof sheet" direction. Body text is IBM Plex Sans (same family
   as the Plex Mono labels already in the direction). This isn't locked in — say if you want to see
   alternatives.
2. **"Read the proof" (the hero's primary button) opens the DocuMind case study directly**, not a scroll
   down to the work list. Reasoning: the work list is already visible on the same screen, so scrolling to
   it isn't a useful action — going straight into the first case study is.
3. **Kvit's copy was softened slightly** ("before a single screen exists" → "before the expense features
   exist") because the built site actually shows a real Welcome screen, so the original line would have
   read as false. Small wording fix, flagging so you know why it doesn't match the copy doc exactly.
4. **One new sentence added to Contact**, pulled from PRODUCT.md, not invented: "Open to junior and
   graduate roles in mobile (Flutter), .NET backend, and applied AI."
5. **Case-study body text is thin** — 2-3 short paragraphs per project, built out from the one-liners in
   the copy doc since that's what existed. This is honest but light; a deeper copy pass on the 4 case
   studies is worth doing as a next step if you want more depth there.
6. **No v2 OG image yet** — v1's og-image.png says "Software Engineering Intern" and doesn't fit v2, so
   social-media link previews currently fall back to plain text. Added to BACKLOG.
7. **Theme preference is shared with v1** (same localStorage key) — switching theme on one site switches
   it on the other too, intentionally.

## What I'd like from you

1. Look at the 3 screenshots I sent you directly (home light/dark, DocuMind case study).
2. Tell me about the Caslon serif choice, the "Read the proof" behavior, and the Kvit wording tweak —
   keep, or change?
3. Decide the next step: I can send more screenshots (all 4 case studies, mobile, dark mode) for a fuller
   look before anything goes live, or — since v1 is completely untouched by any of this — we could merge
   this branch to `main` now so the real workflow runs and you can open `fdavchev.github.io/v2/` on your
   phone directly. Either way is safe; nothing here touches the live site until that workflow runs.

Still outstanding regardless: Kvit's Macedonian welcome-screen screenshot (skipped, not essential),
watching the first real CI run, and a proper Safari/mobile-device check once it's live.
