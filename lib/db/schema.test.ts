import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { openSchemaDb, deleteSchemaDb } from './schema';

/**
 * Adds a single record to an IndexedDB object store and resolves/rejects
 * with a standard Promise so tests can use `await`.
 */
function addRecord<T>(
  store: IDBObjectStore,
  record: T
): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = store.add(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Adds two records sequentially, expecting the second add to fail with a
 * ConstraintError. Resolves when the expected error is observed.
 */
function addExpectingConstraintError<T>(
  store: IDBObjectStore,
  first: T,
  second: T
): Promise<void> {
  return new Promise((resolve, reject) => {
    const req1 = store.add(first);
    req1.onsuccess = () => {
      const req2 = store.add(second);
      req2.onsuccess = () => reject(new Error('Expected duplicate add to fail'));
      req2.onerror = () => {
        expect(req2.error?.name).toBe('ConstraintError');
        resolve();
      };
    };
    req1.onerror = () => reject(req1.error);
  });
}

describe('IndexedDB schema (T007)', () => {
  let db: IDBDatabase;

  beforeEach(async () => {
    await deleteSchemaDb();
    db = await openSchemaDb();
  });

  afterEach(async () => {
    db.close();
  });

  it('has all required object stores', () => {
    const storeNames = Array.from(db.objectStoreNames);
    expect(storeNames).toContain('albums');
    expect(storeNames).toContain('photos');
    expect(storeNames).toContain('photoBlobs');
    expect(storeNames).toHaveLength(3);
  });

  it('albums store has keyPath id and by-position index', () => {
    const transaction = db.transaction('albums', 'readonly');
    const store = transaction.objectStore('albums');

    expect(store.keyPath).toBe('id');
    expect(store.autoIncrement).toBe(false);

    const index = store.index('by-position');
    expect(index).toBeDefined();
    expect(index.keyPath).toBe('position');
    expect(index.unique).toBe(false);
    expect(index.multiEntry).toBe(false);
  });

  it('photos store has keyPath id and all required indexes', () => {
    const transaction = db.transaction('photos', 'readonly');
    const store = transaction.objectStore('photos');

    expect(store.keyPath).toBe('id');
    expect(store.autoIncrement).toBe(false);

    const byAlbum = store.index('by-album');
    expect(byAlbum).toBeDefined();
    expect(byAlbum.keyPath).toBe('albumId');
    expect(byAlbum.unique).toBe(false);
    expect(byAlbum.multiEntry).toBe(false);

    const byAlbumOrder = store.index('by-album-order');
    expect(byAlbumOrder).toBeDefined();
    expect(byAlbumOrder.keyPath).toEqual(['albumId', 'order']);
    expect(byAlbumOrder.unique).toBe(false);
    expect(byAlbumOrder.multiEntry).toBe(false);

    const byAlbumHash = store.index('by-album-hash');
    expect(byAlbumHash).toBeDefined();
    expect(byAlbumHash.keyPath).toEqual(['albumId', 'contentHash']);
    expect(byAlbumHash.unique).toBe(true);
    expect(byAlbumHash.multiEntry).toBe(false);
  });

  it('photoBlobs store has keyPath photoId', () => {
    const transaction = db.transaction('photoBlobs', 'readonly');
    const store = transaction.objectStore('photoBlobs');

    expect(store.keyPath).toBe('photoId');
    expect(store.autoIncrement).toBe(false);
  });

  it('enforces unique constraint on (albumId, contentHash) via by-album-hash', async () => {
    const transaction = db.transaction('photos', 'readwrite');
    const store = transaction.objectStore('photos');

    await addExpectingConstraintError(store, {
      id: 'photo-1',
      albumId: 'album-1',
      contentHash: 'hash-a',
      fileName: 'a.jpg',
      order: 0,
    }, {
      id: 'photo-2',
      albumId: 'album-1',
      contentHash: 'hash-a',
      fileName: 'b.jpg',
      order: 1,
    });
  });

  it('allows same contentHash in different albums', async () => {
    const transaction = db.transaction('photos', 'readwrite');
    const store = transaction.objectStore('photos');

    await addRecord(store, {
      id: 'photo-3',
      albumId: 'album-1',
      contentHash: 'hash-shared',
      fileName: 'a.jpg',
      order: 0,
    });
    await addRecord(store, {
      id: 'photo-4',
      albumId: 'album-2',
      contentHash: 'hash-shared',
      fileName: 'b.jpg',
      order: 0,
    });
  });

  it('allows different contentHashes in same album', async () => {
    const transaction = db.transaction('photos', 'readwrite');
    const store = transaction.objectStore('photos');

    await addRecord(store, {
      id: 'photo-5',
      albumId: 'album-3',
      contentHash: 'hash-x',
      fileName: 'x.jpg',
      order: 0,
    });
    await addRecord(store, {
      id: 'photo-6',
      albumId: 'album-3',
      contentHash: 'hash-y',
      fileName: 'y.jpg',
      order: 1,
    });
  });
});
