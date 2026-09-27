# v2 copy — please review before I build

Read this on your phone whenever. Every number here was actually run today, not copied from an old
README or your CV — see `docs/DECISIONS.md` for exactly how each one was checked. Tell me what to change,
cut, or correct (especially: is "shipment tracking" OK to say publicly about Imbrium's product, or does
that need to stay vaguer?).

---

## Hero (home page)

**Name / role, set at specimen scale:**
> Filip Davchev
> Software Engineer

**Status line (styled as a stamp):**
> APPROVED FOR PRODUCTION — Engineer Intern at Imbrium Tech, Jul–Oct 2026

**One-line thesis, under the stamp:**
> Real projects, checked before they're claimed. Local AI, an offline app with a measured accuracy
> benchmark, and a NFC attendance system used by a real classroom.

**Primary action:** Read the proof → scrolls to Work
**Secondary action:** Contact

---

## Work (project rows, strongest first)

Each row: title, one-line thesis, stamped state word, stack, link to the case-study page.

1. **DocuMind AI** — Stamped: **Shipped**
   *A local AI assistant that answers questions about your PDFs, with page citations, and never sends
   your documents anywhere.*
   Python, LangChain, FAISS, Ollama (Llama 3, Mistral, LLaVA), Streamlit. 294/294 tests pass.

2. **Book Scanner** — Stamped: **Shipped, live**
   *Point your phone at a book cover, it reads the title and author on-device — no server, no account,
   works offline. Optionally calls Gemini when you're online for much better Macedonian-script covers.*
   TypeScript, React, Vite, Tesseract.js, IndexedDB. 189/189 unit tests, 40 e2e tests across Chrome,
   Android and iPhone. Live at fdavchev.github.io/Book-Scanner/

3. **Classroom Presence System** — Stamped: **Shipped, group project**
   *Replaced paper roll-call with a phone tap. Students tap their phone against the teacher's device,
   attendance lands in the teacher's dashboard in real time — no scanning app, no manual counting.*
   Kotlin, Android NFC/HCE, FastAPI, Firebase Auth + Firestore. Built with Simona Zlatanovska.

4. **Kvit** — Stamped: **In progress**
   *A shared-expense splitter for groups, built the way production software gets built: architecture
   and tests first, features after. The money math (splits always add up, balances always net to zero)
   is proven before a single screen exists.*
   .NET 10, ASP.NET Core, EF Core/PostgreSQL, React, TypeScript, Tailwind. Backend 26/26 tests,
   frontend 52/52 tests, both passing today.

**Earlier work (compact list, GitHub links only, no case-study pages):**
Wanderlust (PHP/MySQL travel social platform with a Leaflet map, group project) · TouristSpotsMK
(Android + Firebase) · House Price Prediction (Python, scikit-learn regression)

---

## Experience

**Engineer Intern · Imbrium Tech, Shtip (on-site) · 31 Jul – 31 Oct 2026**

- Built REST API endpoints in C#/ASP.NET for a logistics platform's shipment status system — inbound,
  delivered, returned, not called, and the other states a shipment moves through — with real-time status
  reports, serving a web dashboard, a Flutter app, and a PWA.
- Optimised SQL Server queries and indexes to keep response times steady as shipment volume grew.
- Works directly with clients in meetings, not just with the engineering team.

Stack: C#/.NET, ASP.NET, REST APIs, SQL Server, Flutter, Azure DevOps, Git

---

## About

Short version, not a repeat of the Experience section:

> Computer Science graduate (BSc, University "Goce Delchev", Shtip — Fall 2026), based in Kavadarci,
> North Macedonia. Comfortable across the stack — Python, C#, Kotlin, TypeScript — with a particular
> pull toward local-first AI: running language models on your own machine instead of someone else's API.
> Outside of code: photography, hiking, basketball.

Photo: the car-selfie you sent, cropped tight. Casual on purpose — About is the one section allowed a
personal register (this was a deliberate choice in the visual direction, not an oversight).

---

## Contact

One CTA everywhere ("Get in touch" — replacing v1's three different labels for the same action).
Email, GitHub, LinkedIn, the contact form (same EmailJS setup as v1), and both CV downloads
(English primary, Macedonian secondary).

---

## Screenshots captured (real, not mocked)

All in `v2/src/assets/screenshots/`:

- **DocuMind:** the PDF Q&A tab, a document indexed, a real question answered with a `[1]` citation,
  and the Sources panel expanded showing the exact page and quoted text the answer came from.
- **Book Scanner — confirmed order:** lead with Filip's own two Gatsby shots (`bookscanner-review-ai-mode.png`
  = Gemini, "100% confident"; `bookscanner-review-ondevice-match.png` = on-device OCR, "98% confident,
  Matched in catalogue" against Open Library), then the empty library and scan screen for context. The
  Dune low-confidence shot (`bookscanner-review.png`) stays in as a small secondary "how it handles
  uncertainty" callout, not the lead.
- **Kvit:** the Welcome screen (bilingual "Квит сме. / We're even.") and the live Scalar API reference
  page, both from your local dev servers (stopped afterward, nothing left running).
- **Classroom Presence:** confirmed — no phone screenshots available, so the case study runs on an
  authored diagram of the tap → dashboard flow instead. Noted in BACKLOG.md for later.

## Open items before this is final

1. Anything in here that's wrong, missing, or reads false — say so plainly, I'd rather redo a paragraph
   now than ship something you wouldn't actually say about yourself.
