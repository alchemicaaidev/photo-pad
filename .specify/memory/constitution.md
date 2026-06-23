<!--
SYNC IMPACT REPORT
==================
Version change: (template / unversioned) → 1.0.0
Bump rationale: Initial ratification — placeholder template replaced with concrete,
                project-specific governance. First adopted version.

Modified principles (placeholder → concrete):
  - [PRINCIPLE_1_NAME] → I. Accessibility First
  - [PRINCIPLE_2_NAME] → II. Next.js + TypeScript Stack (NON-NEGOTIABLE)
  - [PRINCIPLE_3_NAME] → III. Clean & Simple UX
  - [PRINCIPLE_4_NAME] → IV. Component Unit Testing (NON-NEGOTIABLE)
  - [PRINCIPLE_5_NAME] → (removed; user specified exactly 4 principles)

Added sections:
  - Technology & Quality Constraints (was [SECTION_2_NAME])
  - Development Workflow & Quality Gates (was [SECTION_3_NAME])

Removed sections:
  - Fifth principle slot (intentional — user scope is 4 principles)

Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Constitution Check gates filled)
  - ✅ .specify/templates/tasks-template.md (unit-test mandate noted)
  - ✅ .specify/templates/spec-template.md (reviewed — no change required;
        accessibility/UX captured via acceptance scenarios)
  - ✅ .specify/templates/checklist-template.md (reviewed — no change required)

Follow-up TODOs: none. RATIFICATION_DATE set to initial-adoption date (today).
-->

# Cooking Pad Constitution

## Core Principles

### I. Accessibility First

Accessibility is a non-negotiable, ever-present requirement — never an afterthought or a
later "polish" pass.

- Every user-facing feature MUST meet WCAG 2.1 Level AA as the minimum bar.
- All interactive elements MUST be fully keyboard operable, expose correct semantic roles
  and accessible names, and maintain a visible focus indicator.
- Color MUST NOT be the sole carrier of meaning; text and interactive states MUST satisfy
  AA contrast ratios.
- New or changed UI MUST be validated with automated accessibility checks (e.g.
  axe/jest-axe) AND verified for screen-reader and keyboard-only flows before merge.

**Rationale**: The product is for everyone. Building accessibility in from the first commit
is cheaper, more reliable, and more inclusive than retrofitting it later.

### II. Next.js + TypeScript Stack (NON-NEGOTIABLE)

The application MUST be built on the Next.js framework using TypeScript.

- All application code MUST be authored in TypeScript with `strict` mode enabled; `any` is
  prohibited except with an inline justification comment.
- The web application MUST be implemented with Next.js; introducing a competing UI
  framework or bypassing Next.js routing/rendering conventions is not permitted.
- Public functions, component props, and module boundaries MUST be explicitly typed; type
  errors MUST fail the build.

**Rationale**: A single, agreed framework and a fully typed codebase give the team
consistency, compile-time safety, and a shared mental model that keeps velocity high.

### III. Clean & Simple UX

The user experience MUST be clean and simple, favoring clarity over feature density.

- Each screen MUST have a single primary purpose; secondary actions MUST NOT compete for
  attention with the primary task.
- Prefer the smallest interaction that accomplishes the user's goal — minimize steps,
  inputs, and on-screen choices.
- Visual language (spacing, typography, components) MUST be consistent and reuse shared UI
  primitives rather than introducing one-off styling.
- Added complexity MUST be justified by clear user value; when in doubt, remove it (YAGNI).

**Rationale**: Simplicity reduces cognitive load, lowers support cost, and makes the
product approachable for new and returning users alike.

### IV. Component Unit Testing (NON-NEGOTIABLE)

Every component MUST ship with unit tests.

- No UI or logic component MAY be merged without accompanying unit tests covering its
  rendering, props/states, and primary user interactions.
- Tests MUST be deterministic, isolated, and run in CI on every pull request; a failing or
  missing test for a changed component blocks merge.
- Bug fixes MUST add a regression test reproducing the defect.
- Coverage MUST NOT regress: the test suite is a release gate, not optional tooling.

**Rationale**: Per-component tests catch regressions early, document intended behavior, and
make refactoring safe — which is what keeps a simple, accessible UX from eroding over time.

## Technology & Quality Constraints

- **Framework & language**: Next.js + TypeScript (`strict`) are mandatory per Principle II.
- **Accessibility tooling**: Automated a11y checks (e.g. eslint-plugin-jsx-a11y, jest-axe)
  MUST be part of lint/test and run in CI.
- **Testing tooling**: A component-capable unit test runner (e.g. Jest/Vitest +
  React Testing Library) MUST be configured; tests run on every PR.
- **Linting & formatting**: Linting and formatting MUST be enforced in CI; violations fail
  the build.
- **Definition of Done** for any change: types pass, lint passes, accessibility checks
  pass, and unit tests for all touched/added components pass.

## Development Workflow & Quality Gates

- **Pull requests** are the unit of change. Every PR MUST pass the full gate: type-check,
  lint (including a11y rules), and the unit test suite.
- **Reviews** MUST verify compliance with all four core principles before approval; a
  reviewer MUST block merges that add inaccessible UI, untested components, non-TypeScript
  code, or unjustified UX complexity.
- **Constitution Check**: Feature plans MUST include a Constitution Check confirming the
  feature honors Accessibility First, the Next.js + TypeScript stack, Clean & Simple UX,
  and Component Unit Testing. Any deviation MUST be documented and justified.

## Governance

This constitution supersedes all other development practices. When guidance conflicts, the
constitution wins.

- **Amendments** MUST be proposed via pull request, include a rationale and any migration
  notes, and be approved by project maintainers before taking effect.
- **Versioning policy** follows semantic versioning: MAJOR for backward-incompatible
  governance or principle removals/redefinitions, MINOR for a new principle/section or
  materially expanded guidance, PATCH for clarifications and non-semantic refinements.
- **Compliance review**: All PRs and reviews MUST verify compliance with the core
  principles; complexity that violates a principle MUST be justified in writing or removed.
- Use the project's agent/runtime guidance files (e.g. `CLAUDE.md`) for day-to-day
  development conventions that operationalize these principles.

**Version**: 1.0.0 | **Ratified**: 2026-06-22 | **Last Amended**: 2026-06-22
