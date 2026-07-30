# Kill Tide

Kill Tide is a private, mobile-first spearfishing journal. It lets a diver log a trip, add photos and catch details, record conditions and lessons, and build a personal history of time in the water.

> **North star:** Help people understand when to enter the water and remember what happened there.

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

## Project guide

The repository is the durable source of truth for Kill Tide. Start here:

- [Product vision](docs/vision/product-vision.md) — the enduring problem, audience, brand, and long-term opportunity
- [Current product](docs/product/current-product.md) — what the application actually does today
- [Roadmap](docs/product/roadmap.md) — staged outcomes and release boundaries
- [Architecture principles](docs/architecture/principles.md) — local-first, marine-data, privacy, and AI rules
- [Idea log](docs/ideas/idea-log.md) — concepts under consideration, without implying commitment
- [Decision records](docs/decisions/README.md) — important choices and the reasoning behind them

When documentation and working software disagree, `current-product.md` must describe the software as it exists today. Vision and idea documents must not be treated as implemented functionality.
