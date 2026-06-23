---
id: T047
title: "Wire add + remove photos and date-label refresh"
milestone: "Phase 4: US2 Create Albums & Add Photos"
priority: 3
estimate: 3
blockedBy: [T037, T038, T042]
blocks: []
areas:
  - app
parent: null
---

# T047: Wire add + remove photos and date-label refresh

## Summary

Wire add + remove photos and date-label refresh into album detail page in `app/albums/[albumId]/page.tsx` (depends on T037, T038, T042) (maps to spec story US2)

## Scope

In scope:

- Implement the work described in the summary, limited to the deliverable file(s) below.
- Keep changes additive and aligned with the feature plan.

Out of scope:

- Work belonging to other tasks in this planning wave.
- Changes to shared files owned by other tasks unless explicitly listed below.

## Deliverables

- `app/albums/[albumId]/page.tsx`

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
- Milestone: Phase 4: US2 Create Albums & Add Photos. (maps to spec story US2)
- Source task: `T047` in `specs/001-photo-album-organizer/tasks.md`.
- Depends on: T037, T038, T042.
- Blocks: None.
- See `plan.md`, `data-model.md`, `research.md`, and `contracts/` for design detail.

## Definition of Ready

- Dependencies (T037, T038, T042) are complete or in review.
- Required design artifacts (plan/data-model/contracts) are available.
- File ownership is clear and no conflicting in-flight edits exist.
- Acceptance criteria above are understood and testable.
