import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { test, expect, vi, afterEach } from 'vitest';
import { Button } from './';

afterEach(() => {
  cleanup();
});

test('renders with default props and children', () => {
  render(<Button>Click me</Button>);
  const button = screen.getByRole('button');

  expect(screen.getByText('Click me')).toBeInTheDocument();
  expect(button).toHaveClass('bg-blue-600', 'text-white', 'px-4', 'py-2');
});

test('applies variant classes correctly', () => {
  render(<Button variant="secondary">Secondary</Button>);
  expect(screen.getByText('Secondary')).toHaveClass('bg-gray-200', 'text-gray-900');
});

test('applies size classes correctly', () => {
  render(<Button size="sm">Small</Button>);
  expect(screen.getByText('Small')).toHaveClass('px-3', 'py-1.5', 'text-sm');
});

test('handles custom className and HTML attributes', () => {
  const handleClick = vi.fn();

  render(
    <Button
      className="custom-class"
      onClick={handleClick}
      data-testid="test-btn"
    >
      Test
    </Button>
  );

  const button = screen.getByTestId('test-btn');
  expect(button).toHaveClass('custom-class', 'bg-blue-600');

  fireEvent.click(button);
  expect(handleClick).toHaveBeenCalledTimes(1);
});