# Data Model: Photo Album Organizer

**Feature**: 001-photo-album-organizer | **Date**: 2026-06-22 | **Phase**: 1

Derived from the spec's Key Entities and Functional Requirements. Persistence target is
IndexedDB (see [research.md](./research.md) §1). All identifiers are app-generated UUID strings.

---

## Entities

### Album

A named, flat collection of photos. Never contains another album (FR-010).

| Field | Type | Notes / Rules |
|-------|------|---------------|
| `id` | `string` (UUID) | Primary key. |
| `title` | `string` | Required, non-empty after trim (FR-004). Max 200 chars. |
| `position` | `number` | Sort key for the single main-page list (FR-011, FR-012). Lower = earlier. Unique per store; reassigned on reorder. |
| `derivedDate` | `string \| null` (ISO date) | **Derived**, not user-set (FR-002a). Earliest `captureDate` among member photos; `null` when the album has no photos → UI shows "No date yet". Recomputed on every photo add/remove. |
| `photoCount` | `number` | Denormalized count for list display / empty-state decisions. Kept in sync with photos. |
| `createdAt` | `string` (ISO datetime) | Set on creation. |
| `updatedAt` | `string` (ISO datetime) | Bumped on any mutation (title, photos, position). |

**Relationships**: one Album → many Photos (1:N). Deleting an album cascades: all its photos and
their blobs are removed (FR-007).

**State / lifecycle**:
- *Created* → *empty* (`photoCount = 0`, `derivedDate = null`).
- *empty* ↔ *non-empty* as photos are added/removed; `derivedDate` recomputed on each transition
  and on any membership change.
- *Deleted* → record + member photos + blobs purged.

---

### Photo

A single image belonging to exactly one album (FR-005, FR-006). The same image bytes in another
album are a separate Photo record (clarification 3 / assumption: per-album scope).

| Field | Type | Notes / Rules |
|-------|------|---------------|
| `id` | `string` (UUID) | Primary key. |
| `albumId` | `string` | Foreign key → Album.id. Indexed. |
| `fileName` | `string` | Original file name (display only; not used for identity). |
| `mimeType` | `string` | Must be a supported image type (FR-016): `image/jpeg`, `image/png`, `image/gif`, `image/webp`. |
| `byteSize` | `number` | Original file size in bytes. |
| `contentHash` | `string` (SHA-256 hex) | Identity for de-dup (FR-016a). Unique per `albumId`. |
| `captureDate` | `string` (ISO date) | From EXIF `DateTimeOriginal`; falls back to `addedAt` date when absent (FR-002a). Feeds album `derivedDate`. |
| `addedAt` | `string` (ISO datetime) | When the user added it; also the capture-date fallback. |
| `width` | `number` | Intrinsic pixel width (for tile layout, avoids layout shift). |
| `height` | `number` | Intrinsic pixel height. |
| `order` | `number` | Display order of tiles within the album. |

**Relationships**: many Photos → one Album. A Photo's binary data lives in `PhotoBlob` keyed by
the same `id`.

---

### PhotoBlob (storage record, not a domain concept)

Binary payloads kept in a separate object store so metadata queries never deserialize image
bytes.

| Field | Type | Notes |
|-------|------|-------|
| `photoId` | `string` | Primary key = Photo.id. |
| `full` | `Blob` | Original image bytes (shown in the lightbox, FR-009). |
| `thumbnail` | `Blob` | Canvas-downscaled preview (~256px) for tiles (FR-008, SC-005). |

---

## IndexedDB layout

Database `photos-pad` (versioned). Object stores and indexes:

| Store | Key | Indexes |
|-------|-----|---------|
| `albums` | `id` | `by-position` (`position`) |
| `photos` | `id` | `by-album` (`albumId`), `by-album-order` (`[albumId, order]`), `by-album-hash` (`[albumId, contentHash]`, **unique**) |
| `photoBlobs` | `photoId` | — |

The unique `by-album-hash` index enforces per-album content de-duplication at the storage layer
(FR-016a), so a duplicate add fails fast and surfaces a "already in this album" message.

---

## Validation rules (from requirements)

- **Album title** required and non-empty (trimmed) on create (FR-004).
- **Supported formats only**: reject non-image or unsupported MIME on add; do not interrupt the
  rest of a multi-file selection (FR-016).
- **Corrupted image**: if decode/thumbnail generation fails, reject that file with a clear
  message and continue (FR-016 / Edge Case).
- **Per-album uniqueness**: `(albumId, contentHash)` must be unique; duplicate add is rejected
  with a message and creates no tile (FR-016a).
- **No nesting**: there is no album-parent field; albums cannot reference other albums (FR-010).
- **Derived date integrity**: `derivedDate` is never written directly by the UI; it is always the
  `min(captureDate)` of member photos, or `null` when empty (FR-002a).
- **Order persistence**: album `position` and photo `order` are persisted immediately on change
  so reloads preserve arrangement (FR-012, SC-004); an interrupted reorder keeps the last saved
  order (Edge Case).

---

## Derived/computed values

| Value | Computation | Trigger |
|-------|-------------|---------|
| `Album.derivedDate` | `min(photo.captureDate)` over album photos, else `null` | photo add/remove, album delete-of-photo |
| `Album.photoCount` | count of photos where `albumId = id` | photo add/remove |
| `Photo.captureDate` | EXIF `DateTimeOriginal` ?? date(`addedAt`) | on import |
| `Photo.contentHash` | SHA-256 of file bytes | on import |
