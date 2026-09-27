# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (static output), plain CSS with custom properties (no utility framework), projects as a Markdown
content collection. Decided with the user; React was considered and rejected (see docs/DECISIONS.md,
2026-09-27 entry) because it ships a JS runtime for content that is fundamentally static. Deployed as a
static build to GitHub Pages.

## Users

Hiring managers, recruiters, and technical interviewers screening Filip Davchev for junior/graduate roles
in mobile (Flutter), .NET backend, or applied AI/RAG engineering — mostly scanning quickly (seconds to a
couple of minutes) before deciding whether to read further or reach out. A secondary audience is other
engineers who land on a project link from GitHub and want to see it in the context of a fuller portfolio.

## Product Purpose

A personal portfolio site for Filip Davchev, a Computer Science graduate (BSc, University "Goce Delchev",
Shtip, North Macedonia — Fall 2026) currently finishing a software engineering internship. It exists to
get a visitor to "this person ships real, tested software" within one viewport, and from there to either
read a project in depth or make contact. Success = a recruiter/hiring manager understanding what Filip
can do and reaching out, or a case-study page holding an engineer's attention long enough to read it.

This is v2, a from-scratch rebuild replacing an existing single-file site (v1, still live at the repo
root) that undersold his work and had gone stale on the facts (described him as mid-internship and
not-yet-graduated after both had happened). v2 stages at `/v2/` until reviewed, then replaces v1 at the
root (see docs/BACKLOG.md).

## Positioning

Not a generic "junior dev portfolio." What a neighboring junior-dev portfolio could not truthfully copy:
real, live, tested software with numbers behind the claims — a shipped installable PWA with an automated
test suite and a measured OCR accuracy benchmark; a from-scratch local RAG pipeline (no hosted LLM API)
built as a university capstone with its own evaluation set; a production internship building real REST
APIs consumed by three different client types (web, Flutter, PWA) for a live shipment-tracking system.
The site's job is to surface those specifics instead of flattening them into "full-stack developer"
generalities.

## Operating Context

- Deployed via GitHub Pages (`.github/workflows/deploy-pages.yml`), auto-deploying on push to `main`.
- v1 lives at the repo root as a single `index.html`; v2 is being built in `v2/` and will only replace
  the root once Filip has reviewed it live (workflow: stage at `/v2/`, swap later — see BACKLOG.md).
- Filip reviews work from his phone without a terminal; anything meant for him to check needs to be
  either live at a URL or written to a file he can open, not left only in a chat transcript.
- Filip is actively job hunting for junior/graduate roles right now; the internship (Imbrium Tech, Shtip)
  ends 31 Oct 2026, so the site's framing needs to work whether or not a next role is lined up by then.
- Contact form sends through EmailJS (existing account/config, reused from v1 — see docs/DECISIONS.md
  and STATUS.md for the exact service/template/key to preserve).

## Capabilities and Constraints

- Case-study pages exist for 4 projects: DocuMind AI (RAG/local LLM), Book Scanner (offline OCR PWA),
  Classroom Presence System (NFC attendance, group project), and Kvit (.NET 10 + React expense splitter —
  explicitly labelled "in progress," since only its architecture skeleton exists so far). A compact
  "earlier work" list links out to Wanderlust, TouristSpotsMK, and House Price Prediction on GitHub.
- Numbers quoted on the site (test counts, accuracy benchmarks) must be verified against the actual
  repos/test runs before publishing — the CV and repo docs disagree on a few (Book Scanner test count,
  the "15/15 exact title matches" claim, DocuMind's embedding model name). See docs/DECISIONS.md and
  STATUS.md "facts that disagree" for the specific discrepancies to resolve.
- Screenshots: Book Scanner captured from its live deployed URL; DocuMind captured by running it locally
  with Ollama (must be stopped again afterward — it wasn't running before this work started); Kvit
  captured from its local dev servers; Classroom Presence needs real phone screenshots from Filip (NFC
  requires physical hardware, can't be captured by an agent).
- Undecided/open: exact visual direction (chosen via the impeccable direction round, not fixed here);
  whether Kvit gets more content once its expense features ship (backlog item).

## Brand Commitments

- Name: Filip Davchev. Existing identity/handles to preserve exactly: github.com/fdavchev,
  linkedin.com/in/filip-davchev, davchevfilip31@gmail.com.
- No fixed visual identity to preserve — v1's cream/amber serif-and-mono look is explicitly being
  replaced, not carried forward (this is a redesign, not a refinement).

## Evidence on Hand

- Filip's CV, English and Macedonian (in `v2/public/`), supplies verified wording for the internship and
  project bullets — treated as approved copy, expanded on with repo-sourced detail per project.
- A photo (`v2/src/assets/filip.jpg`) — a casual car selfie, thumbs up, lake in the background. Usable
  small in an About section; not a professional headshot. Filip may supply a different photo later
  (see BACKLOG.md).
- Real repos exist locally for all 4 featured projects with READMEs, decision logs, and (for Book Scanner
  and DocuMind) test suites and accuracy/benchmark docs — these are the source of truth for case-study
  content, not invented detail.
- No existing screenshots for any of the 4 featured projects; all must be captured fresh (see
  Capabilities and Constraints above).

## Product Principles

1. Specificity over generalities — real numbers, real architecture decisions, real screenshots beat
   "full-stack developer" boilerplate every time.
2. Verify before publishing — a claim (a test count, a benchmark number) ships only after it's checked
   against the actual repo/test run, never carried over from a CV or README without confirming it first.
3. One clear next action — a visitor should always know the one thing to do (read a case study, or make
   contact), not face competing calls to action.
4. Currently true, not aspirationally true — facts (graduation status, employment status, internship
   dates) reflect today, not a frozen snapshot from when the site was first written.
5. Honest about what's unfinished — Kvit is shown as in-progress architecture, not dressed up as a
   finished product; this is a trust signal, not a weakness to hide.

## Accessibility & Inclusion

No project-specific requirement beyond standard web accessibility (keyboard navigation, reduced-motion
support, WCAG AA contrast in both light and dark themes) — carried over as a baseline expectation from v1,
which already had a documented accessibility pass (see v1 `index.html` comments on contrast ratios).
