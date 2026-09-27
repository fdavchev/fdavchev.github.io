---
title: Kvit
order: 4
thesis: "A shared-expense splitter for groups, built the way production software gets built: architecture and tests first, features after. The money math (splits always add up, balances always net to zero) is proven before the expense features exist."
state: in-progress
stack:
  - .NET 10
  - ASP.NET Core
  - EF Core/PostgreSQL
  - React
  - TypeScript
  - Tailwind
proofLine: Backend 26/26 tests, frontend 52/52 tests
links:
  - label: Source on GitHub
    href: https://github.com/fdavchev/Kvit
proofs:
  - claim: "Backend: 26 of 26 tests pass"
    command: dotnet test
    status: verified
    checked: 2026-09-27
  - claim: "Frontend: 52 of 52 tests pass"
    command: vitest run
    status: verified
    checked: 2026-09-27
  - claim: Lint is clean
    command: oxlint --deny-warnings
    status: verified
    checked: 2026-09-27
  - claim: Frontend build is clean
    command: tsc -b && vite build
    status: verified
    checked: 2026-09-27
  - claim: Expense features
    source: Not built yet
    status: open
    note: Only the architecture skeleton exists so far.
figures:
  - src: ../../assets/screenshots/kvit-welcome.png
    alt: "Kvit’s welcome screen: the Kvit wordmark, the line “Квит сме.” with “We’re even.” under it, and sign-up buttons, with an EN and MK language switch."
    caption: "The welcome screen, bilingual from the start: “Квит сме.” / “We’re even.”"
    role: lead
  - src: ../../assets/screenshots/kvit-api-scalar.png
    alt: The Scalar API reference page for Kvit.Api v1, tagged OpenAPI 3.1.1, with a Download OpenAPI Document link.
    caption: The live API reference for Kvit.Api v1, rendered by Scalar from its OpenAPI 3.1.1 document.
    role: lead
---

## Where it stands

In progress, and labelled that way on purpose. Only the architecture skeleton exists so far; the expense features come next.

## Tests before features

The rules that make an expense splitter trustworthy are pinned down by tests before any screen depends on them: splits always add up, and balances always net to zero.
