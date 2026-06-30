import { describe, it, expect, beforeEach } from 'vitest';
import { deleteDB } from 'idb';
import { openPhotosDB, DB_NAME, type PhotosDB } from './schema';

async function withDB<T>(fn: (db: PhotosDB) => Promise<T>): Promise<T> {
  const db = await openPhotosDB();
  try {
    return await fn(db);
  } finally {
    db.close();
  }
}

describe('schema', () => {
  beforeEach(async () => {
    await deleteDB(DB_NAME, { blocked: () => {} });
  });

  it('opens the database and creates all three object stores', async () => {
    await withDB(async (db) => {
      expect(db.objectStoreNames.contains('albums')).toBe(true);
      expect(db.objectStoreNames.contains('photos')).toBe(true);
      expect(db.objectStoreNames.contains('photoBlobs')).toBe(true);
    });
  });

  it('albums store has keyPath id and index by-position on position', async () => {
    await withDB(async (db) => {
      const tx = db.transaction('albums', 'readonly');
      const store = tx.objectStore('albums');

      expect(store.keyPath).toBe('id');
      expect(store.indexNames.contains('by-position')).toBe(true);

      const index = store.index('by-position');
      expect(index.keyPath).toBe('position');
      expect(index.unique).toBe(false);
      expect(index.multiEntry).toBe(false);

      await tx.done;
    });
  });

  it('photos store has keyPath id and three indexes', async () => {
    await withDB(async (db) => {
      const tx = db.transaction('photos', 'readonly');
      const store = tx.objectStore('photos');

      expect(store.keyPath).toBe('id');

      expect(store.indexNames.contains('by-album')).toBe(true);
      expect(store.indexNames.contains('by-album-order')).toBe(true);
      expect(store.indexNames.contains('by-album-hash')).toBe(true);

      const byAlbum = store.index('by-album');
      expect(byAlbum.keyPath).toBe('albumId');
      expect(byAlbum.unique).toBe(false);

      const byAlbumOrder = store.index('by-album-order');
      expect(byAlbumOrder.keyPath).toEqual(['albumId', 'order']);
      expect(byAlbumOrder.unique).toBe(false);

      const byAlbumHash = store.index('by-album-hash');
      expect(byAlbumHash.keyPath).toEqual(['albumId', 'contentHash']);
      expect(byAlbumHash.unique).toBe(true);

      await tx.done;
    });
  });

  it('photoBlobs store has keyPath photoId and no indexes', async () => {
    await withDB(async (db) => {
      const tx = db.transaction('photoBlobs', 'readonly');
      const store = tx.objectStore('photoBlobs');

      expect(store.keyPath).toBe('photoId');
      expect(store.indexNames).toHaveLength(0);

      await tx.done;
    });
  });

  it('by-album-hash enforces uniqueness per album', async () => {
    await withDB(async (db) => {
      await db.add('albums', {
        id: 'album-1',
        title: 'Album 1',
        position: 1,
        derivedDate: null,
        photoCount: 0,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      });

      await db.add('photos', {
        id: 'photo-1',
        albumId: 'album-1',
        fileName: 'a.jpg',
        mimeType: 'image/jpeg',
        byteSize: 1000,
        contentHash: 'abc123',
        captureDate: '2026-01-01',
        addedAt: '2026-01-01T00:00:00Z',
        width: 100,
        height: 100,
        order: 1,
      });

      await expect(
        db.add('photos', {
          id: 'photo-2',
          albumId: 'album-1',
          fileName: 'b.jpg',
          mimeType: 'image/jpeg',
          byteSize: 2000,
          contentHash: 'abc123',
          captureDate: '2026-01-02',
          addedAt: '2026-01-01T00:00:00Z',
          width: 200,
          height: 200,
          order: 2,
        }),
      ).rejects.toThrow(/constraint was not satisfied/);
    });
  });
});
