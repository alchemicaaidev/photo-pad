---
id: T056
title: "Add a large-album fixture/dev seed and verify SC-005 (first screen of 1,000 tiles < 2s)"
milestone: "Phase 6: Polish & Cross-Cutting"
priority: 4
estimate: 1
blockedBy: []
blocks: []
areas:
  - testing
parent: null
---

# T056: Add a large-album fixture/dev seed and verify SC-005 (first screen of 1,000 tiles < 2s)

## Summary

Add a large-album fixture/dev seed and verify SC-005 (first screen of 1,000 tiles < 2s) in `tests/perf/large-album.test.ts`

## Scope

In scope:

- Implement the work described in the summary, limited to the deliverable file(s) below.
- Requirement references: SC-005.

Out of scope:

- Work belonging to other tasks in this planning wave.
- Changes to shared files owned by other tasks unless explicitly listed below.

## Deliverables

- `tests/perf/large-album.test.ts`

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
- Milestone: Phase 6: Polish & Cross-Cutting.
- Source task: `T056` in `specs/001-photo-album-organizer/tasks.md`.
- Depends on: None.
- Blocks: None.
- See `plan.md`, `data-model.md`, `research.md`, and `contracts/` for design detail.

## Definition of Ready

- Dependencies (None) are complete or in review.
- Required design artifacts (plan/data-model/contracts) are available.
- File ownership is clear and no conflicting in-flight edits exist.
- Acceptance criteria above are understood and testable.
