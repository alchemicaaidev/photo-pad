---
id: T050
title: "Implement reorderAlbums (atomically reassign positions; validate ids)"
milestone: "Phase 5: US3 Reorganize by Drag & Drop"
priority: 4
estimate: 2
blockedBy: [T048]
blocks: [T054]
areas:
  - storage
parent: null
---

# T050: Implement reorderAlbums (atomically reassign positions; validate ids)

## Summary

Implement `reorderAlbums` (atomically reassign positions; validate ids) in `lib/db/repository.ts` (depends on T048) (maps to spec story US3)

## Scope

In scope:

- Implement the work described in the summary, limited to the deliverable file(s) below.
- Keep changes additive and aligned with the feature plan.

Out of scope:

- Work belonging to other tasks in this planning wave.
- Changes to shared files owned by other tasks unless explicitly listed below.

## Deliverables

- `lib/db/repository.ts`

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
- Source task: `T050` in `specs/001-photo-album-organizer/tasks.md`.
- Depends on: T048.
- Blocks: T054.
- See `plan.md`, `data-model.md`, `research.md`, and `contracts/` for design detail.

## Definition of Ready

- Dependencies (T048) are complete or in review.
- Required design artifacts (plan/data-model/contracts) are available.
- File ownership is clear and no conflicting in-flight edits exist.
- Acceptance criteria above are understood and testable.
