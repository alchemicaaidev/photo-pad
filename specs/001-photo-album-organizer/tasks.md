---
description: "Task list for Photo Album Organizer implementation"
---

# Tasks: Photo Album Organizer

**Input**: Design documents from `/specs/001-photo-album-organizer/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Per Constitution Principle IV (Component Unit Testing, NON-NEGOTIABLE), every
component and utility ships unit tests (Vitest + RTL + jest-axe; `fake-indexeddb` for storage).
Test tasks are therefore included throughout, not optional.

**Organization**: Tasks are grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1 / US2 / US3 (maps to spec.md user stories)
- File paths are relative to the repository root.

## Path Conventions

Single Next.js App Router project: `app/`, `components/`, `lib/` at repo root; unit tests are
co-located as `*.test.ts(x)` beside the file under test.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and tooling

- [ ] T001 Initialize Next.js (App Router) + TypeScript `strict` project at repo root: `package.json`, `tsconfig.json` (strict, no implicit any), `next.config.ts`, baseline `app/globals.css`
- [ ] T002 [P] Add and pin runtime dependencies in `package.json`: `idb`, `@dnd-kit/core`, `@dnd-kit/sortable`, `exifr`, `@tanstack/react-virtual`
- [ ] T003 [P] Configure ESLint (+ `eslint-plugin-jsx-a11y`) and Prettier in `.eslintrc.json` / `.prettierrc`, with `lint` and `format` scripts in `package.json`
- [ ] T004 [P] Configure Vitest + React Testing Library + jest-axe + `fake-indexeddb` in `vitest.config.ts` and `tests/setup.ts`; add `typecheck` and `test` scripts to `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, storage, and shared UI primitives that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Define domain types (`Album`, `Photo`, `PhotoBlob`, `AddOutcome`, `AddResult`, `ValidationError`, `StorageError`) in `lib/types.ts`
- [ ] T006 Implement IndexedDB open/upgrade with object stores `albums`, `photos`, `photoBlobs` and indexes `by-position`, `by-album`, `by-album-order`, unique `by-album-hash` in `lib/db/schema.ts`
- [ ] T007 [P] Unit test IndexedDB schema — stores, indexes, and `(albumId, contentHash)` unique constraint — in `lib/db/schema.test.ts` (fake-indexeddb)
- [ ] T008 Create repository scaffolding (typed db handle accessor, `ValidationError`/`StorageError`) in `lib/db/repository.ts`
- [ ] T009 [P] Implement shared `Dialog` primitive (focus trap, Esc close, `role="dialog"` + `aria-modal`, labelled by title) in `components/ui/Dialog.tsx`
- [ ] T010 [P] Unit test `Dialog` (focus trap, Esc close, focus restore, jest-axe) in `components/ui/Dialog.test.tsx`
- [ ] T011 [P] Implement `VisuallyHidden` in `components/ui/VisuallyHidden.tsx` and unit test in `components/ui/VisuallyHidden.test.tsx`
- [ ] T012 [P] Implement `EmptyState` (heading, helper text, optional action) in `components/ui/EmptyState.tsx` and unit test in `components/ui/EmptyState.test.tsx`
- [ ] T013 Implement root layout (html `lang`, skip-link, global styles) in `app/layout.tsx`

**Checkpoint**: Foundation ready — user stories can now begin.

---

## Phase 3: User Story 1 - Browse albums & view photos (Priority: P1) 🎯 MVP

**Goal**: Display all albums as an ordered list and view an album's photos as a tile grid, with a larger preview and empty states.

**Independent Test**: Seed storage with ≥1 album containing photos; load the main page → albums show with title + date label; open an album → photos render as tiles; open a tile → larger preview; open an empty album → empty-state message. (FR-001/002/003/008/009/015)

### Implementation for User Story 1

- [ ] T014 [US1] Implement read methods `listAlbums` (by position), `listPhotos` (by order), `getPhotoThumbnails` (object URLs for range), `getFullImageUrl` in `lib/db/repository.ts`
- [ ] T015 [P] [US1] Unit test repository reads (album/photo ordering, thumbnail + full object-URL creation) in `lib/db/repository.read.test.ts` (fake-indexeddb)
- [ ] T016 [P] [US1] Implement `AlbumCard` (title + derived date label / "No date yet"; focusable; activates to open) in `components/albums/AlbumCard.tsx`
- [ ] T017 [P] [US1] Unit test `AlbumCard` (renders title/date/placeholder; keyboard activation; jest-axe) in `components/albums/AlbumCard.test.tsx`
- [ ] T018 [US1] Implement `AlbumList` (renders ordered `AlbumCard`s; no-albums `EmptyState`) in `components/albums/AlbumList.tsx` (depends on T016, T012)
- [ ] T019 [P] [US1] Unit test `AlbumList` (ordered render, empty state) in `components/albums/AlbumList.test.tsx`
- [ ] T020 [US1] Implement main page (load `listAlbums`, render `AlbumList`, navigate to album on open) in `app/page.tsx` (depends on T014, T018)
- [ ] T021 [P] [US1] Implement `PhotoTile` (thumbnail `<img>` with intrinsic width/height to avoid layout shift; button with accessible name) in `components/photos/PhotoTile.tsx`
- [ ] T022 [P] [US1] Unit test `PhotoTile` (renders thumbnail, accessible name, activation; jest-axe) in `components/photos/PhotoTile.test.tsx`
- [ ] T023 [US1] Implement `PhotoGrid` (virtualized via `@tanstack/react-virtual`; creates/revokes thumbnail object URLs for visible range; empty state) in `components/photos/PhotoGrid.tsx` (depends on T021, T015, T012)
- [ ] T024 [P] [US1] Unit test `PhotoGrid` (renders only visible subset, revokes URLs on unmount, empty state) in `components/photos/PhotoGrid.test.tsx`
- [ ] T025 [US1] Implement `PhotoLightbox` (modal on `Dialog`; full image; Esc closes; focus returns to originating tile) in `components/photos/PhotoLightbox.tsx` (depends on T009, T014)
- [ ] T026 [P] [US1] Unit test `PhotoLightbox` (open/close, focus restore, jest-axe) in `components/photos/PhotoLightbox.test.tsx`
- [ ] T027 [US1] Implement album detail page (load `listPhotos`, render `PhotoGrid`, open `PhotoLightbox` on tile, empty state) in `app/albums/[albumId]/page.tsx` (depends on T023, T025)

**Checkpoint**: User Story 1 fully functional and independently testable (with seeded data).

---

## Phase 4: User Story 2 - Create albums & add photos (Priority: P2)

**Goal**: Create titled albums, add photos (with format validation, content de-dup, EXIF date, thumbnails), remove photos, and delete albums — with the album date recomputing on change.

**Independent Test**: Create an album → appears at end of list; add supported images → tiles appear and date label = earliest capture date; add an unsupported file in a multi-select → rejected, others still added; add a byte-identical duplicate → rejected "already in this album"; remove photos to empty → "No date yet". (FR-004/005/006/007/016/016a/002a)

### Implementation for User Story 2

- [ ] T028 [P] [US2] Implement supported-format MIME guard in `lib/images/validate.ts`
- [ ] T029 [P] [US2] Unit test `validate` (accepts JPEG/PNG/GIF/WebP, rejects others) in `lib/images/validate.test.ts`
- [ ] T030 [P] [US2] Implement SHA-256 content hash (Web Crypto `subtle.digest`) in `lib/images/hash.ts`
- [ ] T031 [P] [US2] Unit test `hash` (stable hash; identical bytes → identical hash regardless of name) in `lib/images/hash.test.ts`
- [ ] T032 [P] [US2] Implement EXIF capture-date extraction with added-date fallback (`exifr`) in `lib/images/exif.ts`
- [ ] T033 [P] [US2] Unit test `exif` (reads DateTimeOriginal; falls back when absent) in `lib/images/exif.test.ts`
- [ ] T034 [P] [US2] Implement canvas thumbnail generation (~256px longest edge) + intrinsic dimensions in `lib/images/thumbnail.ts`
- [ ] T035 [P] [US2] Unit test `thumbnail` (downscales; reports dimensions; surfaces decode failure) in `lib/images/thumbnail.test.ts`
- [ ] T036 [US2] Implement `createAlbum` (trim/validate title, append `position`) in `lib/db/repository.ts`
- [ ] T037 [US2] Implement `addPhotos` pipeline (validate → hash → per-album dedup → EXIF date → thumbnail → persist; returns `AddResult` outcomes; recompute `derivedDate` + `photoCount`) in `lib/db/repository.ts` (depends on T028, T030, T032, T034)
- [ ] T038 [US2] Implement `removePhoto` (delete photo + blob, recompute date/count) and `deleteAlbum` (cascade photos + blobs) in `lib/db/repository.ts`
- [ ] T039 [P] [US2] Unit test repository writes (create; addPhotos added/rejected-format/rejected-corrupt/duplicate outcomes; date recompute; removePhoto; deleteAlbum cascade) in `lib/db/repository.write.test.ts`
- [ ] T040 [P] [US2] Implement `CreateAlbumDialog` (title input; blocks empty title) on `Dialog` in `components/albums/CreateAlbumDialog.tsx`
- [ ] T041 [P] [US2] Unit test `CreateAlbumDialog` (submit, empty-title block, jest-axe) in `components/albums/CreateAlbumDialog.test.tsx`
- [ ] T042 [P] [US2] Implement `AddPhotosControl` (multi-file input; per-file outcome messaging) in `components/photos/AddPhotosControl.tsx`
- [ ] T043 [P] [US2] Unit test `AddPhotosControl` (added/rejected/duplicate feedback; non-blocking multi-file) in `components/photos/AddPhotosControl.test.tsx`
- [ ] T044 [P] [US2] Implement `DeleteAlbumDialog` (confirmation) on `Dialog` in `components/albums/DeleteAlbumDialog.tsx`
- [ ] T045 [P] [US2] Unit test `DeleteAlbumDialog` (confirm/cancel, jest-axe) in `components/albums/DeleteAlbumDialog.test.tsx`
- [ ] T046 [US2] Wire create + delete album into main page in `app/page.tsx` (depends on T036, T038, T040, T044)
- [ ] T047 [US2] Wire add + remove photos and date-label refresh into album detail page in `app/albums/[albumId]/page.tsx` (depends on T037, T038, T042)

**Checkpoint**: User Stories 1 AND 2 both work independently; the app is fully usable end-to-end without seeding.

---

## Phase 5: User Story 3 - Re-organize albums by drag & drop (Priority: P3)

**Goal**: Reorder albums anywhere in the single main-page list via pointer drag-and-drop and via keyboard, with clear placement feedback and persisted order.

**Independent Test**: With ≥2 albums, drag one to a new position → placement indicator shows, drop reorders; reload → order preserved; Esc/invalid drop → unchanged; keyboard (grab → arrow → drop) reorders with `aria-live` announcements. (FR-011/012/014/017, SC-004/006)

### Implementation for User Story 3

- [ ] T048 [P] [US3] Implement album position/order helpers (reorder, gap handling) in `lib/ordering.ts`
- [ ] T049 [P] [US3] Unit test ordering helpers in `lib/ordering.test.ts`
- [ ] T050 [US3] Implement `reorderAlbums` (atomically reassign positions; validate ids) in `lib/db/repository.ts` (depends on T048)
- [ ] T051 [P] [US3] Unit test `reorderAlbums` (new order persisted, atomic, validation error on unknown ids) in `lib/db/repository.reorder.test.ts`
- [ ] T052 [US3] Integrate `@dnd-kit` `SortableContext` + pointer & keyboard sensors + drag overlay + `aria-live` announcements into `components/albums/AlbumList.tsx` and `components/albums/AlbumCard.tsx` (depends on T018)
- [ ] T053 [P] [US3] Extend `AlbumList`/`AlbumCard` unit tests for pointer reorder, keyboard reorder, and cancel-to-origin in `components/albums/AlbumList.test.tsx`
- [ ] T054 [US3] Wire reorder persistence (call `reorderAlbums` on drop) + placement feedback into main page in `app/page.tsx` (depends on T050, T052)

**Checkpoint**: All three user stories independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validation, performance, accessibility, and delivery gates across all stories

- [ ] T055 [P] Add CI workflow running `typecheck` + `lint` + `test` as merge gates in `.github/workflows/ci.yml`
- [ ] T056 [P] Add a large-album fixture/dev seed and verify SC-005 (first screen of 1,000 tiles < 2s) in `tests/perf/large-album.test.ts`
- [ ] T057 Accessibility audit (axe) across main page (default + mid-drag) and album detail (populated/empty/lightbox-open) per `quickstart.md`
- [ ] T058 [P] Write project `README.md` with setup, run, and test instructions
- [ ] T059 Run full `quickstart.md` validation scenarios A–D and check off the Done list

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories.
- **User Stories (Phases 3–5)**: All depend on Foundational. US1 → US2 → US3 in priority order; each is independently testable. US2 and US3 both extend `app/page.tsx` and `lib/db/repository.ts`, so if run in parallel, coordinate those shared files.
- **Polish (Phase 6)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: After Foundational. No dependency on other stories (testable with seeded data).
- **US2 (P2)**: After Foundational. Independent; makes US1 usable without seeding by providing create/add.
- **US3 (P3)**: After Foundational. Extends US1's `AlbumList`/main page with reordering; independently testable.

### Within Each Story

- Repository write/read methods before the pages that consume them.
- Utilities (`validate`/`hash`/`exif`/`thumbnail`) before `addPhotos` (T037).
- Components before the pages that compose them; each component before its consuming page.
- A component's unit test depends on that component existing.

---

## Parallel Opportunities

- **Setup**: T002, T003, T004 in parallel after T001.
- **Foundational**: T007, T009/T010, T011, T012 in parallel (different files); T013 after.
- **US1**: T016/T017 and T021/T022 in parallel; T015 parallel once T014 done. Note T014, T020 touch `repository.ts` / `page.tsx` and serialize with later stories.
- **US2**: All four image utilities + their tests (T028–T035) in parallel; component pairs T040/T041, T042/T043, T044/T045 in parallel. Repository write tasks T036–T038 serialize (same file).
- **US3**: T048/T049 in parallel; T050 then T052 then T054 serialize on shared files.

### Parallel Example: User Story 2 image utilities

```bash
Task: "Implement supported-format MIME guard in lib/images/validate.ts"
Task: "Implement SHA-256 content hash in lib/images/hash.ts"
Task: "Implement EXIF capture-date extraction in lib/images/exif.ts"
Task: "Implement canvas thumbnail generation in lib/images/thumbnail.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational).
2. Complete Phase 3 (US1).
3. **STOP and VALIDATE**: seed storage and confirm browse/view/lightbox/empty states work.
4. Demo the MVP.

### Incremental Delivery

1. Setup + Foundational → foundation ready.
2. US1 → browse & view (MVP, seeded data).
3. US2 → create/add/remove/delete → app fully self-sufficient.
4. US3 → drag-and-drop + keyboard reordering.
5. Polish → CI gates, performance, accessibility audit, quickstart sign-off.

### Notes

- [P] = different files, no dependency on incomplete tasks.
- Every component/utility ships unit tests (Constitution IV); jest-axe assertions accompany UI components (Constitution I).
- `app/page.tsx`, `app/albums/[albumId]/page.tsx`, and `lib/db/repository.ts` are shared across stories — serialize edits to them.
- Commit after each task or logical group; stop at any checkpoint to validate a story independently.
