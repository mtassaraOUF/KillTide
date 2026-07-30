# Architecture and Trust Principles

## Local-first proof of concept

The first release intentionally uses the browser as the data boundary:

```text
Mobile web application
    ├── IndexedDB: saved dives and compressed photos
    ├── Local storage: unfinished text draft
    ├── Backup export: versioned JSON
    └── Backup restore: validated import
```

There is no account, backend, cloud database, external photo store, or synchronization.

### Required safeguards

- Clearly state that records live on the current device and browser.
- Never imply that data is cloud-backed.
- Keep the backup format versioned.
- Validate imported structure before replacing or merging records.
- Preserve original image usefulness while reducing local storage.
- Add backup reminders before expanding the journal.
- Treat exact locations as private by default.

## Marine-data boundary

Tide height and tidal current are related but different. Slack water may not occur at high or low water, and local geography may produce significant offsets.

Future planning must preserve this pipeline:

```text
Authoritative marine data
        ↓
Deterministic calculations
        ↓
Confidence and provenance
        ↓
AI explanation and personalization
        ↓
Calendar, alerts, and user action
```

Every marine value must disclose:

- Source
- Retrieval time
- Station or model relationship
- Official, modeled, or community-derived status
- Confidence or known limitation

AI must never calculate astronomical tides, invent observations, or present an estimate as official.

## AI boundary

AI may:

- Explain sourced conditions.
- Summarize a user’s dive history.
- Suggest reflection prompts or titles.
- Help search and organize personal records.
- Assist with uncertain fish identification while stating uncertainty.

AI must not:

- Invent tide, current, weather, or safety data.
- Replace deterministic calculations.
- Overwrite the user’s original journal text without consent.
- Present marine safety conclusions with unwarranted certainty.

## Location privacy

Future location records should support:

1. Exact coordinates visible only to the user.
2. Approximate public area.
3. Location name only.
4. Completely hidden location.

Exact coordinates must never be public by default.

## When cloud infrastructure is justified

Cloud storage should solve demonstrated needs such as device replacement, synchronization, public links, collaboration, reliable remote notifications, or community intelligence. It should not be introduced merely because it is conventional.
