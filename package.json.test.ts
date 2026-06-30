import { describe, it, expect } from 'vitest';

const pkg = require('./package.json') as {
  dependencies: Record<string, string>;
};

describe('package.json runtime dependencies', () => {
  it('includes idb with pinned version', () => {
    expect(pkg.dependencies).toHaveProperty('idb');
    expect(pkg.dependencies.idb).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('includes @dnd-kit/core with pinned version', () => {
    expect(pkg.dependencies).toHaveProperty('@dnd-kit/core');
    expect(pkg.dependencies['@dnd-kit/core']).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('includes @dnd-kit/sortable with pinned version', () => {
    expect(pkg.dependencies).toHaveProperty('@dnd-kit/sortable');
    expect(pkg.dependencies['@dnd-kit/sortable']).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('includes exifr with pinned version', () => {
    expect(pkg.dependencies).toHaveProperty('exifr');
    expect(pkg.dependencies.exifr).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('includes @tanstack/react-virtual with pinned version', () => {
    expect(pkg.dependencies).toHaveProperty('@tanstack/react-virtual');
    expect(pkg.dependencies['@tanstack/react-virtual']).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
