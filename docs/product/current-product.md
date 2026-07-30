# Current Product

**Release:** Local-first proof of concept  
**Primary user:** One diver on one device  
**Last reviewed:** 2026-07-30

This document describes what the application actually supports now. Future concepts belong in the roadmap or idea log.

## Complete workflow

```text
Open Kill Tide
    ↓
Start a dive entry
    ↓
Add photos and one optional catch
    ↓
Record conditions, story, and lesson
    ↓
Save locally
    ↓
Open the entry in the journal
```

## Implemented

- Mobile-first responsive application
- Three-step dive-entry flow
- Dive title, date, type, and named location
- Up to six phone-camera or photo-library images
- Client-side image compression
- Visibility, water temperature, current, and time in water
- One optional catch with species, length, weight, and kept/released state
- Dive story and lesson
- Local IndexedDB persistence
- Automatic recovery of unfinished text fields
- Journal feed and detailed entry view
- Basic totals for dives, catches, species, and hours
- Entry deletion
- Versioned JSON backup export and restore
- Installable web-app metadata
- Explicit on-device privacy messaging

## Not implemented

- Editing an existing entry
- Multiple catches per dive
- Photo captions, reordering, or cover selection
- Gallery filters
- Saved dive locations or private coordinates
- Gear, partners, wildlife, safety observations, or personal records
- Live marine data
- Kill Tide calculations
- Calendar event generation
- Alerts or notifications
- Offline service worker
- Accounts, cloud backup, synchronization, or public sharing
- AI features

## Data and privacy

Records and compressed photos are stored in the browser’s IndexedDB. Draft text uses local browser storage. The application has no accounts, analytics, external tables, or cloud photo store.

Data remains tied to the current browser and device. Clearing site data can erase the journal. The user should export backups regularly, particularly before clearing browser data or replacing a device.

## Safety

The current product is a journal, not a marine forecasting or safety system. Any future forecast must disclose its source, age, meaning, and uncertainty.
