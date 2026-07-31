# 0001 — Use a Local-First Proof of Concept

**Status:** Accepted  
**Date:** 2026-07-30

## Context

The first Kill Tide concept included accounts, cloud storage, public sharing, alerts, forecasts, extensive dive fields, and a large application architecture. That breadth would introduce cost, security work, infrastructure, and operational complexity before validating whether the personal journal is useful.

The immediate goal is for Isabella to document her next real dive.

## Decision

Build the initial application as a single-user, mobile-first web application with:

- IndexedDB for saved dives and compressed photos
- Local browser storage for unfinished text
- No login or cloud database
- No external photo storage
- Versioned backup export and restore

## Consequences

Benefits:

- Free to operate
- Private by default
- Fast to develop and change
- No account or backend administration
- Useful without depending on a remote database

Limitations:

- Records are tied to the current browser and device.
- Clearing site data can erase the journal.
- There is no synchronization or public sharing.
- Browser storage capacity varies.
- Reliable remote notifications are unavailable.

## Revisit when

Real use demonstrates a need for device replacement, multi-device access, automatic backups, public sharing, collaboration, or remote notifications.
