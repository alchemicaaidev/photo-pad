import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';

expect.extend(toHaveNoViolations);
// A minimal component for jest-axe testing
function AccessibleButton({ label }: { label: string }) {
  return <button type="button">{label}</button>;
}

// A minimal component for jest-axe testing (with an actual violation to detect)
function InaccessibleImage({ src }: { src: string }) {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <img src={src} />;
}

describe('vitest config harness', () => {
  afterEach(() => {
    cleanup();
  });

  it('has jest-dom matchers available', () => {
    const div = document.createElement('div');
    div.setAttribute('data-testid', 'test-div');
    document.body.appendChild(div);
    expect(div).toBeInTheDocument();
    document.body.removeChild(div);
  });

  it('has fake-indexeddb available', async () => {
    expect(typeof indexedDB).toBe('object');
    const request = indexedDB.open('test-db', 1);
    await new Promise<void>((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        db.close();
        resolve();
      };
      request.onupgradeneeded = () => {
        const db = request.result;
        db.createObjectStore('test-store', { keyPath: 'id' });
      };
    });
  });

  it('renders with React Testing Library', () => {
    render(<AccessibleButton label="Click me" />);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('has jest-axe and passes for accessible markup', async () => {
    const { container } = render(<AccessibleButton label="Accessible" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has jest-axe and detects violations in inaccessible markup', async () => {
    const { container } = render(<InaccessibleImage src="test.png" />);
    const results = await axe(container);
    expect(results.violations.length).toBeGreaterThan(0);
  });
});
