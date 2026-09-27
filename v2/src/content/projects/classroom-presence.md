---
title: Classroom Presence System
order: 3
thesis: "Replaced paper roll-call with a phone tap. Students tap their phone against the teacher’s device, attendance lands in the teacher’s dashboard in real time: no scanning app, no manual counting."
state: shipped
stateNote: Group project
stack:
  - Kotlin
  - Android NFC/HCE
  - FastAPI
  - Firebase Auth + Firestore
proofLine: Built with Simona Zlatanovska
team: Built with Simona Zlatanovska
links:
  - label: Source on GitHub
    href: https://github.com/fdavchev/Classroom-Presence-System
proofs:
  - claim: Phone screenshots of the student and teacher apps
    source: Not captured. Taking them needs a physical NFC phone.
    status: open
    note: The diagram on this page shows the flow instead.
diagram: classroom-flow
---

## How it works

A student taps their phone against the teacher’s device over NFC. The tap goes to a FastAPI backend, the attendance record lands in Firestore, and the teacher’s dashboard updates in real time. Accounts run on Firebase Auth.

There is no separate scanning app to open and nothing to count by hand: the tap is the roll-call.

## A group project

Built with Simona Zlatanovska.
