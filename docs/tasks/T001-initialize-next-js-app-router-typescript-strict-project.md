---
id: T001
title: "Initialize Next.js (App Router) + TypeScript strict project"
milestone: "Phase 1: Setup"
priority: 3
estimate: 1
blockedBy: []
blocks: []
areas:
  - app
  - tooling
parent: null
---

# T001: Initialize Next.js (App Router) + TypeScript strict project

## Summary

Initialize Next.js (App Router) + TypeScript `strict` project at repo root: `package.json`, `tsconfig.json` (strict, no implicit any), `next.config.ts`, baseline `app/globals.css`

## Scope

In scope:

- Implement the work described in the summary, limited to the deliverable file(s) below.
- Keep changes additive and aligned with the feature plan.

Out of scope:

- Work belonging to other tasks in this planning wave.
- Changes to shared files owned by other tasks unless explicitly listed below.

## Deliverables

- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `app/globals.css`

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
- Milestone: Phase 1: Setup.
- Source task: `T001` in `specs/001-photo-album-organizer/tasks.md`.
- Depends on: None.
- Blocks: None.
- See `plan.md`, `data-model.md`, `research.md`, and `contracts/` for design detail.

## Definition of Ready

- Dependencies (None) are complete or in review.
- Required design artifacts (plan/data-model/contracts) are available.
- File ownership is clear and no conflicting in-flight edits exist.
- Acceptance criteria above are understood and testable.
