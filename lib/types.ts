/**
 * Domain types for the Photo Album Organizer feature.
 *
 * Derived from specs/001-photo-album-organizer/data-model.md and
 * specs/001-photo-album-organizer/contracts/storage-repository.md.
 */

/**
 * A named, flat collection of photos. Never contains another album.
 */
export type Album = {
  id: string;
  title: string;
  position: number;
  derivedDate: string | null;
  photoCount: number;
  createdAt: string;
  updatedAt: string;
};

/**
 * A single image belonging to exactly one album.
 * The same image bytes in another album are a separate Photo record.
 */
export type Photo = {
  id: string;
  albumId: string;
  fileName: string;
  mimeType: string;
  byteSize: number;
  contentHash: string;
  captureDate: string;
  addedAt: string;
  width: number;
  height: number;
  order: number;
};

/**
 * Binary payloads kept in a separate object store so metadata queries
 * never deserialize image bytes.
 */
export type PhotoBlob = {
  photoId: string;
  full: Blob;
  thumbnail: Blob;
};

/**
 * Result of adding a single file to an album.
 */
export type AddOutcome =
  | { file: string; status: 'added'; photoId: string }
  | { file: string; status: 'rejected-format' }
  | { file: string; status: 'rejected-corrupt' }
  | { file: string; status: 'duplicate' };

/**
 * Aggregate result from adding one or more photos to an album.
 * Contains one entry per input file, in input order.
 */
export type AddResult = {
  outcomes: AddOutcome[];
};

/**
 * Error thrown for invalid input (e.g., empty title, unknown ids).
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Error thrown for storage/quota failures.
 */
export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Photo augmented with a freshly created thumbnail object URL.
 * The caller is responsible for revoking the URL when done.
 */
export type PhotoWithThumb = Photo & {
  thumbnailUrl: string;
};
