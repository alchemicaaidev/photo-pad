# Planning Wave: Photo Album Organizer

## Milestones

### Phase 1: Setup

- T001: Initialize Next.js (App Router) + TypeScript strict project
- T002: Add and pin runtime dependencies
- T003: Configure ESLint (+ eslint-plugin-jsx-a11y) and Prettier
- T004: Configure Vitest + React Testing Library + jest-axe + fake-indexeddb

### Phase 2: Foundational

- T005: Define domain types (Album, Photo, PhotoBlob, AddOutcome, AddResult, ValidationError, StorageError)
- T006: Implement IndexedDB open/upgrade with object stores albums, photos, photoBlobs and indexes by-position, by-album, by-album-order, unique by-album-hash
- T007: Unit test IndexedDB schema — stores, indexes, and (albumId, contentHash) unique constraint —
- T008: Create repository scaffolding (typed db handle accessor, ValidationError/StorageError)
- T009: Implement shared Dialog primitive (focus trap, Esc close, role="dialog" + aria-modal, labelled by title)
- T010: Unit test Dialog (focus trap, Esc close, focus restore, jest-axe)
- T011: Implement VisuallyHidden
- T012: Implement EmptyState (heading, helper text, optional action)
- T013: Implement root layout (html lang, skip-link, global styles)

### Phase 3: US1 Browse & View Photos

- T014: Implement read methods listAlbums (by position), listPhotos (by order), getPhotoThumbnails (object URLs for range), getFullImageUrl
- T015: Unit test repository reads (album/photo ordering, thumbnail + full object-URL creation)
- T016: Implement AlbumCard (title + derived date label / "No date yet"; focusable; activates to open)
- T017: Unit test AlbumCard (renders title/date/placeholder; keyboard activation; jest-axe)
- T018: Implement AlbumList (renders ordered AlbumCards; no-albums EmptyState)
- T019: Unit test AlbumList (ordered render, empty state)
- T020: Implement main page (load listAlbums, render AlbumList, navigate to album on open)
- T021: Implement PhotoTile (thumbnail <img> with intrinsic width/height to avoid layout shift; button with accessible name)
- T022: Unit test PhotoTile (renders thumbnail, accessible name, activation; jest-axe)
- T023: Implement PhotoGrid (virtualized via @tanstack/react-virtual; creates/revokes thumbnail object URLs for visible range; empty state)
- T024: Unit test PhotoGrid (renders only visible subset, revokes URLs on unmount, empty state)
- T025: Implement PhotoLightbox (modal on Dialog; full image; Esc closes; focus returns to originating tile)
- T026: Unit test PhotoLightbox (open/close, focus restore, jest-axe)
- T027: Implement album detail page (load listPhotos, render PhotoGrid, open PhotoLightbox on tile, empty state)

### Phase 4: US2 Create Albums & Add Photos

- T028: Implement supported-format MIME guard
- T029: Unit test validate (accepts JPEG/PNG/GIF/WebP, rejects others)
- T030: Implement SHA-256 content hash (Web Crypto subtle.digest)
- T031: Unit test hash (stable hash; identical bytes → identical hash regardless of name)
- T032: Implement EXIF capture-date extraction with added-date fallback (exifr)
- T033: Unit test exif (reads DateTimeOriginal; falls back when absent)
- T034: Implement canvas thumbnail generation (~256px longest edge) + intrinsic dimensions
- T035: Unit test thumbnail (downscales; reports dimensions; surfaces decode failure)
- T036: Implement createAlbum (trim/validate title, append position)
- T037: Implement addPhotos pipeline (validate → hash → per-album dedup → EXIF date → thumbnail → persist; returns AddResult outcomes; recompute derivedDate + photoCount)
- T038: Implement removePhoto (delete photo + blob, recompute date/count) and deleteAlbum (cascade photos + blobs)
- T039: Unit test repository writes (create; addPhotos added/rejected-format/rejected-corrupt/duplicate outcomes; date recompute; removePhoto; deleteAlbum cascade)
- T040: Implement CreateAlbumDialog (title input; blocks empty title) on Dialog
- T041: Unit test CreateAlbumDialog (submit, empty-title block, jest-axe)
- T042: Implement AddPhotosControl (multi-file input; per-file outcome messaging)
- T043: Unit test AddPhotosControl (added/rejected/duplicate feedback; non-blocking multi-file)
- T044: Implement DeleteAlbumDialog (confirmation) on Dialog
- T045: Unit test DeleteAlbumDialog (confirm/cancel, jest-axe)
- T046: Wire create + delete album
- T047: Wire add + remove photos and date-label refresh

### Phase 5: US3 Reorganize by Drag & Drop

- T048: Implement album position/order helpers (reorder, gap handling)
- T049: Unit test ordering helpers
- T050: Implement reorderAlbums (atomically reassign positions; validate ids)
- T051: Unit test reorderAlbums (new order persisted, atomic, validation error on unknown ids)
- T052: Integrate @dnd-kit SortableContext + pointer & keyboard sensors + drag overlay + aria-live announcements
- T053: Extend AlbumList/AlbumCard unit tests for pointer reorder, keyboard reorder, and cancel-to-origin
- T054: Wire reorder persistence (call reorderAlbums on drop) + placement feedback

### Phase 6: Polish & Cross-Cutting

- T055: Add CI workflow running typecheck + lint + test as merge gates
- T056: Add a large-album fixture/dev seed and verify SC-005 (first screen of 1,000 tiles < 2s)
- T057: Accessibility audit (axe) across main page (default + mid-drag) and album detail (populated/empty/lightbox-open) per quickstart.md
- T058: Write project README.md with setup, run, and test instructions
- T059: Run full quickstart.md validation scenarios A–D and check off the Done list
