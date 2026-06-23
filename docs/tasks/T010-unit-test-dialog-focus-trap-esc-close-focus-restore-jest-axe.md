---
id: T010
title: "Unit test Dialog (focus trap, Esc close, focus restore, jest-axe)"
milestone: "Phase 2: Foundational"
priority: 2
estimate: 1
blockedBy: []
blocks: []
areas:
  - ui
parent: null
---

# T010: Unit test Dialog (focus trap, Esc close, focus restore, jest-axe)

## Summary

Unit test `Dialog` (focus trap, Esc close, focus restore, jest-axe) in `components/ui/Dialog.test.tsx`

## Scope

In scope:

- Implement the work described in the summary, limited to the deliverable file(s) below.
- Keep changes additive and aligned with the feature plan.

Out of scope:

- Work belonging to other tasks in this planning wave.
- Changes to shared files owned by other tasks unless explicitly listed below.

## Deliverables

- `components/ui/Dialog.test.tsx`

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
- Milestone: Phase 2: Foundational.
- Source task: `T010` in `specs/001-photo-album-organizer/tasks.md`.
- Depends on: None.
- Blocks: None.
- See `plan.md`, `data-model.md`, `research.md`, and `contracts/` for design detail.

## Definition of Ready

- Dependencies (None) are complete or in review.
- Required design artifacts (plan/data-model/contracts) are available.
- File ownership is clear and no conflicting in-flight edits exist.
- Acceptance criteria above are understood and testable.
