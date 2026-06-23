# Contract: Storage Repository API

**Feature**: 001-photo-album-organizer | **Phase**: 1

The repository (`lib/db/repository.ts`) is the only module that touches IndexedDB. UI components
call it; it never imports React. All methods are `async` and fully typed (TypeScript `strict`).
This is the application's primary internal interface — its contract below is the basis for the
storage-layer unit tests (run against `fake-indexeddb`).

## Types (shape reference — see `lib/types.ts`)

```ts
type Album = {
  id: string; title: string; position: number;
  derivedDate: string | null; photoCount: number;
  createdAt: string; updatedAt: string;
};

type Photo = {
  id: string; albumId: string; fileName: string; mimeType: string;
  byteSize: number; contentHash: string; captureDate: string;
  addedAt: string; width: number; height: number; order: number;
};

type PhotoWithThumb = Photo & { thumbnailUrl: string }; // object URL, caller revokes
```

## Album operations

| Method | Signature | Contract |
|--------|-----------|----------|
| `listAlbums` | `() => Promise<Album[]>` | Returns all albums ordered by ascending `position`. Empty array when none (drives main-page empty state, FR-015). |
| `createAlbum` | `(title: string) => Promise<Album>` | Trims `title`; **rejects** with `ValidationError` if empty. Assigns `position` = max+1 (appended to end), `derivedDate = null`, `photoCount = 0`. (FR-004) |
| `renameAlbum` | `(id: string, title: string) => Promise<Album>` | Trims, rejects empty; bumps `updatedAt`. |
| `deleteAlbum` | `(id: string) => Promise<void>` | Cascades: removes album, its photos, and their blobs in one transaction. No-op if absent. (FR-007) |
| `reorderAlbums` | `(orderedIds: string[]) => Promise<void>` | Persists a new full ordering by reassigning `position` to match array index. Must be atomic; partial failure leaves prior order intact (FR-012, SC-004). Unknown/missing ids → `ValidationError`. |

## Photo operations

| Method | Signature | Contract |
|--------|-----------|----------|
| `listPhotos` | `(albumId: string) => Promise<Photo[]>` | Photos for the album ordered by `order`. Empty array → album empty state (FR-015). |
| `getPhotoThumbnails` | `(albumId: string, range?: {start: number; end: number}) => Promise<PhotoWithThumb[]>` | Returns photos with a freshly created `thumbnailUrl` object URL for the requested (virtualized) range. Caller MUST revoke URLs on unmount. (FR-008, SC-005) |
| `getFullImageUrl` | `(photoId: string) => Promise<string>` | Object URL for the full image (lightbox, FR-009). Caller revokes. |
| `addPhotos` | `(albumId: string, files: File[]) => Promise<AddResult>` | Per-file pipeline: validate format → hash → de-dup check → EXIF date → thumbnail → persist. See result contract below. Recomputes album `derivedDate` + `photoCount` once at end. (FR-005, FR-002a, FR-016, FR-016a) |
| `removePhoto` | `(photoId: string) => Promise<void>` | Deletes photo + blob; recomputes owning album `derivedDate` + `photoCount`. (FR-006) |
| `reorderPhotos` | `(albumId: string, orderedIds: string[]) => Promise<void>` | Reassigns tile `order` within the album. Atomic. |

### `addPhotos` result contract

```ts
type AddOutcome =
  | { file: string; status: 'added'; photoId: string }
  | { file: string; status: 'rejected-format' }   // unsupported MIME (FR-016)
  | { file: string; status: 'rejected-corrupt' }   // decode/thumbnail failed (FR-016)
  | { file: string; status: 'duplicate' };         // same contentHash in album (FR-016a)

type AddResult = { outcomes: AddOutcome[] };        // one entry per input file, order preserved
```

- A rejected or duplicate file MUST NOT create a Photo, blob, or tile, and MUST NOT abort
  processing of the remaining files (FR-016, FR-016a, Edge Cases).
- `derivedDate` after the call = earliest `captureDate` among all album photos, or unchanged if
  no file was added.

## Error contract

- `ValidationError` — invalid input (empty title, unknown ids). Thrown (rejected promise).
- Per-file failures in `addPhotos` are **not** thrown; they are reported as `outcomes` so a
  multi-file add degrades gracefully.
- Storage/quota failures reject with a typed `StorageError` the UI surfaces as a non-destructive
  message.

## Invariants the repository guarantees

1. Albums always have contiguous, gap-tolerant `position` values yielding a stable total order.
2. `Album.derivedDate` is always `min(captureDate)` of members or `null` — never user-written.
3. `(albumId, contentHash)` is unique; the storage index enforces it.
4. Deleting an album leaves no orphan photos or blobs.
5. Every persisted `Photo` has a corresponding `PhotoBlob` (full + thumbnail).
