---
id: T054
title: "Wire reorder persistence (call reorderAlbums on drop) + placement feedback"
milestone: "Phase 5: US3 Reorganize by Drag & Drop"
priority: 4
estimate: 3
blockedBy: [T050, T052]
blocks: []
areas:
  - app
parent: null
---

# T054: Wire reorder persistence (call reorderAlbums on drop) + placement feedback

## Summary

Wire reorder persistence (call `reorderAlbums` on drop) + placement feedback into main page in `app/page.tsx` (depends on T050, T052) (maps to spec story US3)

## Scope

In scope:

- Implement the work described in the summary, limited to the deliverable file(s) below.
- Keep changes additive and aligned with the feature plan.

Out of scope:

- Work belonging to other tasks in this planning wave.
- Changes to shared files owned by other tasks unless explicitly listed below.

## Deliverables

- `app/page.tsx`

## Acceptance Criteria

- The behavior described in the summary is implemented in the listed file(s).
- TypeScript `strict` compiles with no errors (`npm run typecheck`).
- `npm run lint` reports no errors (including jsx-a11y for UI).
- No regressions in existing tests (`npm run test`).

## Test Plan

- Accompanying co-located unit test (`*.test.ts(x)`) covers this work per Constitution IV.
- `npm run typecheck && npm run lint && npm run test` all pass.
- For UI components, include a jest-axe assertion in the co-located test.

## Context

- Feature: Photo Album Organizer (`specs/001-photo-album-organizer/`).
- Milestone: Phase 5: US3 Reorganize by Drag & Drop. (maps to spec story US3)
- Source task: `T054` in `specs/001-photo-album-organizer/tasks.md`.
- Depends on: T050, T052.
- Blocks: None.
- See `plan.md`, `data-model.md`, `research.md`, and `contracts/` for design detail.

## Definition of Ready

- Dependencies (T050, T052) are complete or in review.
- Required design artifacts (plan/data-model/contracts) are available.
- File ownership is clear and no conflicting in-flight edits exist.
- Acceptance criteria above are understood and testable.
