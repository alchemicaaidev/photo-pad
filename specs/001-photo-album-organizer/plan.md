# Implementation Plan: Photo Album Organizer

**Branch**: `001-photo-album-organizer` | **Date**: 2026-06-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-photo-album-organizer/spec.md`

## Summary

A single-user web app for organizing personal photos into flat (never nested) albums. The
main page shows all albums as one freely re-orderable list (drag-and-drop + keyboard), each
album labeled with a date **derived** from its photos' capture dates. Opening an album shows
its photos in a virtualized tile grid; a tile opens a larger preview. Photos are added from
the user's own files, de-duplicated per album by content hash, and everything persists locally
in the browser via IndexedDB so it survives reloads with no backend or account.

Technical approach: Next.js (App Router) + TypeScript `strict`, client-side persistence in
IndexedDB (binary blobs for full image + generated thumbnail, plus metadata), `@dnd-kit` for
accessible drag-and-drop with built-in keyboard support, EXIF capture-date extraction, content
hashing via Web Crypto (SHA-256), and a virtualized grid for large albums. Testing with Vitest +
React Testing Library + jest-axe per the constitution.

## Technical Context

**Language/Version**: TypeScript 5.x (`strict` mode), Node.js 20 LTS for build/tooling

**Primary Dependencies**: Next.js 15 (App Router, React 19); `@dnd-kit/core` + `@dnd-kit/sortable` (accessible drag-and-drop, keyboard sensor); `idb` (typed IndexedDB wrapper); `exifr` (EXIF capture-date extraction); `@tanstack/react-virtual` (tile-grid virtualization)

**Storage**: Browser IndexedDB — object stores for albums, photos (metadata), and binary blobs (full image + thumbnail). No server database; data is local to the user's browser profile.

**Testing**: Vitest + React Testing Library (component unit tests); jest-axe (automated a11y assertions); `fake-indexeddb` for deterministic storage-layer tests. Lint: ESLint + `eslint-plugin-jsx-a11y`; format: Prettier.

**Target Platform**: Modern evergreen desktop browsers (Chromium, Firefox, Safari) supporting IndexedDB, Web Crypto SubtleCrypto, and Canvas. Responsive down to common tablet/mobile widths; no native mobile app.

**Project Type**: Web application (frontend-only Next.js; client-side persistence, no custom backend)

**Performance Goals**: Album main page interactive in < 1s for up to 50 albums; opening an album with up to 1,000 photos renders the first screen of tiles in < 2s (SC-005) via thumbnail previews + virtualization; drag reorder feels immediate (< 100ms visual response).

**Constraints**: Offline-capable (no network dependency after load); all photo bytes stay on-device (privacy); WCAG 2.1 AA; keyboard-operable reordering (FR-014); type-check + lint + a11y + unit tests are release gates (constitution Definition of Done).

**Scale/Scope**: Single user. Up to ~50 albums; up to ~1,000 photos per album as the performance target (larger allowed, gracefully degrading). ~6 screens/surfaces: main album list, album detail grid, photo lightbox, create-album, add-photos, delete confirmations.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Confirm this feature complies with the project constitution (v1.0.0):

- [x] **I. Accessibility First** — Built on `@dnd-kit` which ships a keyboard sensor and ARIA
      live-region announcements, satisfying keyboard reordering (FR-014) and visible drag
      feedback (FR-017). All interactive elements get semantic roles/names and visible focus;
      color is never the sole signal. jest-axe runs in unit tests and `eslint-plugin-jsx-a11y`
      in lint; screen-reader/keyboard flows verified for reorder, open-album, open-photo.
- [x] **II. Next.js + TypeScript (NON-NEGOTIABLE)** — App is Next.js App Router only, no
      competing UI framework; all code TypeScript `strict`; component props, the storage
      repository API, and module boundaries are explicitly typed; type errors fail the build.
- [x] **III. Clean & Simple UX** — Two primary screens each with a single purpose (album list;
      album detail). Minimal-step flows (create album → add photos → reorder). Shared UI
      primitives (AlbumCard, PhotoTile, EmptyState, Dialog) reused rather than one-off styling.
      No nesting, no editing features (YAGNI) — scope deliberately narrow.
- [x] **IV. Component Unit Testing (NON-NEGOTIABLE)** — Every component ships Vitest + RTL unit
      tests covering rendering, props/states, and primary interactions; storage/image utilities
      unit-tested with `fake-indexeddb`; jest-axe assertions per component; tests run in CI on
      every PR; bug fixes add regression tests.

No deviations — Complexity Tracking left empty.

## Project Structure

### Documentation (this feature)

```text
specs/001-photo-album-organizer/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── storage-repository.md   # Album/Photo persistence API contract
│   └── ui-contracts.md         # Screen/component behavioral contracts
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
app/                              # Next.js App Router
├── layout.tsx                    # Root layout, global providers, skip-link
├── page.tsx                      # Main page: album list (free-order, drag-and-drop)
├── albums/
│   └── [albumId]/
│       └── page.tsx              # Album detail: virtualized photo tile grid
└── globals.css

components/
├── albums/
│   ├── AlbumList.tsx             # Sortable list wrapper (dnd-kit context)
│   ├── AlbumCard.tsx             # Single draggable album (title + date label)
│   ├── CreateAlbumDialog.tsx
│   └── DeleteAlbumDialog.tsx
├── photos/
│   ├── PhotoGrid.tsx             # Virtualized tile grid
│   ├── PhotoTile.tsx             # Thumbnail tile
│   ├── PhotoLightbox.tsx         # Larger preview overlay
│   └── AddPhotosControl.tsx      # File input + validation + de-dup feedback
└── ui/
    ├── EmptyState.tsx
    ├── Dialog.tsx
    └── VisuallyHidden.tsx

lib/
├── db/
│   ├── schema.ts                 # IndexedDB store definitions + open/upgrade
│   └── repository.ts             # Typed Album/Photo CRUD + reorder + date recompute
├── images/
│   ├── thumbnail.ts              # Canvas-based thumbnail generation
│   ├── hash.ts                   # SHA-256 content hash (Web Crypto)
│   ├── exif.ts                   # Capture-date extraction with fallback
│   └── validate.ts               # Supported-format guard
├── types.ts                      # Album, Photo, and shared domain types
└── ordering.ts                   # Fractional/position ordering helpers

tests/
├── setup.ts                      # jest-axe + fake-indexeddb wiring
└── (component tests co-located as *.test.tsx next to components)
```

**Structure Decision**: Single Next.js App Router project (frontend-only). No separate backend
because persistence is entirely client-side in IndexedDB — adding a server would violate Clean &
Simple UX (YAGNI) and is unnecessary for a single-user, local-data app. `app/` holds routes,
`components/` holds reusable, individually-tested UI primitives, and `lib/` isolates storage and
image utilities behind typed module boundaries so they can be unit-tested independently of React.

## Complexity Tracking

> No constitution violations. Section intentionally empty.
