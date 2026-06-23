# Research: Photo Album Organizer

**Feature**: 001-photo-album-organizer | **Date**: 2026-06-22 | **Phase**: 0

This document resolves the technical unknowns implied by the spec and constitution. All
decisions are constrained by Constitution v1.0.0 (Next.js + TypeScript, Accessibility First,
Clean & Simple UX, Component Unit Testing).

---

## 1. Local persistence for albums + binary photos

**Decision**: Browser **IndexedDB** (accessed via the `idb` typed wrapper), storing album
records, photo metadata records, and binary `Blob`s (full image + generated thumbnail) in
dedicated object stores.

**Rationale**:
- Spec assumption: "Data persists locally to the user's environment" with no cloud/sync and a
  single user. IndexedDB is the only browser storage that holds large binary blobs durably and
  asynchronously without blocking the UI.
- `localStorage` is unsuitable (string-only, ~5 MB cap, synchronous) — photos would overflow it.
- Keeps the app backend-free, satisfying Clean & Simple UX (no server, accounts, or DB ops).
- `idb` gives a small, fully-typed Promise API over IndexedDB, preserving TypeScript `strict`
  boundaries (Principle II) and is trivially testable with `fake-indexeddb`.

**Alternatives considered**:
- *Server + SQL/object store*: rejected — unnecessary for single-user local data; adds
  infrastructure, auth, and complexity with no user value (YAGNI).
- *Origin Private File System (OPFS)*: capable for blobs but more ceremony and weaker Safari
  story; IndexedDB metadata querying is simpler for album/photo relationships.
- *Raw IndexedDB API*: rejected — verbose, callback-ish, easy to mistype; `idb` is the standard
  ergonomic wrapper.

---

## 2. Accessible drag-and-drop reordering (FR-011, FR-014, FR-017)

**Decision**: **`@dnd-kit/core` + `@dnd-kit/sortable`** with the keyboard sensor enabled and the
built-in screen-reader announcements.

**Rationale**:
- Constitution Principle I requires keyboard-operable reordering; `@dnd-kit` ships a
  `KeyboardSensor` so albums reorder with arrow keys + space, directly satisfying FR-014 and
  SC-006 without bespoke keyboard handling.
- Provides drag overlay + `aria-live` announcements for "picked up / moved over / dropped",
  satisfying FR-017 (clear placement feedback) accessibly.
- Pointer + keyboard sensors share one model, so drag-cancel/return-to-origin (Edge Case) is
  handled uniformly.
- Actively maintained, React 19 compatible, tree-shakeable, TypeScript-native.

**Alternatives considered**:
- *Native HTML5 Drag and Drop API*: rejected — poor keyboard support and inconsistent
  cross-browser behavior; would require building accessibility from scratch.
- *react-beautiful-dnd*: rejected — effectively unmaintained and not React 19 ready.
- *Custom pointer-event implementation*: rejected — high cost to reach AA keyboard/SR parity.

**Ordering model**: Each album stores a numeric `position`. On reorder, recompute positions for
the moved range (or use a fractional-index gap strategy in `lib/ordering.ts`) and persist
immediately so order survives reload (FR-012, SC-004). The main page is a single sortable list —
no per-date grouping (clarification 1).

---

## 3. Album date derivation from photo capture dates (FR-002a)

**Decision**: Extract each photo's capture date with **`exifr`** (reads EXIF `DateTimeOriginal`);
fall back to the photo's "added" timestamp when metadata is absent. The album's displayed date is
the **earliest** capture date among its photos, recomputed on every add/remove. Empty album → no
date → "No date yet" placeholder.

**Rationale**:
- Clarification 2 fixed the semantics: derived, recomputed, not user-editable, representative =
  earliest capture date.
- `exifr` is lightweight, browser-friendly, supports selective parsing (read only the date tag
  for speed), and handles JPEG/HEIC/PNG/WebP gracefully, returning undefined when no EXIF exists
  (clean fallback path).
- Storing each photo's resolved `captureDate` lets album-date recomputation be a cheap `min()`
  over the album's photos rather than re-parsing EXIF.

**Alternatives considered**:
- *exif-js*: rejected — older, unmaintained, larger, weaker format coverage.
- *Manual EXIF parsing*: rejected — error-prone; no value over a vetted library.
- *Latest date / date range*: rejected — clarification specified earliest as the single
  representative date.

---

## 4. Duplicate detection by image content (FR-016a)

**Decision**: Compute a **SHA-256 hash of the raw file bytes** using Web Crypto
`crypto.subtle.digest`, store it on the photo record, and reject an add when the same hash already
exists **within the target album**.

**Rationale**:
- Clarification 3: duplicates are "identical file bytes, regardless of filename," scoped per
  album. A byte hash is exactly that — rename-proof, deterministic.
- Web Crypto is built-in (no dependency), fast, and async (won't block UI for large files).
- Per-album uniqueness index on `(albumId, contentHash)` makes the check O(1) and enforces the
  "same image may exist independently in different albums" rule.

**Alternatives considered**:
- *Filename matching*: rejected by clarification (would miss renamed dupes / false-positive on
  same-named different images).
- *Perceptual/visual hashing*: rejected — clarification asked for exact bytes, not visual
  similarity; perceptual hashing risks false positives and adds complexity.
- *Full byte-by-byte compare*: rejected — O(n) against every existing photo; hashing is the
  standard indexable approach.

---

## 5. Rendering up to 1,000 tiles within 2s (SC-005)

**Decision**: Generate a **downscaled thumbnail** (Canvas `drawImage` → `toBlob`, ~256px longest
edge) on import, store it alongside the full image, and render the tile grid with
**`@tanstack/react-virtual`** so only visible tiles mount. Thumbnails are served from IndexedDB
via short-lived `URL.createObjectURL` handles, revoked on unmount.

**Rationale**:
- Tiles must show previews, not full images — full-resolution decode of 1,000 photos would blow
  the 2s budget and memory. Thumbnails keep decode/paint cheap.
- Virtualization renders ~one screenful regardless of album size, keeping first-paint within
  budget and the grid responsive (Edge Case: very large album).
- Generating thumbnails once at import time amortizes cost away from the hot view path.

**Alternatives considered**:
- *Render all tiles, no virtualization*: rejected — 1,000 DOM nodes + object URLs janks scroll
  and risks the 2s target.
- *next/image*: rejected for IndexedDB blobs — its optimizer targets network/static images, not
  in-browser object URLs; a plain `<img>` with explicit `width`/`height` (no layout shift) and
  `loading`/`decoding` hints fits better here.
- *Generate thumbnails lazily on first view*: rejected — first open of a large album would pay
  the full generation cost, missing SC-005; do it at import instead.

---

## 6. Testing & accessibility tooling (Constitution Principle IV + I)

**Decision**: **Vitest + React Testing Library** for component unit tests, **jest-axe** for
automated a11y assertions, **`fake-indexeddb`** for deterministic storage-layer tests.
**ESLint + `eslint-plugin-jsx-a11y`** and **Prettier** enforced in CI; type-check is a gate.

**Rationale**:
- Constitution names Jest/Vitest + RTL and axe/jest-axe explicitly; Vitest is fast, ESM-native,
  and integrates cleanly with the Next.js/TS toolchain.
- `fake-indexeddb` lets repository and de-dup/date-derivation logic be tested without a browser,
  keeping tests deterministic and CI-friendly.
- Per-component jest-axe checks operationalize "validated with automated accessibility checks."

**Alternatives considered**:
- *Jest*: viable but slower config with ESM/Next; Vitest preferred for DX and speed.
- *Playwright-only*: rejected as the primary gate — constitution mandates per-component unit
  tests; E2E may be added later but does not replace them.

---

## Resolved unknowns

| Spec/Context item | Resolution |
|-------------------|------------|
| Persistence mechanism (deferred from clarify) | IndexedDB via `idb` (§1) |
| Per-photo size / large-library scale (deferred) | Thumbnails + virtualization; target 1k photos/album (§5) |
| Drag-and-drop + keyboard reordering library | `@dnd-kit` (§2) |
| Capture-date extraction | `exifr`, earliest date, added-date fallback (§3) |
| Duplicate detection method | SHA-256 byte hash, per-album unique (§4) |
| Test/a11y stack | Vitest + RTL + jest-axe + fake-indexeddb (§6) |

**No remaining NEEDS CLARIFICATION.** Ready for Phase 1.
