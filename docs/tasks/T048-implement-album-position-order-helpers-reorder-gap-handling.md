---
id: T048
title: "Implement album position/order helpers (reorder, gap handling)"
milestone: "Phase 5: US3 Reorganize by Drag & Drop"
priority: 4
estimate: 2
blockedBy: []
blocks: [T050]
areas:
  - core
parent: null
---

# T048: Implement album position/order helpers (reorder, gap handling)

## Summary

Implement album position/order helpers (reorder, gap handling) in `lib/ordering.ts` (maps to spec story US3)

## Scope

In scope:

- Implement the work described in the summary, limited to the deliverable file(s) below.
- Keep changes additive and aligned with the feature plan.

Out of scope:

- Work belonging to other tasks in this planning wave.
- Changes to shared files owned by other tasks unless explicitly listed below.

## Deliverables

- `lib/ordering.ts`

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
- Source task: `T048` in `specs/001-photo-album-organizer/tasks.md`.
- Depends on: None.
- Blocks: T050.
- See `plan.md`, `data-model.md`, `research.md`, and `contracts/` for design detail.

## Definition of Ready

- Dependencies (None) are complete or in review.
- Required design artifacts (plan/data-model/contracts) are available.
- File ownership is clear and no conflicting in-flight edits exist.
- Acceptance criteria above are understood and testable.
