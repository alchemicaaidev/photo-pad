---
id: T039
title: "Unit test repository writes (create; addPhotos added/rejected-format/rejected-corrupt/duplicate outcomes; date recompute; removePhoto; deleteAlbum cascade)"
milestone: "Phase 4: US2 Create Albums & Add Photos"
priority: 3
estimate: 1
blockedBy: []
blocks: []
areas:
  - storage
parent: null
---

# T039: Unit test repository writes (create; addPhotos added/rejected-format/rejected-corrupt/duplicate outcomes; date recompute; removePhoto; deleteAlbum cascade)

## Summary

Unit test repository writes (create; addPhotos added/rejected-format/rejected-corrupt/duplicate outcomes; date recompute; removePhoto; deleteAlbum cascade) in `lib/db/repository.write.test.ts` (maps to spec story US2)

## Scope

In scope:

- Implement the work described in the summary, limited to the deliverable file(s) below.
- Keep changes additive and aligned with the feature plan.

Out of scope:

- Work belonging to other tasks in this planning wave.
- Changes to shared files owned by other tasks unless explicitly listed below.

## Deliverables

- `lib/db/repository.write.test.ts`

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
- Milestone: Phase 4: US2 Create Albums & Add Photos. (maps to spec story US2)
- Source task: `T039` in `specs/001-photo-album-organizer/tasks.md`.
- Depends on: None.
- Blocks: None.
- See `plan.md`, `data-model.md`, `research.md`, and `contracts/` for design detail.

## Definition of Ready

- Dependencies (None) are complete or in review.
- Required design artifacts (plan/data-model/contracts) are available.
- File ownership is clear and no conflicting in-flight edits exist.
- Acceptance criteria above are understood and testable.
