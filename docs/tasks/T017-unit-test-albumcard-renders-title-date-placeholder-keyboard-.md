---
id: T017
title: "Unit test AlbumCard (renders title/date/placeholder; keyboard activation; jest-axe)"
milestone: "Phase 3: US1 Browse & View Photos"
priority: 2
estimate: 1
blockedBy: []
blocks: []
areas:
  - albums
parent: null
---

# T017: Unit test AlbumCard (renders title/date/placeholder; keyboard activation; jest-axe)

## Summary

Unit test `AlbumCard` (renders title/date/placeholder; keyboard activation; jest-axe) in `components/albums/AlbumCard.test.tsx` (maps to spec story US1)

## Scope

In scope:

- Implement the work described in the summary, limited to the deliverable file(s) below.
- Keep changes additive and aligned with the feature plan.

Out of scope:

- Work belonging to other tasks in this planning wave.
- Changes to shared files owned by other tasks unless explicitly listed below.

## Deliverables

- `components/albums/AlbumCard.test.tsx`

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
- Milestone: Phase 3: US1 Browse & View Photos. (maps to spec story US1)
- Source task: `T017` in `specs/001-photo-album-organizer/tasks.md`.
- Depends on: None.
- Blocks: None.
- See `plan.md`, `data-model.md`, `research.md`, and `contracts/` for design detail.

## Definition of Ready

- Dependencies (None) are complete or in review.
- Required design artifacts (plan/data-model/contracts) are available.
- File ownership is clear and no conflicting in-flight edits exist.
- Acceptance criteria above are understood and testable.
