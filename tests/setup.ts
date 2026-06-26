import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';

import { toHaveNoViolations } from 'jest-axe';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Register jest-axe matchers
expect.extend(toHaveNoViolations);

// Clean up DOM after each test
afterEach(() => {
  cleanup();
});
