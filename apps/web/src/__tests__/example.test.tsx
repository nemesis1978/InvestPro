import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

// Estendi expect con i matcher di jest-dom
import '@testing-library/jest-dom/vitest';

describe('Example Test Suite', () => {
  it('renders a button with text', () => {
    render(<Button>Test Button</Button>);
    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('inline-flex');
    expect(button).toHaveTextContent('Test Button');
  });

  it('applies default variant and size classes', () => {
    render(<Button>Test</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'bg-zinc-900',
      'text-zinc-50',
      'h-9',
      'px-4',
      'py-2'
    );
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
});
