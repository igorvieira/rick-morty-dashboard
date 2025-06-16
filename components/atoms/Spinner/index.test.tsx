import { render, screen, cleanup } from '@testing-library/react';
import { test, expect, afterEach, vi } from 'vitest';
import { Spinner } from './';

// Mock do ícone Lucide
vi.mock('lucide-react', () => ({
  Loader2: ({ className }: {
    className?: string;
  }) => (
    <div data-testid="loader-icon" className={className} />
  ),
}));

afterEach(() => {
  cleanup();
});

test('renders with default size and classes', () => {
  render(<Spinner />);
  const spinner = screen.getByTestId('loader-icon');

  expect(spinner).toHaveClass('animate-spin', 'text-gray-950', 'h-8', 'w-8');
});

test('applies correct size classes', () => {
  const { rerender } = render(<Spinner size="sm" />);
  expect(screen.getByTestId('loader-icon')).toHaveClass('h-4', 'w-4');

  rerender(<Spinner size="lg" />);
  expect(screen.getByTestId('loader-icon')).toHaveClass('h-12', 'w-12');
});

test('merges custom className with default classes', () => {
  render(<Spinner className="custom-class text-blue-500" />);
  const spinner = screen.getByTestId('loader-icon');

  expect(spinner).toHaveClass('custom-class', 'text-blue-500', 'animate-spin', 'h-8', 'w-8');
});
