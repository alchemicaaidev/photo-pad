import { openDB, type DBSchema } from 'idb';

// --- Types (inline for schema typing; T005 will centralize in lib/types.ts) ---

export type Album = {
  id: string;
  title: string;
  position: number;
  derivedDate: string | null;
  photoCount: number;
  createdAt: string;
  updatedAt: string;
};

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

export type PhotoBlob = {
  photoId: string;
  full: Blob;
  thumbnail: Blob;
};

// --- IndexedDB Schema ---

export interface PhotosPadSchema extends DBSchema {
  albums: {
    key: string;
    value: Album;
    indexes: {
      'by-position': number;
    };
  };
  photos: {
    key: string;
    value: Photo;
    indexes: {
      'by-album': string;
      'by-album-order': [string, number];
      'by-album-hash': [string, string];
    };
  };
  photoBlobs: {
    key: string;
    value: PhotoBlob;
  };
}

export const DB_NAME = 'photos-pad' as const;
export const DB_VERSION = 1 as const;

export type PhotosDB = Awaited<ReturnType<typeof openPhotosDB>>;

export function openPhotosDB() {
  return openDB<PhotosPadSchema>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        const albums = db.createObjectStore('albums', { keyPath: 'id' });
        albums.createIndex('by-position', 'position');

        const photos = db.createObjectStore('photos', { keyPath: 'id' });
        photos.createIndex('by-album', 'albumId');
        photos.createIndex('by-album-order', ['albumId', 'order']);
        photos.createIndex(
          'by-album-hash',
          ['albumId', 'contentHash'],
          { unique: true },
        );

        db.createObjectStore('photoBlobs', { keyPath: 'photoId' });
      }
    },
  });
}
