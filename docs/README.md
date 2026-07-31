# Kill Tide Project Documentation

This directory converts the original Kill Tide conversations into a durable project memory.

## Document types

| Type | Purpose | Authority |
| --- | --- | --- |
| Vision | Enduring purpose, audience, brand, and north star | Stable; changes deliberately |
| Current product | What is working in the latest release | Must match the application |
| Roadmap | Ordered outcomes and release boundaries | Directional; reviewed after learning |
| Architecture | Technical and trust constraints | Binding unless replaced by a decision |
| Decisions | Why a consequential choice was made | Historical and append-only |
| Ideas | Possibilities worth remembering | Not approved scope |

## Working rule

An idea becomes roadmap work only after it has:

1. A clearly stated user problem.
2. A named target user.
3. Evidence or a testable hypothesis.
4. A defined smallest experiment.
5. An explicit decision to pursue it.

This distinction matters for an AI-native project: an agent may organize or develop an approved item, but it must not quietly interpret an idea as authorization to build it.

## Updating these documents

- Update `product/current-product.md` whenever shipped behavior changes.
- Add significant ideas to `ideas/idea-log.md`.
- Move accepted ideas into `product/roadmap.md`.
- Add a decision record when a choice changes architecture, privacy, safety, storage, data provenance, or product scope.
- Preserve rejected ideas and decisions so future collaborators do not repeat old debates without new evidence.
