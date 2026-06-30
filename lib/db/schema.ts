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

      // Albums store — guard object-store creation and each index individually
      // so future version bumps can add new indexes safely.
      if (!db.objectStoreNames.contains("albums")) {
        db.createObjectStore("albums", { keyPath: "id" });
      }
      const albumStore = (event.target as IDBOpenDBRequest).transaction!.objectStore("albums");
      if (!albumStore.indexNames.contains("by-position")) {
        albumStore.createIndex("by-position", "position", { unique: false });
      }

      // Photos store — same pattern: guard store + each index.
      if (!db.objectStoreNames.contains("photos")) {
        db.createObjectStore("photos", { keyPath: "id" });
      }
      const photoStore = (event.target as IDBOpenDBRequest).transaction!.objectStore("photos");
      if (!photoStore.indexNames.contains("by-album")) {
        photoStore.createIndex("by-album", "albumId", { unique: false });
      }
      if (!photoStore.indexNames.contains("by-album-order")) {
        photoStore.createIndex("by-album-order", ["albumId", "order"], {
          unique: false,
        });
      }
      if (!photoStore.indexNames.contains("by-album-hash")) {
        photoStore.createIndex("by-album-hash", ["albumId", "contentHash"], {
          unique: true,
        });
      }

      // PhotoBlobs store
      if (!db.objectStoreNames.contains("photoBlobs")) {
        db.createObjectStore("photoBlobs", { keyPath: "photoId" });
      }
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
