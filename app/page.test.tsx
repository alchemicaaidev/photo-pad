import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Page from './page';

expect.extend(toHaveNoViolations);

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
