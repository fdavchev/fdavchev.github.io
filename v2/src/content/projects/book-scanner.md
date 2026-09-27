---
title: Book Scanner
order: 2
thesis: "Point your phone at a book cover, it reads the title and author on-device: no server, no account, works offline. Optionally calls Gemini when you’re online for much better Macedonian-script covers."
state: shipped
stateNote: Live
stack:
  - TypeScript
  - React
  - Vite
  - Tesseract.js
  - IndexedDB
proofLine: 189/189 unit tests, 40 e2e tests across Chrome, Android and iPhone
links:
  - label: Live at fdavchev.github.io/Book-Scanner
    href: https://fdavchev.github.io/Book-Scanner/
  - label: Source on GitHub
    href: https://github.com/fdavchev/Book-Scanner
proofs:
  - claim: 189 of 189 unit tests pass
    command: npx vitest run
    status: verified
    checked: 2026-09-27
  - claim: 40 end-to-end tests pass, 5 skipped, 0 failed, across Desktop Chrome, Pixel 7 and iPhone 14
    command: npx playwright test
    status: verified
    checked: 2026-09-27
    note: All 5 skips are on the WebKit (iPhone 14) project.
  - claim: 15 of 15 exact title matches
    source: The repo’s own accuracy report, docs/accuracy-covers-offline.md
    status: open
    note: Documented the same way across the repo’s docs, but not re-run for this page. Re-running it needs a network fetch of the real covers.
figures:
  - src: ../../assets/screenshots/bookscanner-review-ai-mode.png
    alt: "Book Scanner’s review screen: title The Great Gatsby, author F. Scott Fitzgerald, tagged 100% confident and Read via AI."
    caption: AI mode (Gemini). Title and author read at 100% confidence.
    role: lead
  - src: ../../assets/screenshots/bookscanner-review-ondevice-match.png
    alt: "The same title page read on the device: The Great Gatsby, F. Scott Fitzgerald, tagged 98% confident, Read on device, and Matched in catalogue."
    caption: On-device OCR. 98% confident, and matched against the Open Library catalogue.
    role: lead
  - src: ../../assets/screenshots/bookscanner-library-empty.png
    alt: The empty library, with a prompt to set up offline scanning and a Scan Books button.
    caption: The empty library, with the one-time download that makes scanning work offline.
    role: sequence
  - src: ../../assets/screenshots/bookscanner-scan-screen.png
    alt: The scan screen with Open Camera and Select Photos buttons, and toggles for catalogue lookup, Macedonian and English.
    caption: The scan screen. Open the camera or pick photos; catalogue lookup and language toggles sit above.
    role: sequence
  - src: ../../assets/screenshots/bookscanner-review.png
    alt: A review of a Dune cover with garbled Cyrillic in the title and author fields, flagged as not sure, at 42% OCR confidence, with a Crop and rescan button.
    caption: When a cover is hard to read, the app says so. This Dune cover came back at 42% OCR confidence, so it is flagged and the app asks for the title and author to be checked before saving, or offers Crop & rescan.
    role: callout
---

## What it does

Book Scanner is an installable PWA (progressive web app) for cataloguing books. Photograph a cover and the text is read on the device with Tesseract.js; the library is kept in IndexedDB, in your own browser. There is no server and no account, and after a one-time download of the text recogniser, scanning works with no internet at all.

## Two ways to read a cover

On-device OCR is the default. When you’re online you can turn on AI reading with Gemini, which reads Macedonian-script covers much better. With the catalogue lookup on, on-device readings are also matched against Open Library.

Either way, every result shows how confident the app is and where the reading came from, and nothing is stored until you’ve checked it and saved.
