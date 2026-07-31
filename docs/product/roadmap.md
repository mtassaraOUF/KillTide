# Product Roadmap

The roadmap is organized around user outcomes, not feature volume. Each milestone should be validated before the next introduces materially greater complexity.

## Milestone 1 — Personal Dive Journal

**Status:** In progress

**Outcome:** Isabella can document a real dive without assistance and recover her data safely.

Already delivered:

- Create and save a dive
- Add photos
- Record one optional catch
- Record basic conditions and reflections
- View and delete a journal entry
- Export and restore a backup

Completion work:

- Edit an existing entry
- Support zero or more catches explicitly
- Validate backup compatibility and storage limits on common phones
- Provide backup-age reminders
- Add reliable automated tests for storage and backup

## Milestone 2 — Journal Depth

**Outcome:** The application becomes useful as an ongoing personal record rather than a one-time demonstration.

- Saved private dive spots
- Gallery view, search, and filters
- Personal records
- Gear presets
- Partners, wildlife, and safety observations
- Photo captions, ordering, and cover selection
- Thumbnails and faster image handling
- Better personal statistics

## Milestone 3 — Kill Tide Planning Prototype

**Outcome:** Users understand the product’s unique planning value before live data is integrated.

- Clearly labeled sample or manually entered windows
- Location selection
- Window detail card
- Downloadable `.ics` calendar event
- Suggested arrival time
- Visible provenance and confidence labels

No sample value may appear live or authoritative.

## Milestone 4 — Authoritative Marine Data

**Outcome:** Kill Tide windows are explainable and based on trustworthy source data.

- NOAA station discovery
- Tide and tidal-current predictions
- Separate weather and marine forecasts
- Deterministic low-current window calculation
- Official prediction versus modeled-estimate labels
- Confidence model
- Source attribution and retrieval times

This milestone requires domain research and test fixtures before production recommendations.

## Milestone 5 — Notifications

**Outcome:** Kill Tide reaches a user before a useful window without creating noise or false confidence.

- Saved thresholds and planning preferences
- Calendar subscriptions
- Web or native push
- Optional email alerts
- Partner sharing

Reliable remote notifications require infrastructure beyond the local-first proof of concept.

## Milestone 6 — Optional Cloud Sync

Introduce a backend only when real usage demonstrates a need for:

- Device replacement
- Multi-device access
- Automatic backup
- Public journal links
- Shared dives or group planning
- Remote notifications
- Community observations

## Validation questions

- Which fields are useful immediately after a dive?
- Will users record no-catch dives?
- How much image storage is practical on common mobile browsers?
- Is backup and restore understandable enough to trust?
- Which calendar workflow works best on iOS and Android?
- Which locations have authoritative current predictions?
- What makes a window useful for a specific person and activity?
