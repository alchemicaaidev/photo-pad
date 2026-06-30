/**
 * IndexedDB schema definition for the Photo Album Organizer.
 *
 * Creates / opens the `photos-pad` database (version 1) with the
 * following object stores and indexes:
 *
 * - `albums` — keyPath: `id`
 *   - `by-position` (non-unique)
 *
 * - `photos` — keyPath: `id`
 *   - `by-album` (non-unique, single key `albumId`)
 *   - `by-album-order` (non-unique, compound [`albumId`, `order`])
 *   - `by-album-hash` (unique, compound [`albumId`, `contentHash`])
 *
 * - `photoBlobs` — keyPath: `photoId`
 */

export function openSchemaDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("photos-pad", 1);
    request.onerror = () => reject(request.error);
    request.onblocked = () =>
      reject(new Error("Database open blocked: close older connections first"));
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Albums store
      const albumStore = db.createObjectStore("albums", { keyPath: "id" });
      albumStore.createIndex("by-position", "position", { unique: false });

      // Photos store
      const photoStore = db.createObjectStore("photos", { keyPath: "id" });
      photoStore.createIndex("by-album", "albumId", { unique: false });
      photoStore.createIndex("by-album-order", ["albumId", "order"], {
        unique: false,
      });
      photoStore.createIndex("by-album-hash", ["albumId", "contentHash"], {
        unique: true,
      });

      // PhotoBlobs store
      db.createObjectStore("photoBlobs", { keyPath: "photoId" });
    };
  });
}

export function deleteSchemaDb(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase("photos-pad");
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
    request.onblocked = () =>
      reject(new Error("Database delete blocked: close all connections first"));
  });
}
