# Kill Tide

Kill Tide is a private, mobile-first spearfishing journal. It lets a diver log a trip, add photos and catch details, record conditions and lessons, and build a personal history of time in the water.

## First release

- Log dives in a three-step mobile flow
- Take or choose up to six photos
- Compress photos before saving
- Record location, conditions, duration, catch, story, and lessons
- Browse journal entries and personal totals
- Export and restore a complete backup
- Installable web-app metadata

All journal data is stored locally in the browser using IndexedDB. There are no accounts, external tables, analytics, or paid services. A downloaded backup is essential before clearing browser data or changing devices.

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Product rule

Authoritative marine data and deterministic calculations must remain separate from AI interpretation. Future AI features may explain conditions or summarize a diver's own history, but must never invent tide, current, weather, or safety data.
