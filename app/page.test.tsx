import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
<<<<<<< HEAD
import { axe, toHaveNoViolations } from 'jest-axe';
import Page from './page';

expect.extend(toHaveNoViolations);

=======
<<<<<<< HEAD
import { axe } from 'jest-axe';
import Page from './page';

=======
import { axe, toHaveNoViolations } from 'jest-axe';
import Page from './page';

expect.extend(toHaveNoViolations);

>>>>>>> 0582dd3 (feat: configure ESLint, Prettier, and testing setup (ALC-37))
>>>>>>> 354eb02 (feat: configure ESLint, Prettier, and testing setup (ALC-37))
describe('Home Page', () => {
  it('renders the heading', () => {
    render(<Page />);
    expect(screen.getByRole('heading', { name: /Photo Pad/i })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Page />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
