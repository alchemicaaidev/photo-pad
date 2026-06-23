---
id: T051
title: "Unit test reorderAlbums (new order persisted, atomic, validation error on unknown ids)"
milestone: "Phase 5: US3 Reorganize by Drag & Drop"
priority: 4
estimate: 1
blockedBy: []
blocks: []
areas:
  - storage
parent: null
---

# T051: Unit test reorderAlbums (new order persisted, atomic, validation error on unknown ids)

## Summary

Unit test `reorderAlbums` (new order persisted, atomic, validation error on unknown ids) in `lib/db/repository.reorder.test.ts` (maps to spec story US3)

## Scope

In scope:

- Implement the work described in the summary, limited to the deliverable file(s) below.
- Keep changes additive and aligned with the feature plan.

Out of scope:

- Work belonging to other tasks in this planning wave.
- Changes to shared files owned by other tasks unless explicitly listed below.

## Deliverables

- `lib/db/repository.reorder.test.ts`

## Acceptance Criteria

- The described test file exists and runs under Vitest.
- All listed behaviors are asserted and pass.
- For UI components, a jest-axe assertion reports no violations.
- `npm run test` passes for this file.

## Test Plan

- This task *is* the test. Run `npm run test` for the file(s) above.
- Confirm assertions cover every behavior named in the summary.
- Confirm `npm run typecheck` and `npm run lint` stay green.

## Context

- Feature: Photo Album Organizer (`specs/001-photo-album-organizer/`).
- Milestone: Phase 5: US3 Reorganize by Drag & Drop. (maps to spec story US3)
- Source task: `T051` in `specs/001-photo-album-organizer/tasks.md`.
- Depends on: None.
- Blocks: None.
- See `plan.md`, `data-model.md`, `research.md`, and `contracts/` for design detail.

## Definition of Ready

- Dependencies (None) are complete or in review.
- Required design artifacts (plan/data-model/contracts) are available.
- File ownership is clear and no conflicting in-flight edits exist.
- Acceptance criteria above are understood and testable.
