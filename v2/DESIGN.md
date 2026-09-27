---
name: Filip Davchev — Portfolio v2
description: A press-proof/type-specimen system where every claim ships stamped Verified or honestly marked Open.
colors:
  paper: "light-dark(#edeae2, #17181a)"
  ink: "light-dark(#17181a, #edeae2)"
  ink-soft: "light-dark(#3f4044, #c9c6be)"
  ink-muted: "light-dark(#5e5f63, #a3a098)"
  rule: "light-dark(rgb(23 24 26 / 0.24), rgb(237 234 226 / 0.26))"
  wash: "light-dark(rgb(23 24 26 / 0.05), rgb(237 234 226 / 0.06))"
  correction-ink: "light-dark(#d6291a, #e23a26)"
  correction-ink-text: "light-dark(#b81f12, #f0503a)"
typography:
  display:
    fontFamily: "'Libre Caslon Display', 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(2.75rem, 1.4rem + 6.4vw, 6rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5rem
    letterSpacing: "normal"
  label:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.125rem
    letterSpacing: "0.06em"
rounded:
  none: "0"
spacing:
  grid: "0.375rem"
  1: "0.75rem"
  2: "1.5rem"
  3: "2.25rem"
  4: "3rem"
  6: "4.5rem"
  8: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 1.5rem"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "{colors.ink-soft}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 1.5rem"
    height: "3rem"
  button-secondary-hover:
    backgroundColor: "{colors.wash}"
  stamp-shipped:
    textColor: "{colors.correction-ink-text}"
    typography: "{typography.label}"
  stamp-in-progress:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
  input-field:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "3rem"
---

# Design System: The Proof Sheet

## Overview

**Creative North Star: "The Proof Sheet"**

This system reads as a printing-house press-proof: a sheet where every claim is checked against a
physical mark before it's allowed to stand. Bone paper and near-black proof ink carry the whole page;
one saturated red is reserved entirely for the moment something is being verified, corrected, or acted
on. Nothing on the page is decorative for its own sake — the registration crosses close every section,
the trim marks frame every reproduced screenshot, the ledger tables carry the site's actual claims with
dates and commands. The system was chosen by a resonance-ordered concept roll (form: The Proof Sheet,
seed key `bb5ba904`) and built code-led, with no comp; a plain "fd." wordmark with a red dot was kept
for the masthead after three cross-based logomark alternatives were explicitly tried and rejected — the
system favors restraint over a cleverer, less legible mark.

Confirmed visual rejections: no drawn "rubber stamp" shapes (tilted double-rules) around state words —
state is marked with plain square brackets instead; no cross-monogram logomark; no eased color
transitions on theme switch (state changes cut instantly, matching a proof's hard specimen labels).

**Key Characteristics:**
- Flat ink-on-paper at rest; the only depth device is a hairline rule or a trim-mark frame, never a shadow.
- Sharp corners everywhere (`border-radius: 0`) — buttons, inputs, and image frames all meet at right angles.
- One accent color, reserved for state and correction, never used as general decoration.
- A strict baseline grid (`--grid: 0.375rem`); line-heights snap up to it via CSS `round()`.
- Theme and section-to-section navigation change state instantly — no eased color or layout transition.

## Colors

Two neutrals plus one accent, each with a light and dark value driven by the same CSS variable via
`light-dark()`, so the palette never needs a separate dark-mode override block.

### Primary
- **Correction Ink** (`#d6291a` light / `#e23a26` dark, `--red`): the accent for stamp labels, the
  masthead dot, focus rings, the text-selection tint, and — as its most literal use — the input caret
  and the proofreader's underline that grows under a link or a work-list title on hover. Reserved for
  moments of verification, correction, or direct action; never a general decorative accent.
- **Correction Ink, small-text weight** (`#b81f12` light / `#f0503a` dark, `--red-ink`): the same color
  deepened to clear AA contrast at small sizes (5.4:1 on paper, 5.0:1 on ink) — used for the `[ SHIPPED ]`
  stamp label and the ledger's `Verified`/`Open` state column, where the base `--red` falls short of AA.

### Neutral
- **Proof Ink** (`#17181a` light-mode text / paper in dark mode, `--ink`): body text color and the dark
  theme's page background.
- **Bone Paper** (`#edeae2` light-mode background / text in dark mode, `--paper`): the page field.
- **Soft Ink** (`--ink-soft`): secondary text — project theses, form labels, hover states on dark buttons.
- **Muted Ink** (`--ink-muted`): tertiary text and chrome — type labels, muted stamp brackets, unfinished
  ("Open"/"In progress") state words, hairline rule color source.
- **Rule** (`--rule`, ink or paper at ~25% alpha): hairline dividers between work-list rows and ledger rows.
- **Wash** (`--wash`, ink or paper at ~5% alpha): the secondary button's hover fill — the one place a flat
  tint stands in for a shadow.

### Named Rules
**The One Accent Rule.** Correction Ink appears only where something is being verified, corrected, marked
with a state, or focused/hovered — never as a background fill, a decorative rule, or a headline color.

## Typography

**Display Font:** Libre Caslon Display (with Iowan Old Style, Georgia, serif fallback)
**Body Font:** IBM Plex Sans (with system-ui fallback)
**Label/Mono Font:** IBM Plex Mono (with ui-monospace fallback)

**Character:** An oldstyle specimen serif for scale and authority at display size, paired with a
workhorse grotesque for reading text and a mono for anything that reads as data, a label, or a proof-mark
— the pairing itself performs the "specimen sheet" metaphor: it announces sizes the way a real type
specimen would.

### Hierarchy
- **Display 1** (400, `clamp(2.75rem, 1.4rem + 6.4vw, 6rem)`, line-height rounds up to the grid): the
  name/role hero line — the single largest type on the page.
- **Display 2–4** (400, `clamp` scale from `1.5rem` to `3rem`): section headings and case-study titles,
  descending specimen sizes.
- **Lead** (400 body weight, `1.125rem`/`1.875rem`, max `52ch`): the one or two intro sentences under a
  heading.
- **Body / prose** (400, `1rem`/`1.5rem`, max `58ch`): running case-study text.
- **Label** (500, `0.75rem`, `0.06em` tracking, uppercase, mono): field labels, section kickers, table
  headers, stamp brackets.
- **Data** (mono, `0.8125rem`/`1.5rem`): stack lists, proof lines, ledger commands — anything that reads
  as a logged fact rather than prose.

### Named Rules
**The Labeled-Size Rule.** A specimen heading (`Specimen.astro`) prints its own live-measured point size
in the margin, read off the rendered `font-size` at runtime rather than hand-typed — the label can never
drift out of sync with the type.

## Layout

A single centered "sheet" (`--sheet-max: 76rem`, fluid gutter `clamp(1rem, 4vw, 3rem)`) holds every page.
Each major region is a `.proof-section`: a full-width top rule with a registration-cross mark centered at
both its start and end corners, used as a real section boundary on every page, not once as pure ornament.
Spacing is a strict 6px baseline grid (`--grid: 0.375rem`); every gap and line-height is expressed as a
multiple of it (`--space-1` through `--space-8`, `0.75rem` to `6rem`). Responsive behavior is grid
reflow, not a separate mobile layout: the work-list row, ledger table, and masthead nav each collapse
their multi-column grid to one column at named breakpoints (`40rem`, `56rem`, `30rem`) rather than
switching to a different component.

## Elevation & Depth

Flat by design — there is no `box-shadow` anywhere in the system. Depth is conveyed structurally instead:
a 1px rule marks every boundary (row dividers, section tops, button borders, input borders), and
`.trim-marks` — four corner marks drawn on their own `z-index: -1` layer behind the content — frame every
reproduced screenshot the way a printer's crop marks frame a plate, so figures need no border of their
own. The page itself stays still; the few motions it has are listed under Motion below.

## Motion

Motion is a proofreader's mark being made, never a page performing. Three gestures, nothing else:

- **The centre-out underline.** Every link carries a hairline in `--rule` at rest; on hover a 2px
  `--red` line grows from the centre of the text outward (`--dur-mark`, 140ms, `--ease-out`). It is
  painted as two `background-image` lines animated by `background-size` rather than a
  `text-decoration`, so wrapped links grow from the centre of each line and no colour ever animates.
  Hover changes `background-size` only. Work-list titles get the same line through
  `.underline-reveal`, with no hairline at rest; masthead links also have none at rest. Under forced
  colours it falls back to a real `text-decoration` underline.
- **The arrival.** A mark arriving on the sheet settles in: translate + fade, 220ms
  (`--motion-settle`), a plain 160ms fade under reduced motion (`--motion-appear`). Used by the stamp
  badge on first paint and by the contact form's error and status messages when they appear (not
  when re-validation only changes the wording). The keyframes live in `global.css`.
- **Hover feedback on controls.** Buttons, the theme toggle and form fields change their fill or
  border over `--dur-feedback` (110ms, linear): quick enough to still read as a cut. The press
  (`translate: 0 1px`), a field's error border and a button's disabled fade stay immediate.

Theme switches and page navigation still cut instantly. While the toggle flips the theme,
`html[data-theme-switching]` suspends every transition for two frames, and on a page navigation the
theme is set on the incoming document before it swaps in, so no colour ever eases between themes.
Every transition sits inside `prefers-reduced-motion: no-preference`.

### Named Rules
**The No-Shadow Rule.** Depth reads through rules and trim marks, never a cast shadow — a shadow would
break the flat "printed sheet" premise the whole system stands on.

## Shapes

Every corner is square (`border-radius: 0` throughout — buttons, inputs, image frames). The only curved
strokes on the page are the registration marks' printer's-cross circles, which are content (a printer's
device), not chrome. Borders are always 1px, in `--ink` (full contrast, for buttons and the active
section rule) or `--rule`/`--ink-muted` (soft, for dividers and idle inputs).

## Components

### Buttons
- **Shape:** square corners (`0`), 1px `--ink` border, fixed `3rem` minimum height so primary and
  secondary sit level with each other.
- **Primary:** `--ink` background, `--paper` text, mono label type.
- **Secondary:** transparent background, `--ink` text and border.
- **Hover:** primary darkens to `--ink-soft`; secondary fills with `--wash` (a flat tint, not a shadow),
  over 110ms linear.
- **Active:** the whole button translates `1px` down — a physical press, not a color change, and immediate.
- **Disabled:** `0.6` opacity, `cursor: progress`.

### Stamp / State Badge
- **Style:** purely typographic — square brackets around an uppercase mono label, no drawn stamp shape.
- **Shipped:** brackets in `--ink-muted`, label in `--red-ink` (the correction-ink small-text weight).
- **In progress ("open"):** label switches to `--ink-muted` and italic — visually quieter, on purpose,
  so an unfinished project never competes with a shipped one for attention.
- **Arrival:** settles in with a short translate+fade on first paint (a plain fade under reduced motion).

### Inputs / Fields
- **Style:** transparent fill, 1px `--ink-muted` border, square corners, `1rem` body-font text (16px,
  specifically to stop iOS zooming the viewport on focus).
- **Focus:** border darkens to full `--ink` over 110ms.
- **Error:** border switches to `--red-ink` at once; the error line below the field renders in mono,
  `--red-ink`, and settles in like a stamp when it appears.

### Navigation
- **Masthead:** mono type throughout, `0.8125rem`. Home mark is "fd" + a `--red` dot, no border, no
  background. Section links have no line at rest; on hover a `2px` `--red` line grows from the centre,
  sitting where the old `0.3em`-offset underline did; no color change on the link text itself. On narrow
  viewports the nav drops to its own row below the home mark and theme toggle rather than collapsing into
  a hamburger menu.
- **Theme toggle:** a bordered mono button reading its own current state ("Theme: Light" / "Theme: Dark");
  border darkens on hover (110ms), presses `1px` down like a button; hidden entirely when JavaScript
  hasn't run (no flash of a dead control).

### Ledger Table (signature component)
The proof ledger (`ProofLedger.astro`) is the system's most distinctive device: a three-column table —
Claim, How it was checked, State — where every row ends in either "Verified" with the date it was last
re-run, or an honest "Open". On narrow viewports it restacks each row into a two-line card rather than
scrolling a table horizontally. This is the load-bearing proof of the THESIS block ("every fact ships
stamped Verified or honestly marked Open") and should be reused, not reinvented, anywhere a future page
needs to back up a claim.

## Do's and Don'ts

### Do:
- **Do** keep Correction Ink to state, correction, and focus/hover moments — never a background fill or
  a headline color (**The One Accent Rule**).
- **Do** use square corners everywhere; a rounded corner anywhere in this system reads as a foreign
  component.
- **Do** use a rule or a trim-mark frame for depth; never a `box-shadow` (**The No-Shadow Rule**).
- **Do** cut state changes (theme, active nav) instantly; an eased color transition contradicts the
  "instant proof mark" premise.
- **Do** reuse the ledger table (claim / how checked / state) for any future page that needs to back a
  claim with evidence, rather than inventing a new proof device.

### Don't:
- **Don't** draw a tilted double-rule "rubber stamp" shape around a state word — this was tried and
  rejected; state is marked with plain brackets only.
- **Don't** add a cross-monogram or any icon-based logomark to the masthead — three alternatives were
  tried and rejected in favor of the plain "fd." + dot mark.
- **Don't** introduce a second accent color; the system's whole restraint argument rests on there being
  exactly one.
- **Don't** use `prefers-reduced-motion` as an excuse to drop a state entirely — the stamp badge and the
  form messages still animate under reduced motion, just as a plain fade instead of a translate+fade.
- **Don't** add scroll-triggered or on-load reveals (explicitly rejected), `transition: all`, or a color
  transition that isn't suspended by `html[data-theme-switching]` during a theme flip.
