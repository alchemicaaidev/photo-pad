import { describe, expect, it } from 'vitest';
import {
  type Album,
  type Photo,
  type PhotoBlob,
  type AddOutcome,
  type AddResult,
  type PhotoWithThumb,
  ValidationError,
  StorageError,
} from './types';

describe('domain types', () => {
  describe('Album', () => {
    it('has the expected shape', () => {
      const album: Album = {
        id: 'album-1',
        title: 'Summer Vacation',
        position: 1,
        derivedDate: '2024-07-15',
        photoCount: 42,
        createdAt: '2024-07-01T00:00:00Z',
        updatedAt: '2024-07-10T00:00:00Z',
      };

      expect(album.id).toBe('album-1');
      expect(album.title).toBe('Summer Vacation');
      expect(album.position).toBe(1);
      expect(album.derivedDate).toBe('2024-07-15');
      expect(album.photoCount).toBe(42);
      expect(album.createdAt).toBe('2024-07-01T00:00:00Z');
      expect(album.updatedAt).toBe('2024-07-10T00:00:00Z');
    });

    it('allows derivedDate to be null when album has no photos', () => {
      const album: Album = {
        id: 'album-2',
        title: 'Empty Album',
        position: 0,
        derivedDate: null,
        photoCount: 0,
        createdAt: '2024-07-01T00:00:00Z',
        updatedAt: '2024-07-01T00:00:00Z',
      };

      expect(album.derivedDate).toBeNull();
      expect(album.photoCount).toBe(0);
    });
  });

  describe('Photo', () => {
    it('has the expected shape', () => {
      const photo: Photo = {
        id: 'photo-1',
        albumId: 'album-1',
        fileName: 'beach.jpg',
        mimeType: 'image/jpeg',
        byteSize: 1_024_000,
        contentHash: 'a'.repeat(64),
        captureDate: '2024-07-15',
        addedAt: '2024-07-20T12:00:00Z',
        width: 1920,
        height: 1080,
        order: 0,
      };

      expect(photo.id).toBe('photo-1');
      expect(photo.albumId).toBe('album-1');
      expect(photo.fileName).toBe('beach.jpg');
      expect(photo.mimeType).toBe('image/jpeg');
      expect(photo.byteSize).toBe(1_024_000);
      expect(photo.contentHash).toHaveLength(64);
      expect(photo.captureDate).toBe('2024-07-15');
      expect(photo.addedAt).toBe('2024-07-20T12:00:00Z');
      expect(photo.width).toBe(1920);
      expect(photo.height).toBe(1080);
      expect(photo.order).toBe(0);
    });
  });

  describe('PhotoBlob', () => {
    it('has the expected shape', () => {
      const fullBlob = new Blob(['full image data'], { type: 'image/jpeg' });
      const thumbBlob = new Blob(['thumb data'], { type: 'image/jpeg' });

      const photoBlob: PhotoBlob = {
        photoId: 'photo-1',
        full: fullBlob,
        thumbnail: thumbBlob,
      };

      expect(photoBlob.photoId).toBe('photo-1');
      expect(photoBlob.full).toBe(fullBlob);
      expect(photoBlob.thumbnail).toBe(thumbBlob);
    });
  });

  describe('PhotoWithThumb', () => {
    it('extends Photo with thumbnailUrl', () => {
      const photo: PhotoWithThumb = {
        id: 'photo-1',
        albumId: 'album-1',
        fileName: 'beach.jpg',
        mimeType: 'image/jpeg',
        byteSize: 1_024_000,
        contentHash: 'a'.repeat(64),
        captureDate: '2024-07-15',
        addedAt: '2024-07-20T12:00:00Z',
        width: 1920,
        height: 1080,
        order: 0,
        thumbnailUrl: 'blob:mock-url',
      };

      expect(photo.thumbnailUrl).toBe('blob:mock-url');
      expect(photo.id).toBe('photo-1');
    });
  });

  describe('AddOutcome', () => {
    it('supports the added status', () => {
      const outcome: AddOutcome = {
        file: 'beach.jpg',
        status: 'added',
        photoId: 'photo-1',
      };

      expect(outcome.file).toBe('beach.jpg');
      expect(outcome.status).toBe('added');
      expect('photoId' in outcome && outcome.photoId).toBe('photo-1');
    });

    it('supports the rejected-format status', () => {
      const outcome: AddOutcome = { file: 'doc.pdf', status: 'rejected-format' };
      expect(outcome.status).toBe('rejected-format');
      expect('photoId' in outcome).toBe(false);
    });

    it('supports the rejected-corrupt status', () => {
      const outcome: AddOutcome = {
        file: 'corrupt.jpg',
        status: 'rejected-corrupt',
      };
      expect(outcome.status).toBe('rejected-corrupt');
      expect('photoId' in outcome).toBe(false);
    });

    it('supports the duplicate status', () => {
      const outcome: AddOutcome = { file: 'dup.jpg', status: 'duplicate' };
      expect(outcome.status).toBe('duplicate');
      expect('photoId' in outcome).toBe(false);
    });
  });

  describe('AddResult', () => {
    it('contains outcomes in input order', () => {
      const result: AddResult = {
        outcomes: [
          { file: 'a.jpg', status: 'added', photoId: 'p-1' },
          { file: 'b.pdf', status: 'rejected-format' },
          { file: 'c.jpg', status: 'duplicate' },
        ],
      };

      expect(result.outcomes).toHaveLength(3);
      expect(result.outcomes[0].status).toBe('added');
      expect(result.outcomes[1].status).toBe('rejected-format');
      expect(result.outcomes[2].status).toBe('duplicate');
    });
  });

  describe('ValidationError', () => {
    it('is an instance of Error', () => {
      const error = new ValidationError('title is required');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ValidationError);
    });

    it('has the correct name and message', () => {
      const error = new ValidationError('invalid id');
      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe('invalid id');
    });
  });

  describe('StorageError', () => {
    it('is an instance of Error', () => {
      const error = new StorageError('quota exceeded');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(StorageError);
    });

    it('has the correct name and message', () => {
      const error = new StorageError('indexeddb unavailable');
      expect(error.name).toBe('StorageError');
      expect(error.message).toBe('indexeddb unavailable');
    });
  });
});
