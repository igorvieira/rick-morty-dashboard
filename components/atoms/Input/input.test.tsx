import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { test, expect, vi, afterEach } from 'vitest';
import { createRef } from 'react';
import { Input } from './';

afterEach(() => {
  cleanup();
});

test('renders input with default classes', () => {
  render(<Input placeholder="Test input" />);
  const input = screen.getByPlaceholderText('Test input');

  expect(input).toHaveClass(
    'w-full',
    'px-3',
    'py-2',
    'border',
    'border-gray-300',
    'text-black',
    'rounded-lg'
  );
});

test('shows error message and applies error styles', () => {
  render(<Input error="Required field" placeholder="Test input" />);
  const input = screen.getByPlaceholderText('Test input');

  expect(input).toHaveClass('border-red-500');
  expect(screen.getByText('Required field')).toBeInTheDocument();
  expect(screen.getByText('Required field')).toHaveClass('text-red-600');
});

test('forwards ref correctly', () => {
  const ref = createRef<HTMLInputElement>();
  render(<Input ref={ref} />);

  expect(ref.current).toBeInstanceOf(HTMLInputElement);
  expect(ref.current?.tagName).toBe('INPUT');
});

test('handles input events and custom props', () => {
  const handleChange = vi.fn();
  render(
    <Input
      onChange={handleChange}
      className="custom-class"
      data-testid="test-input"
      type="email"
    />
  );

  const input = screen.getByTestId('test-input');
  expect(input).toHaveClass('custom-class');
  expect(input).toHaveAttribute('type', 'email');

  fireEvent.change(input, { target: { value: 'test@example.com' } });
  expect(handleChange).toHaveBeenCalledTimes(1);
});
